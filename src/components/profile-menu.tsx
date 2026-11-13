'use client';

import { useEffect, useId, useRef, useState, useTransition, type CSSProperties, type ReactNode } from 'react';
import { avatars, validAvatar } from '@/lib/avatars.mjs';
import AnimalAvatar from './animal-avatar';
import s from './profile-menu.module.css';
import { avatarTheme, themeVariables } from '@/lib/avatar-themes.mjs';

export type SaveAvatarAction = (id: string) => Promise<{ success: boolean; message: string }>;

export default function ProfileMenu({ avatarId = 'koala', demo = false, saveAvatarAction, sessionAction, onAvatarChange }: {
  avatarId?: string; demo?: boolean; saveAvatarAction?: SaveAvatarAction; sessionAction?: ReactNode; onAvatarChange?: (id: string) => void;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(validAvatar(avatarId) ? avatarId : 'koala');
  const [draft, setDraft] = useState(current);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const preview = avatars.find(avatar => avatar.id === draft) || avatars[0];
  const active = avatars.find(avatar => avatar.id === current) || avatars[0];

  useEffect(() => { setCurrent(validAvatar(avatarId) ? avatarId : 'koala'); }, [avatarId]);

  function save() {
    if (pending || draft === current) return;
    setMessage(''); setError(false);
    startTransition(async () => {
      try {
        const result = demo ? { success: true, message: 'Avatar actualizado' } : await saveAvatarAction?.(draft);
        if (!result?.success) { setError(true); setMessage(result?.message || 'No pudimos guardar tu avatar. Inténtalo de nuevo.'); return; }
        setCurrent(draft);
        onAvatarChange?.(draft);
        setMessage('¡Tu nuevo estilo está listo!');
      } catch { setError(true); setMessage('No pudimos guardar tu avatar. Inténtalo de nuevo.'); }
    });
  }

  return <>
    <button ref={trigger} type="button" className={s.trigger} data-open={open} popoverTarget={id} aria-expanded={open} aria-controls={id} aria-label={`Abrir perfil. Avatar: ${active.name}`}>
      <span className={s.triggerPortrait} key={current}><AnimalAvatar id={current} /></span>
      <span className={s.triggerSpark} aria-hidden="true">✦</span>
      <svg className={s.chevron} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 8 5 5 5-5" /></svg>
    </button>
    <div ref={panel} id={id} popover="auto" data-color-scheme={draft === 'tiger' ? 'dark' : 'light'} className={s.panel} style={themeVariables(draft) as CSSProperties} aria-labelledby={`${id}-title`}
      onToggle={event => {
        const visible = event.newState === 'open'; setOpen(visible);
        if (visible && !pending) { setDraft(current); setMessage(''); setError(false); }
      }}>
      <div className={s.hero}>
        <div className={s.topline}><span className={s.mode}><i />{demo ? 'Perfil de demo' : 'Mi espacio'}</span><button type="button" className={s.close} aria-label="Cerrar perfil" onClick={() => { panel.current?.hidePopover(); trigger.current?.focus(); }}>×</button></div>
        <span className={s.orbit} aria-hidden="true" />
        <span className={s.sparkOne} aria-hidden="true">✧</span><span className={s.sparkTwo} aria-hidden="true">✦</span>
        <div className={s.preview} key={draft}><AnimalAvatar id={draft} /><span className={s.previewBadge} aria-hidden="true">✦</span></div>
        <h2 id={`${id}-title`}>{preview.name}</h2>
        <p className={s.palette}><span aria-hidden="true"><i /><i /><i /></span>{avatarTheme(draft).name}</p>
      </div>
      <form className={s.body} onSubmit={event => { event.preventDefault(); save(); }} aria-busy={pending}>
        <fieldset disabled={pending} className={s.picker}>
          <legend>Elige tu avatar <span>6 amigos, un favorito</span></legend>
          <div className={s.grid}>{avatars.map((avatar, index) => <label className={s.choice} key={avatar.id} style={{ animationDelay: `${index * 30 + 80}ms` }}>
            <input type="radio" name={`${id}-avatar`} value={avatar.id} checked={draft === avatar.id} onChange={() => { setDraft(avatar.id); setMessage(''); setError(false); }} aria-label={avatar.name} />
            <span className={s.tile}><AnimalAvatar id={avatar.id} /><span className={s.check} aria-hidden="true">✓</span></span>
            <span className={s.choiceName}>{avatar.short}</span>
          </label>)}</div>
        </fieldset>
        <button className={s.save} disabled={pending || draft === current || (!demo && !saveAvatarAction)} type="submit">{pending ? 'Guardando…' : draft === current ? 'Tu estilo actual' : 'Aplicar avatar y colores'}<span aria-hidden="true">{draft === current ? '✓' : '→'}</span></button>
        <p className={`${s.feedback} ${error ? s.error : ''}`} role="status">{message}</p>
        {demo && <p className={s.demoNote}>Se reinicia al recargar</p>}
      </form>
      {sessionAction && <div className={s.sessionAction}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M10 4H5v16h5m4-12 4 4-4 4M9 12h12" /></svg>{sessionAction}</div>}
    </div>
  </>;
}
