export interface RawDonutItem {
  label: string;
  amount: number;
}

export interface DonutItem {
  id: string;
  label: string;
  amount: number;
  percent: number;
  percentLabel: string;
  color: string;
  isOther?: boolean;
}

interface NormalizeDonutDataOptions {
  colors: string[];
  otherLabel: string;
  topN?: number;
  minPercent?: number;
}

const makeId = (label: string, index: number) => `${label.trim().toLowerCase()}-${index}`;

const formatPercentLabel = (percent: number) => {
  if (percent >= 10 || Number.isInteger(percent)) return `${percent.toFixed(0)}%`;
  return `${percent.toFixed(1)}%`;
};

export function normalizeDonutData(
  rawItems: RawDonutItem[],
  {
    colors,
    otherLabel,
    topN = 5,
    minPercent = 5,
  }: NormalizeDonutDataOptions,
): DonutItem[] {
  const sortedItems = rawItems
    .map(item => ({
      label: item.label.trim() || otherLabel,
      amount: Number.isFinite(item.amount) ? Math.max(0, item.amount) : 0,
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const total = sortedItems.reduce((sum, item) => sum + item.amount, 0);
  if (total <= 0) return [];

  const kept: RawDonutItem[] = [];
  let otherAmount = 0;

  sortedItems.forEach((item, index) => {
    const percent = (item.amount / total) * 100;
    const shouldKeep = kept.length < topN && (percent >= minPercent || index === 0);

    if (shouldKeep) {
      kept.push(item);
    } else {
      otherAmount += item.amount;
    }
  });

  const normalizedItems: Array<RawDonutItem & { isOther?: boolean }> = [...kept];
  if (otherAmount > 0) {
    normalizedItems.push({ label: otherLabel, amount: otherAmount, isOther: true });
  }

  return normalizedItems.map((item, index) => ({
    id: item.isOther ? 'other' : makeId(item.label, index),
    label: item.label,
    amount: item.amount,
    percent: (item.amount / total) * 100,
    percentLabel: formatPercentLabel((item.amount / total) * 100),
    color: colors[index % colors.length],
    isOther: item.isOther,
  }));
}
