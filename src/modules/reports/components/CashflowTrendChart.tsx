import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import type { XAxisTickContentProps } from 'recharts';
import type { PeriodSummary } from '../domain/report.model';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useCurrency } from '@/shared/context/CurrencyContext';
import { getAppLocale } from '@/shared/utils/locale';
import { HIDDEN_AMOUNT, useAmountVisibility } from '@/shared/hooks/useAmountVisibility';
import { useDisplayFormatSettings } from '@/shared/hooks/useDisplayFormatSettings';
import { formatAppDate, formatAppMonth } from '@/shared/utils/display-format';

interface Props {
  data: PeriodSummary[];
}

export type CashflowMetric = 'income' | 'expense' | 'net';

export interface CashflowTrendDatum extends PeriodSummary {
  net: number;
}

interface CashflowXAxisTickProps extends XAxisTickContentProps {
  formatPeriod: (period: unknown) => string;
}

const METRIC_COLORS: Record<CashflowMetric, string> = {
  income: '#059669',
  expense: '#E11D48',
  net: '#4F46E5',
};

export function buildCashflowTrendData(data: PeriodSummary[]): CashflowTrendDatum[] {
  return data.map((item) => ({
    ...item,
    net: item.income - item.expense,
  }));
}

export function getCashflowXAxisTicks(data: PeriodSummary[], maxTicks = 4): string[] {
  if (data.length <= maxTicks) return data.map((item) => item.period);

  const lastIndex = data.length - 1;
  return Array.from(
    new Set(
      Array.from({ length: maxTicks }, (_, index) => (
        data[Math.round((lastIndex * index) / (maxTicks - 1))].period
      ))
    )
  );
}

const CashflowXAxisTick: React.FC<CashflowXAxisTickProps> = ({
  x,
  y,
  payload,
  formatPeriod,
}) => (
  <text
    x={x}
    y={y}
    dy={16}
    textAnchor="middle"
    fill="var(--text-subtle)"
    fontSize={11}
    tabIndex={-1}
    focusable="false"
    aria-hidden="true"
    style={{ outline: 'none', pointerEvents: 'none' }}
  >
    {formatPeriod(payload.value)}
  </text>
);

export const CashflowTrendChart: React.FC<Props> = ({ data }) => {
  const { t, language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { showAmounts } = useAmountVisibility();
  const displayFormatSettings = useDisplayFormatSettings();
  const locale = getAppLocale(language);
  const [metric, setMetric] = useState<CashflowMetric>('income');

  const chartData = useMemo(() => buildCashflowTrendData(data), [data]);
  const xAxisTicks = useMemo(() => getCashflowXAxisTicks(data), [data]);
  const metrics = [
    { key: 'income' as const, label: t('reports.bar_income') },
    { key: 'expense' as const, label: t('reports.bar_expense') },
    { key: 'net' as const, label: t('reports.net_cashflow') },
  ];
  const activeMetric = metrics.find((item) => item.key === metric) ?? metrics[0];
  const activeColor = METRIC_COLORS[metric];

  const formatTooltipValue = (value: unknown) => (
    showAmounts ? formatAmount(Number(value || 0), locale) : HIDDEN_AMOUNT
  );
  const formatPeriod = (period: unknown) => {
    const value = String(period ?? '');
    const parts = value.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      return formatAppDate(
        new Date(year, month - 1, day).getTime(),
        displayFormatSettings
      );
    }
    if (parts.length === 2) {
      const [year, month] = parts.map(Number);
      if (month >= 1 && month <= 12) {
        return formatAppMonth(
          new Date(year, month - 1, 1).getTime(),
          displayFormatSettings,
          locale
        );
      }
    }
    return value;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-[14px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-400">{t('reports.no_cashflow_data')}</div>
      </div>
    );
  }

  return (
    <section className="mb-5 min-w-0 overflow-hidden rounded-[14px] border border-gray-100 bg-white p-3 shadow-sm">
      <h3 className="min-w-0 truncate text-[15px] font-bold text-gray-900">
        {t('reports.cashflow_title')}
      </h3>

      <div
        className="mt-3 grid min-w-0 grid-cols-3 gap-1 rounded-[12px] bg-gray-100 p-1"
        role="tablist"
        aria-label={t('reports.cashflow_title')}
      >
        {metrics.map((item) => {
          const selected = metric === item.key;
          return (
            <button
              key={item.key}
              id={`cashflow-${item.key}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="cashflow-trend-panel"
              onClick={() => setMetric(item.key)}
              className={`min-h-11 min-w-0 rounded-[9px] px-1.5 text-[12px] font-semibold leading-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 ${
                selected
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 active:bg-white/60'
              }`}
            >
              <span className="block truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div
        id="cashflow-trend-panel"
        role="tabpanel"
        aria-labelledby={`cashflow-${metric}-tab`}
        className="cashflow-chart-frame h-[204px] min-w-0 overflow-hidden pt-2"
        onFocusCapture={(event) => {
          const target = event.target as HTMLElement;
          target.blur?.();
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            accessibilityLayer={false}
            tabIndex={-1}
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            style={{ outline: 'none', touchAction: 'pan-y' }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              ticks={xAxisTicks}
              interval={0}
              padding={{ left: 28, right: 28 }}
              tick={(tickProps) => (
                <CashflowXAxisTick {...tickProps} formatPeriod={formatPeriod} />
              )}
              tickFormatter={formatPeriod}
              tickMargin={8}
            />
            {metric === 'net' && (
              <ReferenceLine y={0} stroke="var(--text-subtle)" strokeDasharray="4 4" />
            )}
            <Tooltip
              formatter={(value) => [formatTooltipValue(value), activeMetric.label]}
              labelFormatter={formatPeriod}
              cursor={{ stroke: activeColor, strokeOpacity: 0.14, strokeWidth: 18 }}
              allowEscapeViewBox={{ x: false, y: false }}
              wrapperStyle={{ maxWidth: 'calc(100% - 16px)', pointerEvents: 'none' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                boxShadow: '0 8px 20px var(--shadow-color)',
                color: 'var(--text)',
                fontSize: 12,
                padding: '10px 12px',
              }}
              labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
              itemStyle={{ color: activeColor, fontWeight: 600 }}
            />
            <Area
              type="linear"
              dataKey={metric}
              name={activeMetric.label}
              stroke={activeColor}
              strokeWidth={2.5}
              fill={activeColor}
              fillOpacity={0.12}
              dot={chartData.length <= 12 ? { r: 2.5, strokeWidth: 1.5, fill: 'var(--surface)' } : false}
              activeDot={{ r: 6, stroke: 'var(--surface)', strokeWidth: 3 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
