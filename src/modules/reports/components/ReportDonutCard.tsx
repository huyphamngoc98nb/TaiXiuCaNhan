import React, { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useCurrency } from '@/shared/context/CurrencyContext';
import { useLanguage } from '@/shared/context/LanguageContext';
import { DonutItem, normalizeDonutData, RawDonutItem } from './normalize-donut-data';

interface ReportDonutCardProps {
  title: string;
  totalLabel: string;
  emptyMessage: string;
  items: RawDonutItem[];
  palette: string[];
  loading?: boolean;
  error?: string | null;
  ariaLabel: string;
}

interface DonutCenterLabelProps {
  label: string;
  amount: string;
  percent?: string;
}

interface DonutLegendProps {
  items: DonutItem[];
  selectedId: string | null;
  formatAmount: (amount: number) => string;
  onSelect: (item: DonutItem) => void;
}

const RADIAN = Math.PI / 180;

const renderOutsideLabel = ({ cx, cy, outerRadius, midAngle, payload }: any) => {
  const angle = -midAngle * RADIAN;
  const lineStartRadius = outerRadius + 2;
  const lineMidRadius = outerRadius + 8;
  const chartWidth = cx * 2;
  const chartHeight = cy * 2;
  const labelWidth = 96;
  const labelHeight = 40;
  const lineStartX = cx + lineStartRadius * Math.cos(angle);
  const lineStartY = cy + lineStartRadius * Math.sin(angle);
  const lineMidX = cx + lineMidRadius * Math.cos(angle);
  const rawLineMidY = cy + lineMidRadius * Math.sin(angle);
  const lineMidY = Math.min(Math.max(rawLineMidY, labelHeight / 2), chartHeight - labelHeight / 2);
  const isRightSide = Math.cos(angle) >= 0;
  const rawLineEndX = lineMidX + (isRightSide ? 78 : -78);
  const rawLabelX = isRightSide ? rawLineEndX + 8 : rawLineEndX - labelWidth - 8;
  const labelY = lineMidY;
  const clampedLabelX = Math.min(Math.max(rawLabelX, 0), chartWidth - labelWidth);
  const lineEndX = isRightSide ? clampedLabelX - 8 : clampedLabelX + labelWidth + 8;

  return (
    <g className="pointer-events-none">
      <polyline
        points={`${lineStartX},${lineStartY} ${lineMidX},${lineMidY} ${lineEndX},${labelY}`}
        fill="none"
        stroke={payload.color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
      <foreignObject x={clampedLabelX} y={labelY - labelHeight / 2} width={labelWidth} height={labelHeight}>
        <div className={`flex h-full flex-col justify-center text-[10px] leading-[11px] ${isRightSide ? 'items-start text-left' : 'items-end text-right'}`}>
          <div className="max-w-full whitespace-normal break-words font-semibold text-gray-700">{payload.label}</div>
          <div className="mt-0.5 font-bold text-gray-500">{payload.percentLabel}</div>
        </div>
      </foreignObject>
    </g>
  );
};

export const DonutCenterLabel: React.FC<DonutCenterLabelProps> = ({ label, amount, percent }) => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="max-w-[132px] px-2 text-center">
      <div className="truncate text-[12px] font-semibold text-gray-500">{label}</div>
      <div className="mt-1 break-words text-[15px] font-bold leading-tight text-gray-900 tabular-nums">{amount}</div>
      {percent && <div className="mt-0.5 text-[12px] font-semibold text-gray-500">{percent}</div>}
    </div>
  </div>
);

export const DonutLegend: React.FC<DonutLegendProps> = ({
  items,
  selectedId,
  formatAmount,
  onSelect,
}) => (
  <div className="mt-4 border-t border-gray-100 pt-2">
    {items.map(item => {
      const selected = selectedId === item.id;
      return (
        <button
          key={item.id}
          type="button"
          aria-pressed={selected}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(item);
          }}
          className={`flex min-h-[44px] w-full items-center gap-3 rounded-[12px] px-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 ${
            selected ? 'bg-gray-100 ring-1 ring-gray-300' : 'active:bg-gray-50'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${selected ? 'ring-2 ring-gray-400 ring-offset-2' : ''}`}
            style={{ backgroundColor: item.color }}
          />
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-gray-800">{item.label}</span>
          <span className="shrink-0 text-right text-[12px] font-bold text-gray-900 tabular-nums">
            {formatAmount(item.amount)}
            <span className="ml-1 font-semibold text-gray-500">({item.percentLabel})</span>
          </span>
        </button>
      );
    })}
  </div>
);

export const ReportDonutCard: React.FC<ReportDonutCardProps> = ({
  title,
  totalLabel,
  emptyMessage,
  items,
  palette,
  loading = false,
  error = null,
  ariaLabel,
}) => {
  const { t, language } = useLanguage();
  const { formatAmount } = useCurrency();
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const chartData = useMemo(
    () => normalizeDonutData(items, { colors: palette, otherLabel: t('reports.other') }),
    [items, palette, t],
  );
  const total = useMemo(() => chartData.reduce((sum, item) => sum + item.amount, 0), [chartData]);

  const formatMoney = (value: number) => formatAmount(value, locale);
  const totalAmount = formatMoney(total);

  if (loading) {
    return (
      <div className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-4 h-4 w-40 rounded bg-gray-100" />
        <div className="mx-auto h-[260px] w-full max-w-[360px] rounded-[18px] bg-gray-100" />
        <div className="mt-4 space-y-2">
          <div className="h-10 rounded-[12px] bg-gray-100" />
          <div className="h-10 rounded-[12px] bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[16px] border border-red-100 bg-white p-4 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
        <div className="mt-4 rounded-[12px] bg-red-50 p-3 text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (total <= 0 || chartData.length === 0) {
    return (
      <div className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
        <div className="mt-4 flex min-h-[160px] items-center justify-center rounded-[14px] bg-gray-50 px-4 text-center text-sm text-gray-400">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <section
      className="rounded-[16px] border border-gray-100 bg-white p-4 shadow-sm"
      onClick={() => setSelectedId(null)}
      aria-label={ariaLabel}
    >
      <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      <div
        className="relative mx-auto mt-3 h-[260px] w-full max-w-[360px]"
        role="img"
        aria-label={ariaLabel}
        onClick={event => event.stopPropagation()}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={58}
              paddingAngle={1}
              label={renderOutsideLabel}
              labelLine={false}
              isAnimationActive={false}
              onClick={(item: any) => {
                const nextId = (item.payload ?? item).id;
                setSelectedId(currentId => currentId === nextId ? null : nextId);
              }}
            >
              {chartData.map(item => (
                <Cell
                  key={item.id}
                  fill={item.color}
                  stroke={selectedId === item.id ? 'var(--text)' : 'var(--surface)'}
                  strokeWidth={selectedId === item.id ? 3 : 1.5}
                  opacity={!selectedId || selectedId === item.id ? 1 : 0.45}
                  style={{ cursor: 'pointer', outline: 'none' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mx-auto mt-2 max-w-[320px] rounded-[14px] bg-gray-50 px-3 py-2 text-center">
        <div className="text-[12px] font-semibold text-gray-500">{totalLabel}</div>
        <div className="mt-1 break-words text-[16px] font-bold leading-tight text-gray-900 tabular-nums">
          {totalAmount}
        </div>
      </div>

      <DonutLegend
        items={chartData}
        selectedId={selectedId}
        formatAmount={formatMoney}
        onSelect={item => setSelectedId(currentId => currentId === item.id ? null : item.id)}
      />
    </section>
  );
};
