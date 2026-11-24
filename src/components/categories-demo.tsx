'use client';

import CategoriesSection, { type CategoryItem, type EditCategory, type RemoveCategory } from './categories-section';
import DemoSetupForm from './demo-setup-form';
import type { PrivateMovement } from '@/app/privado/movements-table';

export default function CategoriesDemo({ categories, onAddCategory, editCategory, removeCategory, movements }: {
  categories: CategoryItem[];
  movements: PrivateMovement[];
  onAddCategory: (name: string, kind: string, icon: string, color: string | null) => void;
  editCategory: EditCategory; removeCategory: RemoveCategory;
}) {
  return <CategoriesSection categories={categories} movements={movements} currentMonth="2026-11" editCategory={editCategory} removeCategory={removeCategory}
    creation={<DemoSetupForm category existing={categories} onCreate={onAddCategory} />} />;
}
