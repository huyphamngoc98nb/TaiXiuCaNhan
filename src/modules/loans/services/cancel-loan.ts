import type { Loan } from '../domain/loan.model';
import type { ILoanRepository } from '../repositories/loan.repository';

export interface CancelLoanDeps {
  loanRepo: ILoanRepository;
}

export async function cancelLoan(
  loanId: string,
  deps: CancelLoanDeps
): Promise<Loan | null> {
  const loan = await deps.loanRepo.getLoanById(loanId);
  if (!loan) throw new Error('Loan not found');
  if (loan.status === 'settled') {
    throw new Error('Không thể hủy khoản đã tất toán');
  }

  return deps.loanRepo.updateLoanStatus(loanId, 'cancelled', Date.now());
}
