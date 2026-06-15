import { useLanguage } from '@/shared/context/LanguageContext';
import {
  CategoryBudget,
  BudgetProgress,
  resolveBudgetScope,
} from '../domain/budget.model';
import { BudgetStatusBadge } from './BudgetStatusBadge';
import { BudgetScopeBadge } from './BudgetScopeBadge';
import { ProgressBar } from '@/shared/components/ProgressBar/ProgressBar';
import { CategoryIcon } from '@/modules/categories/components/CategoryIcon';
import { useCurrency } from '@/shared/context/CurrencyContext';
import { getAppLocale } from '@/shared/utils/locale';
import { HIDDEN_AMOUNT, useAmountVisibility } from '@/shared/hooks/useAmountVisibility';

interface Props {
  category: CategoryBudget;
  progress?: BudgetProgress;
  onClick: () => void;
  onViewTransactions?: () => void;
}

export function BudgetCategoryItem({ category, progress, onClick, onViewTransactions }: Props) {
  const { t, language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { showAmounts } = useAmountVisibility();
  const locale = getAppLocale(language);
  const isSet = category.budget_amount !== null;
  const displayAmount = (amount: number) => showAmounts ? formatAmount(amount, locale) : HIDDEN_AMOUNT;

  const periodLabel = isSet
    ? category.budget_period === 'monthly'
      ? t('budgets.monthly_budget')
      : t('budgets.weekly_budget')
    : t('budgets.no_limit_set');

  // Resolve scope từ progress.budget nếu có (đã có account_type_scope)
  const scope = progress ? resolveBudgetScope(progress.budget) : null;

  return (
    <div
      className="bg-surface rounded-xl border border-border p-4 mb-2 cursor-pointer"
      style={{ boxShadow: '0 1px 4px var(--shadow-color)' }}
      onClick={onClick}
    >
      {/* Row 1 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
            style={{
              backgroundColor: category.color ? `${category.color}26` : 'rgba(99,102,241,0.15)',
              color: category.color || '#6366F1',
              fontSize: '14px',
            }}
          >
            <CategoryIcon
              icon={category.icon}
              name={category.category_name}
              type={category.type}
              size={17}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-[15px] font-semibold text-gray-900 leading-tight">
                {category.category_name}
              </h4>
              {scope && <BudgetScopeBadge scope={scope} />}
            </div>
            <p className="text-[12px] text-gray-500">{periodLabel}</p>
          </div>
        </div>
        <BudgetStatusBadge status={progress?.status} />
      </div>

      {/* Row 2 & 3 */}
      {isSet && progress && (
        <div className="mt-2 space-y-2">
          <div className="flex w-full">
            <div className="flex-1 text-left">
              <p className="text-[12px] text-gray-500">{t('budgets.spent')}</p>
              <p className="text-[14px] font-semibold text-gray-900 tabular-nums">
                {displayAmount(progress.spent_amount)}
              </p>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[12px] text-gray-500">{t('budgets.budget_label')}</p>
              <p className="text-[14px] font-semibold text-gray-900 tabular-nums">
                {displayAmount(category.budget_amount ?? 0)}
              </p>
            </div>
            <div className="flex-1 text-left">
              {progress.status === 'exceeded' ? (
                <>
                  <p className="text-[12px] text-gray-500">{t('budgets.over')}</p>
                  <p className="text-[14px] font-semibold text-red-500 tabular-nums">
                    {displayAmount(Math.abs(progress.remaining_amount))}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[12px] text-gray-500">{t('budgets.left')}</p>
                  <p className="text-[14px] font-semibold text-green-500 tabular-nums">
                    {displayAmount(progress.remaining_amount)}
                  </p>
                </>
              )}
            </div>
          </div>
          <ProgressBar
            percentage={progress.percentage * 100}
            status={progress.status === 'exceeded' ? 'danger' : progress.status}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
            <span className="font-semibold text-gray-500">
              {Math.round(progress.percentage * 100)}% đã dùng
            </span>
            {progress.is_projected_exceeded && (
              <span className="rounded-full bg-red-50 px-2 py-1 font-semibold text-red-600">
                Dự kiến vượt cuối kỳ
              </span>
            )}
          </div>
        </div>
      )}

      {/* Row 4 */}
      <div className="mt-2">
        {!isSet ? (
          <span className="text-[13px] text-gray-500 h-11 flex items-center">
            {t('budgets.no_limit_set')}
          </span>
        ) : (
          <div className="flex items-center justify-between gap-3">
            {onViewTransactions && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onViewTransactions();
                }}
                className="h-11 rounded-[10px] bg-gray-50 px-3 text-[13px] font-semibold text-gray-600 active:bg-gray-100"
              >
                Xem giao dịch
              </button>
            )}
            <span className="text-[13px] text-gray-500 h-11 flex items-center">
              {t('budgets.edit')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
