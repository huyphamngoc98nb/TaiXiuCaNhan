import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { BackButton } from '@/shared/components/BackButton';
import { BottomSheet } from '@/shared/components/BottomSheet';
import { ROUTES } from '@/shared/constants/routes';
import type { CreateLoanInput, LoanFilter, LoanType } from '../domain/loan.model';
import { LoanCard } from '../components/LoanCard';
import { LoanForm } from '../components/LoanForm';
import { useLoans } from '../hooks/useLoans';
import { useLoanMutations } from '../hooks/useLoanMutations';

type FilterTab = 'all' | LoanType | 'settled';

const FILTER_TABS: Array<{ id: FilterTab; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'lend', label: 'Cho vay' },
  { id: 'borrow', label: 'Vay nợ' },
  { id: 'settled', label: 'Đã tất toán' },
];

function filterFromTab(tab: FilterTab): LoanFilter {
  if (tab === 'lend' || tab === 'borrow') return { type: tab };
  if (tab === 'settled') return { status: 'settled' };
  return {};
}

export function LoanListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [formOpen, setFormOpen] = useState(false);
  const filter = useMemo(() => filterFromTab(activeTab), [activeTab]);
  const { loans, loading, error, reload } = useLoans(filter);
  const { createLoan, loading: mutationLoading } = useLoanMutations();

  async function handleCreateLoan(input: CreateLoanInput) {
    await createLoan(input);
    setFormOpen(false);
    await reload();
  }

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <div className="sticky top-0 z-20 bg-gray-50 px-4 pb-3 pt-4 shadow-sm shadow-gray-200/60">
        <div className="mb-4 flex items-center gap-3">
          <BackButton onClick={() => navigate(ROUTES.HOME)} ariaLabel="Quay lại" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[22px] font-extrabold text-gray-900">
              Cho vay & Vay nợ
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-300/40 active:scale-95"
            aria-label="Thêm khoản"
          >
            <Plus size={22} />
          </button>
        </div>

        <div className="flex h-[44px] gap-1 overflow-x-auto rounded-[12px] bg-gray-100 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-fit flex-1 rounded-[9px] px-3 text-[13px] font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[154px] animate-pulse rounded-[14px] bg-gray-200" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-600">
            {error.message}
          </div>
        ) : loans.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[15px] font-bold text-gray-500">Chưa có khoản nào. Nhấn + để thêm</p>
          </div>
        ) : (
          <div className="space-y-3">
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onPress={(id) => navigate(ROUTES.LOANS_DETAIL.replace(':id', id))}
              />
            ))}
          </div>
        )}
      </div>

      <BottomSheet isOpen={formOpen} onClose={() => setFormOpen(false)} fullScreenOnAndroid>
        <LoanForm onSubmit={handleCreateLoan} loading={mutationLoading} />
      </BottomSheet>
    </div>
  );
}
