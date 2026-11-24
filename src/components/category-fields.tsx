import { useState } from 'react';
import { categoryColors, categoryIcons, categoryToneFor } from '@/lib/category-icons.mjs';
import CategoryIcon from './category-icon';
import s from './categories.module.css';
import palette from './category-color.module.css';

export function CategoryKindPicker({ kind, onChange }: { kind: string; onChange: (value: string) => void }) {
  return <fieldset className={s.kindChoices}><legend className={s.srOnly}>Tipo de categoría</legend>{[{ id: 'expense', label: 'Gastos', arrow: '↗' }, { id: 'income', label: 'Ingresos', arrow: '↙' }].map(item => <label key={item.id}><input type="radio" name="kind" aria-label={item.label} value={item.id} checked={kind === item.id} onChange={() => onChange(item.id)} /><span><span aria-hidden="true">{item.arrow} </span>{item.label}</span></label>)}</fieldset>;
}

export function CategoryIconPicker({ icon, color, onChange }: { icon: string; color: string; onChange: (icon: string) => void }) {
  return <fieldset className={s.picker}><legend>Elige un icono</legend><div className={s.iconGrid}>{categoryIcons.map(item => <label className={s.iconChoice} key={item.id} title={item.label}><input type="radio" name="icon" aria-label={item.label} value={item.id} checked={icon === item.id} onChange={() => onChange(item.id)} /><span className={`${s.iconFace} ${palette.tone}`} data-tone={color === 'auto' ? item.tone : color}><CategoryIcon id={item.id} /></span></label>)}</div></fieldset>;
}

const choices = [{ id: 'auto', label: 'Automático' }, ...categoryColors];

export function CategoryColorPicker({ color, onChange }: { color: string; onChange: (value: string) => void }) {
  return <fieldset className={s.picker}>
    <legend>Color del icono <span className={palette.selectedName}>{choices.find(item => item.id === color)?.label}</span></legend>
    <div className={palette.choices}>{choices.map(item =>
      <label key={item.id} className={palette.choice} title={item.label}>
        <input type="radio" name="color" value={item.id} checked={color === item.id} onChange={() => onChange(item.id)} aria-label={item.label} />
        <span className={`${palette.dot} ${palette.tone}`} data-tone={item.id} aria-hidden="true" />
      </label>
    )}</div>
  </fieldset>;
}

export default function CategoryFields({ name, onNameChange, kind = 'expense', onKindChange, icon = 'tag', onIconChange, pending = false, message = '', success = false }: {
  name: string; onNameChange: (value: string) => void; kind?: string; onKindChange?: (value: string) => void; icon?: string; onIconChange?: (value: string) => void; pending?: boolean; message?: string; success?: boolean;
}) {
  const [color, setColor] = useState('auto');
  return <div className={s.creation}><fieldset disabled={pending} className={s.createFields}>
    <div className={s.previewTile}><span className={`${s.largeIcon} ${palette.tone}`} data-tone={categoryToneFor({ icon, color })}><CategoryIcon id={icon} /></span><strong>{name.trim() || 'Tu nueva categoría'}</strong><small>{kind === 'income' ? 'Ingreso' : 'Gasto'}</small></div>
    <div className={s.createControls}><CategoryKindPicker kind={kind} onChange={value => onKindChange?.(value)} />
      <label className={s.nameLabel}>Nombre<input name="name" aria-label="Nombre de la categoría" required maxLength={80} value={name} onChange={event => onNameChange(event.target.value)} placeholder="Ej. Mascotas" /></label>
      <CategoryIconPicker icon={icon} color={color} onChange={value => onIconChange?.(value)} />
      <CategoryColorPicker color={color} onChange={setColor} />
      <button className={s.save}>{pending ? 'Creando…' : 'Crear categoría'}<span aria-hidden="true">+</span></button>
    </div>
  </fieldset><p role="status" className={`${s.message} ${success ? s.success : ''}`}>{message}</p></div>;
}
