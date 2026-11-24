import CategoryIcon from '@/components/category-icon';
import palette from '@/components/category-color.module.css';
import { categoryIconFor, categoryToneFor } from '@/lib/category-icons.mjs';
import type { PrivateMovement } from '@/app/privado/movements-table';

export default function HistoryCategoryIcon({ movement }: { movement: PrivateMovement }) {
  const category = { name: movement.category_name, icon: movement.category_icon, color: movement.category_color };
  return <span aria-hidden="true" className={`${palette.historyIcon} ${palette.tone}`} data-tone={categoryToneFor(category)}><CategoryIcon id={categoryIconFor(category)} /></span>;
}
