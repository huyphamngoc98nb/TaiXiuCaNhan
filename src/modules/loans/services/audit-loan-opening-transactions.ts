import { sqliteTransactionRunner as runInTransaction } from '@/core/db/transaction-runner';
import { logger } from '@/core/telemetry/logger';
import type { Transaction } from '@/modules/transactions/domain/transaction.model';
import type { ITransactionRepository } from '@/modules/transactions/repositories/transaction.repository';
import { getSourceDelta } from '@/modules/transactions/services/transaction-wallet-rules';
import type { IWalletRepository } from '@/modules/wallets/repositories/wallet.repository';
import type { ILoanRepository } from '../repositories/loan.repository';
import type { LoanCategoryRepository } from './create-loan';

const DEFAULT_MAX_CREATED_AT_DELTA_MS = 5 * 60 * 1000;

export interface LoanOpeningAuditFinding {
  loan_id: string;
  linked_transaction_id: string;
  candidate_transaction_id: string;
  repair_eligible: boolean;
  repaired: boolean;
  reason: 'strong_duplicate';
}

export interface LoanOpeningAuditResult {
  findings: LoanOpeningAuditFinding[];
  repaired_count: number;
}

export interface LoanOpeningAuditDeps {
  loanRepo: ILoanRepository;
  transactionRepo: ITransactionRepository;
  walletRepo: IWalletRepository;
  categoryRepo: LoanCategoryRepository;
}

export interface LoanOpeningAuditOptions {
  repair?: boolean;
  maxCreatedAtDeltaMs?: number;
}

function hasCompatibleSource(candidate: Transaction, loanId: string): boolean {
  const hasNoSource = candidate.source_type == null &&
    candidate.source_id == null &&
    candidate.source_event == null;
  const isSameOpeningSource = candidate.source_type === 'loan' &&
    candidate.source_id === loanId &&
    candidate.source_event === 'opening';
  return hasNoSource || isSameOpeningSource;
}

function isStrongDuplicate(
  candidate: Transaction,
  linked: Transaction,
  loanId: string,
  maxCreatedAtDeltaMs: number
): boolean {
  return candidate.id !== linked.id &&
    candidate.deleted_at === null &&
    candidate.wallet_id === linked.wallet_id &&
    candidate.category_id === linked.category_id &&
    candidate.type === linked.type &&
    candidate.amount === linked.amount &&
    candidate.note === linked.note &&
    candidate.transaction_date === linked.transaction_date &&
    Math.abs(candidate.created_at - linked.created_at) <= maxCreatedAtDeltaMs &&
    hasCompatibleSource(candidate, loanId);
}

async function getChoVayCategoryId(categoryRepo: LoanCategoryRepository): Promise<string | null> {
  const lookup = categoryRepo.getBySlug ?? categoryRepo.findBySlug;
  if (lookup) {
    const category = await lookup.call(categoryRepo, 'cho_vay');
    if (category?.slug === 'cho_vay' && category.type === 'expense') return category.id;
  }

  const categories = await categoryRepo.list('expense');
  return categories.find((category) => category.slug === 'cho_vay')?.id ?? null;
}

/**
 * Audits before mutating. Repair is opt-in and only touches a narrow duplicate:
 * same linked loan, wallet/category/type/amount/note/date, and near-identical creation time.
 * Unlinked legacy transactions that do not match a linked row are intentionally preserved.
 */
export async function auditLoanOpeningTransactions(
  deps: LoanOpeningAuditDeps,
  options: LoanOpeningAuditOptions = {}
): Promise<LoanOpeningAuditResult> {
  const maxCreatedAtDeltaMs = options.maxCreatedAtDeltaMs ?? DEFAULT_MAX_CREATED_AT_DELTA_MS;
  const [loans, transactions, choVayCategoryId] = await Promise.all([
    deps.loanRepo.listLoans({ includeDeleted: true }),
    deps.transactionRepo.list({ includeDeleted: false }),
    getChoVayCategoryId(deps.categoryRepo),
  ]);

  if (!choVayCategoryId) {
    logger.warn('Loan opening audit skipped because the cho_vay category was not found.', {
      context: 'LoanOpeningTransactionAudit',
    });
    return { findings: [], repaired_count: 0 };
  }

  const transactionsById = new Map(transactions.map((transaction) => [transaction.id, transaction]));
  const linkedTransactionIds = new Set(
    loans.flatMap((loan) => loan.linked_transaction_id ? [loan.linked_transaction_id] : [])
  );
  const potentialFindings: LoanOpeningAuditFinding[] = [];

  for (const loan of loans) {
    if (loan.deleted_at !== null || loan.type !== 'lend' || !loan.linked_transaction_id) continue;
    const linked = transactionsById.get(loan.linked_transaction_id);
    if (!linked || linked.category_id !== choVayCategoryId || linked.type !== 'expense') continue;

    for (const candidate of transactions) {
      if (linkedTransactionIds.has(candidate.id)) continue;
      if (!isStrongDuplicate(candidate, linked, loan.id, maxCreatedAtDeltaMs)) continue;
      potentialFindings.push({
        loan_id: loan.id,
        linked_transaction_id: linked.id,
        candidate_transaction_id: candidate.id,
        repair_eligible: true,
        repaired: false,
        reason: 'strong_duplicate',
      });
    }
  }

  const matchCounts = new Map<string, number>();
  for (const finding of potentialFindings) {
    matchCounts.set(
      finding.candidate_transaction_id,
      (matchCounts.get(finding.candidate_transaction_id) ?? 0) + 1
    );
  }
  // A candidate matching more than one loan is ambiguous, so audit leaves it untouched.
  const findings = potentialFindings.filter(
    (finding) => matchCounts.get(finding.candidate_transaction_id) === 1
  );

  logger.info(`Loan opening audit detected ${findings.length} strong duplicate(s).`, {
    context: 'LoanOpeningTransactionAudit',
    metadata: { repairRequested: options.repair === true },
  });

  if (!options.repair) return { findings, repaired_count: 0 };

  let repairedCount = 0;
  for (const finding of findings) {
    const candidate = transactionsById.get(finding.candidate_transaction_id);
    if (!candidate) continue;

    const repaired = await runInTransaction(async () => {
      const wasDeleted = await deps.transactionRepo.softDelete(candidate.id, Date.now());
      if (!wasDeleted) return false;
      await deps.walletRepo.updateBalanceDelta(
        candidate.wallet_id,
        -getSourceDelta(candidate.type, candidate.amount),
        Date.now()
      );
      return true;
    });

    if (!repaired) continue;
    finding.repaired = true;
    repairedCount += 1;
    logger.warn(`Loan opening audit soft-deleted duplicate transaction ${candidate.id}.`, {
      context: 'LoanOpeningTransactionAudit',
      metadata: {
        loanId: finding.loan_id,
        keptTransactionId: finding.linked_transaction_id,
        reversedWalletId: candidate.wallet_id,
        reversedAmount: candidate.amount,
      },
    });
  }

  return { findings, repaired_count: repairedCount };
}
