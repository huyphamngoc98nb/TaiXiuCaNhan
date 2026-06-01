import { useCallback, useEffect, useState } from 'react';
import { loanListDeps } from '@/core/di/loans.di';
import type { LoanFilter, LoanWithSummary } from '../domain/loan.model';
import { listLoans as listLoansService } from '../services/list-loans';

const EMPTY_LOAN_FILTER: LoanFilter = {};

export function useLoans(filter?: LoanFilter) {
  const effectiveFilter = filter ?? EMPTY_LOAN_FILTER;
  const [loans, setLoans] = useState<LoanWithSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listLoansService(effectiveFilter, loanListDeps);
      setLoans(data);
    } catch (err) {
      const nextError = err instanceof Error ? err : new Error(String(err));
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, [effectiveFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  return { loans, loading, error, reload: load };
}
