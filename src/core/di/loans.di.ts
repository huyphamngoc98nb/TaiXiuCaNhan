import { appRepositories } from '@/core/repositories/app-repositories';

export const loanRepository = appRepositories.loan;
export const loanCategoryRepository = appRepositories.category;

export const loanServiceDeps = {
  loanRepo: loanRepository,
  transactionRepo: appRepositories.transaction,
  walletRepo: appRepositories.wallet,
  categoryRepo: loanCategoryRepository,
};

export const loanMutationDeps = {
  loanRepo: loanRepository,
  transactionRepo: appRepositories.transaction,
  walletRepo: appRepositories.wallet,
  categoryRepo: loanCategoryRepository,
};

export const loanListDeps = {
  loanRepo: loanRepository,
};
