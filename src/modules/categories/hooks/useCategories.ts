import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Category, CategoryInput, CategoryType } from '../domain/category.model';
import { CategoryService } from '../services/category.service';
import { useToast } from '@/shared/components/Toast/ToastContext';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const service = useMemo(() => new CategoryService(), []);
  const toast = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await service.list());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh mục.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createCategory = useCallback(async (input: CategoryInput) => {
    await service.create(input);
    await refresh();
    toast.success('Đã thêm danh mục.');
  }, [refresh, service, toast]);

  const updateCategory = useCallback(async (id: string, input: CategoryInput) => {
    await service.update(id, input);
    await refresh();
    toast.success('Đã cập nhật danh mục.');
  }, [refresh, service, toast]);

  const deleteCategory = useCallback(async (id: string) => {
    await service.delete(id);
    await refresh();
    toast.success('Đã xóa danh mục.');
  }, [refresh, service, toast]);

  const byType = useCallback(
    (type: CategoryType) => categories.filter((category) => category.type === type),
    [categories],
  );

  return {
    categories,
    loading,
    error,
    refresh,
    createCategory,
    updateCategory,
    deleteCategory,
    byType,
  };
}
