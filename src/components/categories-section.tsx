'use client';

import { useState, useRef, useEffect, type ReactNode, type FormEvent } from 'react';
import { categoryIcons, categoryIconFor } from '@/lib/category-icons.mjs';
import CategoryIcon from './category-icon';
import { CategoryIconPicker, CategoryKindPicker } from './category-fields';
import CategoryDeleteDialog from './category-delete-dialog';
import s from './categories.module.css';

export type CategoryItem = { id: string; name: string; kind: string; icon?: string | null };
export type CategoryChange = { name: string; kind: string; icon: string };
type Result = { success: boolean; message: string };
export type EditCategory = (id: string, input: CategoryChange) => Promise<Result>;
export type RemoveCategory = (id: string) => Promise<Result>;

function CategoryEditor({ category, save, onClose, onSaved, onPending, onDelete, disabled }: { category: CategoryItem; save: EditCategory; onClose: () => void; onSaved: (message: string) => void; onPending: (pending: boolean) => void; onDelete: () => void; disabled: boolean }) {
  const [name, setName] = useState(category.name);
  const [kind, setKind] = useState(category.kind);
  const [icon, setIcon] = useState(categoryIconFor(category));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending || disabled) return;
    setPending(true); onPending(true); setError('');
    try { const result = await save(category.id, { name, kind, icon }); if (result.success) onSaved(result.message); else setError(result.message); }
    catch { setError('No pudimos guardar la categoría. Inténtalo otra vez.'); }
    finally { setPending(false); onPending(false); }
  }
  return <form onSubmit={submit} className={s.editor} aria-label={`Editar categoría ${category.name}`} aria-busy={pending}>
    <div className={s.editorHeading}><span className={s.smallIcon}><CategoryIcon id={icon} /></span><h4>Editar categoría</h4><button type="button" aria-label="Cerrar edición de categoría" disabled={pending || disabled} onClick={onClose}>×</button></div>
    <fieldset disabled={pending || disabled} className={s.editorFields}>
      <div className={s.editInfo}><label className={s.nameLabel}>Nombre<input autoFocus name="name" aria-label="Nuevo nombre de categoría" required maxLength={80} value={name} onChange={event => setName(event.target.value)} /></label><CategoryKindPicker kind={kind} onChange={setKind} /></div>
      <CategoryIconPicker icon={icon} onChange={setIcon} />
      <div className={s.editorFooter}><button type="button" className={s.removeButton} onClick={onDelete}>Eliminar categoría</button><button className={s.save}>{pending ? 'Guardando…' : 'Guardar cambios'}<span aria-hidden="true">✓</span></button></div>
    </fieldset>
    <p role="status" className={s.message}>{error}</p>
  </form>;
}

export default function CategoriesSection({ categories, creation, editCategory, removeCategory }: { categories: CategoryItem[]; creation: ReactNode; editCategory: EditCategory; removeCategory: RemoveCategory }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<CategoryItem | null>(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const tiles = useRef(new Map<string, HTMLButtonElement>());
  const creator = useRef<HTMLButtonElement>(null);
  const composer = useRef<HTMLDetailsElement>(null);
  const [creationOpen, setCreationOpen] = useState(false);
  const returnFocus = useRef<string | null>(null);
  const deletedId = useRef<string | null>(null);
  useEffect(() => {
    if (!editing && !saving && !removing && returnFocus.current) {
      if (deletedId.current && categories.some(category => category.id === deletedId.current)) return;
      (tiles.current.get(returnFocus.current) || tiles.current.values().next().value || creator.current)?.focus();
      returnFocus.current = null; deletedId.current = null;
    }
  }, [editing, saving, removing, categories]);
  function closeEditor(id: string) { returnFocus.current = id; setEditing(null); }
  return <section className={s.section} aria-labelledby="categories-title">
    <div className={s.heading}><h2 id="categories-title">Categorías</h2><button ref={creator} type="button" className={s.newCategoryButton} aria-expanded={creationOpen} aria-controls="category-creation" onClick={() => setCreationOpen(open => !open)}><span aria-hidden="true">+</span>Nueva categoría<span className={s.chevron} aria-hidden="true">⌄</span></button></div>
    <details ref={composer} id="category-creation" className={`${s.composer} ${s.creationPanel}`} open={creationOpen} onToggle={event => setCreationOpen(event.currentTarget.open)}><summary className={s.srOnly}>Nueva categoría</summary>{creation}</details>
    <div className={s.groups}>{[{ kind: 'expense', label: 'Gastos', arrow: '↗' }, { kind: 'income', label: 'Ingresos', arrow: '↙' }].map(group => {
      const items = categories.filter(category => category.kind === group.kind);
      const selected = items.find(category => category.id === editing);
      return <div className={s.group} key={group.kind}>
        <h3 className={s.groupTitle} data-kind={group.kind}><span aria-hidden="true">{group.arrow}</span>{group.label}</h3>
        <ul className={s.tiles}>{items.map(category => {
          const id = categoryIconFor(category), icon = categoryIcons.find(item => item.id === id)!;
          return <li key={category.id}><button ref={node => { if (node) tiles.current.set(category.id, node); else tiles.current.delete(category.id); }} type="button" className={s.tile} disabled={saving} aria-label={`Editar categoría ${category.name}`} aria-expanded={editing === category.id} onClick={() => { setEditing(editing === category.id ? null : category.id); setStatus(''); }}><span className={s.largeIcon} data-tone={icon.tone}><CategoryIcon id={id} /><span className={s.editMark} aria-hidden="true">✎</span></span><strong>{category.name}</strong></button></li>;
        })}{!items.length && <li className={s.empty}><CategoryIcon id={group.kind === 'income' ? 'salary' : 'bag'} /><span>Sin categorías</span></li>}</ul>
        {selected && <CategoryEditor key={selected.id} category={selected} save={editCategory} disabled={saving} onPending={setSaving} onClose={() => closeEditor(selected.id)} onSaved={message => { setStatus(message); closeEditor(selected.id); }} onDelete={() => setRemoving(selected)} />}
      </div>;
    })}</div>
    <p role="status" className={s.status}>{status}</p>
    {removing && <CategoryDeleteDialog category={removing} remove={removeCategory} onBusy={setSaving} onClose={() => setRemoving(null)} onRemoved={message => { deletedId.current = removing.id; closeEditor(removing.id); setRemoving(null); setStatus(message); }} />}
  </section>;
}
