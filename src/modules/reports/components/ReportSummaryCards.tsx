import React from 'react';
import { CashflowSummary } from '../domain/report.model';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useCurrency } from '@/shared/context/CurrencyContext';
import { ArrowDownCircle, ArrowUpCircle, PiggyBank } from 'lucide-react';
import { HIDDEN_AMOUNT, useAmountVisibility } from '@/shared/hooks/useAmountVisibility';

interface Props {
  data: CashflowSummary | null;
  previousData: CashflowSummary | null;
  loading: boolean;
}

const percentChange = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
};

export const ReportSummaryCards: React.FC<Props> = ({ data, previousData, loading }) => {
  const { t, language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { showAmounts } = useAmountVisibility();
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const displayAmount = (amount: number) => showAmounts ? formatAmount(amount, locale) : HIDDEN_AMOUNT;

  if (loading) {
    return <div className="mb-5 rounded-[14px] bg-white p-4 text-sm text-gray-500 shadow-sm">{t('reports.loading_summaries')}</div>;
  }

  const income = data?.totalIncome || 0;
  const expense = data?.totalExpense || 0;
  const net = data?.netAmount || 0;
  const cards = [
    {
      label: t('reports.income'),
      value: income,
      previousValue: previousData?.totalIncome || 0,
      icon: ArrowUpCircle,
      iconClassName: 'text-emerald-500',
      amountClassName: 'text-emerald-600',
    },
    {
      label: t('reports.expense'),
      value: expense,
      previousValue: previousData?.totalExpense || 0,
      icon: ArrowDownCircle,
      iconClassName: 'text-red-500',
      amountClassName: 'text-red-600',
    },
    {
      label: t('reports.savings_net'),
      value: net,
      previousValue: previousData?.netAmount || 0,
      icon: PiggyBank,
      iconClassName: net >= 0 ? 'text-emerald-500' : 'text-red-500',
      amountClassName: net >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
  ];

  return (
    <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const change = percentChange(card.value, card.previousValue);
        return (
          <div
            key={card.label}
            className="flex min-w-0 items-center gap-3 rounded-[14px] border border-gray-100 bg-white px-3 py-3 shadow-sm sm:flex-col sm:items-start sm:gap-2"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
              <Icon size={18} className={`shrink-0 ${card.iconClassName}`} />
              <span className="truncate text-[12px] font-semibold uppercase text-gray-400">
                {card.label}
              </span>
            </div>
            <div className="min-w-0 flex-1 text-right sm:w-full sm:text-left">
              <div
                className={`break-words text-[15px] font-bold leading-tight tabular-nums sm:text-[16px] ${card.amountClassName}`}
              >
                {displayAmount(card.value)}
              </div>
              <div className={`mt-1 text-[11px] font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(0)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
