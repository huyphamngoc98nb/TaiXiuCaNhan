import { BarChart3 } from 'lucide-react';
import { useCurrency } from '@/shared/context/CurrencyContext';
import { useLanguage } from '@/shared/context/LanguageContext';
import { HIDDEN_AMOUNT, useAmountVisibility } from '@/shared/hooks/useAmountVisibility';
import { getAppLocale } from '@/shared/utils/locale';
import type { CategorySpendingMetric } from '../services/financial-calculations';

interface Props {
  items: CategorySpendingMetric[];
  loading: boolean;
  onSelectCategory: (item: CategorySpendingMetric) => void;
}

export function CategorySpendingReport({ items, loading, onSelectCategory }: Props) {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { showAmounts } = useAmountVisibility();
  const locale = getAppLocale(language);
  const displayAmount = (amount: number) => showAmounts ? formatAmount(amount, locale) : HIDDEN_AMOUNT;

  if (loading) {
    return (
      <section className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-4 h-4 w-44 rounded bg-gray-100" />
        <div className="space-y-3">
          {[0, 1, 2].map(item => (
            <div key={item} className="h-14 rounded-[12px] bg-gray-100" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900">Chi tiêu theo danh mục</h3>
        <div className="mt-4 flex min-h-[160px] flex-col items-center justify-center rounded-[14px] bg-gray-50 px-4 text-center">
          <BarChart3 size={26} className="text-gray-300" />
          <p className="mt-2 text-sm font-semibold text-gray-500">Không có chi tiêu trong khoảng thời gian này</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-[15px] font-bold text-gray-900">Chi tiêu theo danh mục</h3>
      <div className="mt-3 space-y-2">
        {items.map(item => (
          <button
            key={item.category_id}
            type="button"
            onClick={() => onSelectCategory(item)}
            className="w-full rounded-[12px] px-2 py-2 text-left transition-colors active:bg-gray-50"
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-gray-800">
                {item.category_name}
              </span>
              <span className="shrink-0 text-[12px] font-bold text-gray-900 tabular-nums">
                {displayAmount(item.amount)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${Math.max(2, Math.min(item.percentage * 100, 100))}%` }}
                />
              </div>
              <span className="w-11 text-right text-[11px] font-semibold text-gray-500">
                {(item.percentage * 100).toFixed(0)}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
