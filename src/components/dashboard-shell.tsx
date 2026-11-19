"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./dashboard-shell.module.css";
import ProfileMenu, { type SaveAvatarAction } from './profile-menu';
import { themeVariables } from '@/lib/avatar-themes.mjs';
import SelectedAvatar, { AvatarContext } from './selected-avatar';
import NotificationCenter from './notification-center';

export const navigation = [
  { id: "resumen", label: "Resumen" },
  { id: "movimientos", label: "Movimientos" },
  { id: "cuentas", label: "Cuentas" },
  { id: "categorias", label: "Categorías" },
  { id: "planificacion", label: "Planificación" },
  { id: "pagos", label: "Pagos futuros" },
  { id: "habitos", label: "Hábitos y recompensas" },
  { id: "configuracion", label: "Configuración" },
] as const;
export type NavigationId = typeof navigation[number]["id"];

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    resumen: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="11" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="18" width="7" height="3" rx="1" /></>,
    movimientos: <><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" /></>,
    cuentas: <><rect x="3" y="5" width="18" height="15" rx="3" /><path d="M3 9h18m-6 5h3M7 5V3h10" /></>,
    categorias: <><path d="m20 13-7 7a2 2 0 0 1-3 0l-7-7V4h9l8 7a1.5 1.5 0 0 1 0 2Z" /><circle cx="7.5" cy="8" r="1" /></>,
    planificacion: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-14 5h3m4 0h3" /></>,
    pagos: <><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M7 2v4m10-4v4M3 10h18m-13 5 3 3 5-5" /></>,
    habitos: <><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></>,
    configuracion: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="3" /><circle cx="15" cy="17" r="3" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function DashboardShell({ active, demo = false, avatar = "koala", saveAvatarAction, onNavigate, onNewMovement, sessionAction, children }: {
  active: NavigationId; demo?: boolean; avatar?: string; saveAvatarAction?: SaveAvatarAction;
  onNavigate?: (section: NavigationId) => void; onNewMovement: () => void; sessionAction?: ReactNode; children: ReactNode;
}) {
  const drawer = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(avatar);
  useEffect(() => { setTheme(avatar); }, [avatar]);
  const current = navigation.find(item => item.id === active)!;
  const close = () => drawer.current?.close();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(min-width: 901px)");
    const resized = () => { if (media.matches) drawer.current?.close(); };
    media.addEventListener("change", resized);
    return () => { document.body.style.overflow = previous; media.removeEventListener("change", resized); };
  }, [open]);

  function destination(id: NavigationId, content: ReactNode, className: string) {
    return onNavigate
      ? <button type="button" className={className} aria-current={className.includes(styles.navItem) && id === active ? "page" : undefined} onClick={() => { onNavigate(id); close(); }}>{content}</button>
      : <a className={className} href={`/privado?seccion=${id}`} aria-current={className.includes(styles.navItem) && id === active ? "page" : undefined} onClick={close}>{content}</a>;
  }
  function sidebar(mobile = false) {
    return <>
      <div className={styles.brandRow}><a className={styles.brand} href={demo ? "/demo" : "/privado"} aria-label="Finanzas personales, inicio"><SelectedAvatar width={48} height={48} /><span>finanzas<span className={styles.brandSub}>PERSONALES</span></span></a>{mobile && <button type="button" className={styles.closeButton} aria-label="Cerrar menú" onClick={close}><Icon name="close" /></button>}</div>
      <nav className={styles.navigation} aria-label="Navegación principal">
        <p className={styles.groupLabel}>TU DÍA A DÍA</p>
        {navigation.map(item => <div key={item.id} data-section={item.id}>{item.id === "configuracion" && <p className={styles.groupLabel}>MI CUENTA</p>}{item.id === "planificacion" && <p className={styles.groupLabel}>CONSTRUYE TU FUTURO</p>}{destination(item.id, <><span className={styles.navIcon}><Icon name={item.id} /></span><span className={styles.navCopy}><strong>{item.label}</strong></span><span className={styles.activeDot} /></>, `${styles.navItem} ${active === item.id ? styles.active : ""}`)}</div>)}
      </nav>
      <div className={styles.encouragement}><span className={styles.sparkle} aria-hidden="true">✦</span><span className={styles.cardEyebrow}>A TU PROPIO RITMO</span><h2>Pequeños pasos.<br />Grandes posibilidades.</h2><p>Tu próxima meta empieza con una decisión de hoy.</p></div>
    </>;
  }
  return <AvatarContext.Provider value={theme}><div data-avatar-theme={theme} style={themeVariables(theme) as CSSProperties} className={`app-shell ${styles.shell} ${demo ? "" : "private-shell"}`}>
    <a className={styles.skipLink} href="#dashboard-content">Ir al contenido</a>
    <aside className={styles.sidebar}>{sidebar()}</aside>
    <dialog ref={drawer} className={styles.drawer} aria-label="Menú de navegación" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) close(); }}><div className={styles.drawerInner}>{sidebar(true)}</div></dialog>
    <main className={styles.main}>
      <header className={styles.topbar}>
        <div className={styles.topContext}>
          <button type="button" className={styles.menuButton} aria-label="Abrir menú de navegación" aria-haspopup="dialog" aria-expanded={open} onClick={() => { drawer.current?.showModal(); setOpen(true); }}><Icon name="menu" /></button>
          <strong className={styles.sectionTitle}>{current.label}</strong>
        </div>
        <div className={styles.topActions}>
          
          <button type="button" className={styles.register} aria-haspopup="dialog" onClick={onNewMovement}><Icon name="plus" /><span>Nuevo movimiento</span></button>
          <NotificationCenter />
          <ProfileMenu onSettings={onNavigate ? () => onNavigate("configuracion") : undefined} avatarId={avatar} demo={demo} onAvatarChange={setTheme} saveAvatarAction={saveAvatarAction} sessionAction={sessionAction} />
        </div>
      </header>
      <div id="dashboard-content" tabIndex={-1} className={styles.contentAnchor}>{children}</div>
    </main>
  </div></AvatarContext.Provider>;
}
