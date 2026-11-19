'use client';

import CategoriesSection, { type CategoryItem, type EditCategory, type RemoveCategory } from './categories-section';
import DemoSetupForm from './demo-setup-form';

export default function CategoriesDemo({ categories, onAddCategory, editCategory, removeCategory }: {
  categories: CategoryItem[];
  onAddCategory: (name: string, kind: string, icon: string) => void;
  editCategory: EditCategory; removeCategory: RemoveCategory;
}) {
  return <CategoriesSection categories={categories} editCategory={editCategory} removeCategory={removeCategory}
    creation={<DemoSetupForm category existing={categories} onCreate={onAddCategory} />} />;
}
