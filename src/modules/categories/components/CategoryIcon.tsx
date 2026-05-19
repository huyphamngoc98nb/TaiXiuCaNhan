import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  Banknote,
  BookOpen,
  Briefcase,
  Bus,
  Car,
  CircleDollarSign,
  Coffee,
  Dumbbell,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Plane,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  TrendingUp,
  Truck,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react';
import type { CategoryType } from '../domain/category.model';

export interface CategoryIconPreset {
  value: string;
  label: string;
  type: CategoryType | 'all';
}

const ICONS: Record<string, LucideIcon> = {
  'arrow-left-right': ArrowLeftRight,
  banknote: Banknote,
  book: BookOpen,
  'book-open': BookOpen,
  briefcase: Briefcase,
  bus: Bus,
  car: Car,
  coffee: Coffee,
  dining: Utensils,
  education: GraduationCap,
  fitness: Dumbbell,
  food: Utensils,
  gift: Gift,
  health: HeartPulse,
  home: Home,
  investment: TrendingUp,
  investments: TrendingUp,
  landmark: Landmark,
  medical: Stethoscope,
  plane: Plane,
  receipt: Receipt,
  salary: Briefcase,
  shop: ShoppingBag,
  shopping: ShoppingBag,
  'shopping-bag': ShoppingBag,
  'shopping-cart': ShoppingCart,
  transport: Bus,
  'trending-up': TrendingUp,
  truck: Truck,
  utilities: Zap,
  wallet: Wallet,
  zap: Zap,
};

export const CATEGORY_ICON_PRESETS: CategoryIconPreset[] = [
  { value: 'briefcase', label: 'Lương', type: 'income' },
  { value: 'trending-up', label: 'Đầu tư', type: 'income' },
  { value: 'banknote', label: 'Tiền mặt', type: 'income' },
  { value: 'gift', label: 'Quà tặng', type: 'income' },
  { value: 'landmark', label: 'Ngân hàng', type: 'income' },
  { value: 'wallet', label: 'Ví', type: 'income' },
  { value: 'coffee', label: 'Cafe', type: 'expense' },
  { value: 'food', label: 'Ăn uống', type: 'expense' },
  { value: 'shopping-bag', label: 'Mua sắm', type: 'expense' },
  { value: 'bus', label: 'Di chuyển', type: 'expense' },
  { value: 'home', label: 'Nhà cửa', type: 'expense' },
  { value: 'zap', label: 'Hóa đơn', type: 'expense' },
  { value: 'health', label: 'Sức khỏe', type: 'expense' },
  { value: 'book-open', label: 'Học tập', type: 'expense' },
  { value: 'dumbbell', label: 'Thể thao', type: 'expense' },
  { value: 'plane', label: 'Du lịch', type: 'expense' },
];

interface Props {
  icon?: string | null;
  name: string;
  type?: CategoryType;
  size?: number;
  className?: string;
}

export function getCategoryIconKey(icon?: string | null) {
  return icon?.trim().toLowerCase() ?? '';
}

export function CategoryIcon({ icon, name, type, size = 18, className }: Props) {
  const iconKey = getCategoryIconKey(icon);
  const Icon = ICONS[iconKey] ?? (type === 'income' ? CircleDollarSign : Receipt);

  if (icon && icon.trim().length > 0 && !/^[a-z0-9-_]+$/i.test(icon.trim())) {
    return <span className={className}>{icon}</span>;
  }

  if (!iconKey && !type) {
    return <span className={className}>{name.charAt(0).toUpperCase()}</span>;
  }

  return <Icon size={size} strokeWidth={2.2} className={className} />;
}
