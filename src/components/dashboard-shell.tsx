"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./dashboard-shell.module.css";
import ProfileMenu, { type SaveAvatarAction } from './profile-menu';

export const navigation = [
  { id: "resumen", label: "Resumen" },
  { id: "movimientos", label: "Movimientos" },
  { id: "cuentas", label: "Cuentas" },
  { id: "planificacion", label: "Planificación" },
  { id: "metas", label: "Metas y ahorro" },
  { id: "habitos", label: "Hábitos y recompensas" },
] as const;
export type NavigationId = typeof navigation[number]["id"];

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    resumen: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="11" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="18" width="7" height="3" rx="1" /></>,
    movimientos: <><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" /></>,
    cuentas: <><rect x="3" y="5" width="18" height="15" rx="3" /><path d="M3 9h18m-6 5h3M7 5V3h10" /></>,
    planificacion: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-14 5h3m4 0h3" /></>,
    metas: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="m12 12 8-8m-1-2v3h3" /></>,
    habitos: <><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function DashboardShell({ active, demo = false, avatar = "koala", saveAvatarAction, onNavigate, sessionAction, children }: {
  active: NavigationId; demo?: boolean; avatar?: string; saveAvatarAction?: SaveAvatarAction;
  onNavigate?: (section: NavigationId) => void; sessionAction?: ReactNode; children: ReactNode;
}) {
  const drawer = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
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
      <div className={styles.brandRow}><a className={styles.brand} href={demo ? "/demo" : "/privado"} aria-label="Finanzas personales, inicio"><img src="/koala.svg" width="48" height="48" alt="" /><span>finanzas<span className={styles.brandSub}>PERSONALES</span></span></a>{mobile && <button type="button" className={styles.closeButton} aria-label="Cerrar menú" onClick={close}><Icon name="close" /></button>}</div>
      <div className={styles.workspace}><span className={styles.workspaceSymbol}><Icon name="shield" /></span><div><strong>Mi espacio personal</strong></div><span className={styles.liveDot} /></div>
      <nav className={styles.navigation} aria-label="Navegación principal">
        <p className={styles.groupLabel}>TU DÍA A DÍA</p>
        {navigation.map((item, index) => <div key={item.id}>{index === 3 && <p className={styles.groupLabel}>CONSTRUYE TU FUTURO</p>}{destination(item.id, <><span className={styles.navIcon}><Icon name={item.id} /></span><span className={styles.navCopy}><strong>{item.label}</strong></span><span className={styles.activeDot} /></>, `${styles.navItem} ${active === item.id ? styles.active : ""}`)}</div>)}
      </nav>
      <div className={styles.encouragement}><span className={styles.sparkle} aria-hidden="true">✦</span><span className={styles.cardEyebrow}>A TU PROPIO RITMO</span><h2>Pequeños pasos.<br />Grandes posibilidades.</h2><p>Tu próxima meta empieza con una decisión de hoy.</p></div>
    </>;
  }
  return <div className={`app-shell ${styles.shell} ${demo ? "" : "private-shell"}`}>
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
          
          {destination("movimientos", <><Icon name="plus" /><span>Nuevo movimiento</span></>, styles.register)}
          <ProfileMenu avatarId={avatar} demo={demo} saveAvatarAction={saveAvatarAction} sessionAction={sessionAction} />
        </div>
      </header>
      <div id="dashboard-content" tabIndex={-1} className={styles.contentAnchor}>{children}</div>
    </main>
  </div>;
}
