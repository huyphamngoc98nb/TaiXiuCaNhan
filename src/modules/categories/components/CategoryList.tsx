import { Pencil, Trash2 } from 'lucide-react';
import type { Category } from '../domain/category.model';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: Props) {
  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <p className="text-[15px] font-semibold text-gray-500">Chưa có danh mục</p>
        <p className="text-[13px] mt-1">Thêm danh mục để phân loại giao dịch.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-[14px] px-4 py-3 flex items-center gap-3"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
        >
          <div
            className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[16px] font-bold shrink-0"
            style={{
              backgroundColor: `${category.color ?? '#6366F1'}22`,
              color: category.color ?? '#6366F1',
            }}
          >
            <CategoryIcon icon={category.icon} name={category.name} type={category.type} size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-gray-900 truncate">{category.name}</p>
            <p className="text-[12px] text-gray-500">
              {category.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center active:bg-gray-100"
            aria-label={`Sửa ${category.name}`}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center active:bg-red-100"
            aria-label={`Xóa ${category.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
