export const CATEGORY_ICON_KEY_PATTERN = /^[a-z0-9-_]+$/i;

const MAX_LEGACY_ICON_KEY_LENGTH = 64;
const MAX_CUSTOM_ICON_GRAPHEMES = 2;
const MAX_CUSTOM_ICON_CODE_POINTS = 4;

export interface CategoryIconValidationResult {
  valid: boolean;
  value: string | null;
}

export function normalizeCategoryIconValue(icon: string | null | undefined): string | null {
  const trimmed = icon?.trim() ?? '';
  return trimmed || null;
}

export function isCategoryIconKey(icon: string | null | undefined): boolean {
  const value = normalizeCategoryIconValue(icon);
  return Boolean(value && CATEGORY_ICON_KEY_PATTERN.test(value));
}

export function countCategoryIconGraphemes(value: string): number {
  const Segmenter = (Intl as typeof Intl & {
    Segmenter?: new (
      locales?: string | string[],
      options?: { granularity: 'grapheme' },
    ) => { segment(input: string): Iterable<unknown> };
  }).Segmenter;

  if (Segmenter) {
    const segmenter = new Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(value)).length;
  }

  return Array.from(value).length;
}

export function isSafeLegacyCategoryIconKey(icon: string | null | undefined): boolean {
  const value = normalizeCategoryIconValue(icon);
  return Boolean(
    value &&
      CATEGORY_ICON_KEY_PATTERN.test(value) &&
      value.length <= MAX_LEGACY_ICON_KEY_LENGTH,
  );
}

export function isValidCustomCategoryIcon(icon: string | null | undefined): boolean {
  const value = normalizeCategoryIconValue(icon);
  if (!value) return false;
  if (/[<>]/.test(value)) return false;

  return (
    countCategoryIconGraphemes(value) <= MAX_CUSTOM_ICON_GRAPHEMES &&
    Array.from(value).length <= MAX_CUSTOM_ICON_CODE_POINTS
  );
}

export function validateCustomCategoryIconValue(
  icon: string | null | undefined,
): CategoryIconValidationResult {
  const value = normalizeCategoryIconValue(icon);
  if (!value) return { valid: false, value: null };
  if (isValidCustomCategoryIcon(value)) return { valid: true, value };

  return { valid: false, value };
}

export function validateCategoryIconValue(
  icon: string | null | undefined,
): CategoryIconValidationResult {
  const value = normalizeCategoryIconValue(icon);
  if (!value) return { valid: true, value: null };
  if (isSafeLegacyCategoryIconKey(value) || isValidCustomCategoryIcon(value)) {
    return { valid: true, value };
  }

  return { valid: false, value };
}

export function getSafeCustomCategoryIcon(icon: string | null | undefined): string | null {
  const value = normalizeCategoryIconValue(icon);
  if (!value || !isValidCustomCategoryIcon(value)) return null;
  return value;
}
