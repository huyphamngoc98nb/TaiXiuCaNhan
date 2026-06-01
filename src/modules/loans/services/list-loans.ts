import type { LoanFilter, LoanWithSummary } from '../domain/loan.model';
import type { ILoanRepository } from '../repositories/loan.repository';

export interface ListLoansDeps {
  loanRepo: ILoanRepository;
}

export async function listLoans(
  filter: LoanFilter,
  deps: ListLoansDeps
): Promise<LoanWithSummary[]> {
  return deps.loanRepo.listLoans(filter);
}
