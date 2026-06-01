export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  slug: string | null;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  description: string | null;
  is_system: 0 | 1;
  created_at: number;
  updated_at: number;
}

export interface CategoryInput {
  name: string;
  type: CategoryType;
  icon?: string | null;
  color?: string | null;
  description?: string | null;
}

export interface CategoryReferenceCounts {
  transactions: number;
  recurringBills: number;
  budgets: number;
}

export const TRANSFER_CATEGORY_ID = 'cat-transfer';
