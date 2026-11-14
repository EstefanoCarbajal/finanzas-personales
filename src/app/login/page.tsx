import Link from 'next/link';
import { databaseConfigured } from '@/server/db';
import AnimalAvatar from '@/components/animal-avatar';
import LoginForm from './login-form';
import styles from './login.module.css';

export const dynamic = 'force-dynamic';
export default function LoginPage() {
  const enabled = databaseConfigured();
  return <main className={styles.shell}>
    <div className={styles.glow} aria-hidden="true" />
    <div className={styles.grid} aria-hidden="true" />
    <section className={styles.stage} aria-label="Acceso a Finanzas Personales">
      <div className={styles.intro}>
        <div className={styles.brandLockup}>
          <span className={styles.brandMark}><AnimalAvatar id="koala" /></span>
          <span>finanzas<span>personales</span></span>
        </div>
        <div className={styles.introCopy}>
          <span className={styles.eyebrow}>TU DINERO, CON PROPÓSITO</span>
          <h1>Haz que cada<br /><em>sol se sienta.</em></h1>
          <p>Una vista clara de tu dinero para tomar mejores decisiones y celebrar cada avance.</p>
        </div>
        <div className={styles.progressNote}><span>✦</span><span><strong>Pequeños pasos.</strong><br />Grandes metas.</span></div>
      </div>

      <div className={styles.illustration} aria-hidden="true">
        <div className={`${styles.avatar} ${styles.avatarKoala}`}><AnimalAvatar id="koala" /></div>
        <div className={`${styles.avatar} ${styles.avatarFox}`}><AnimalAvatar id="fox" /></div>
        <div className={`${styles.avatar} ${styles.avatarCat}`}><AnimalAvatar id="cat" /></div>
        <div className={`${styles.avatar} ${styles.avatarTiger}`}><AnimalAvatar id="tiger" /></div>
        <div className={`${styles.avatar} ${styles.avatarRabbit}`}><AnimalAvatar id="rabbit" /></div>
        <div className={`${styles.avatar} ${styles.avatarBear}`}><AnimalAvatar id="bear" /></div>
        <span className={styles.starOne}>✦</span><span className={styles.starTwo}>✧</span><span className={styles.starThree}>·</span>
        <div className={styles.orbit} /><div className={styles.orbitInner} />
      </div>

      <section className={styles.card}>
        <div className={styles.cardTopline}><span className={styles.cardEyebrow}>BIENVENIDO DE VUELTA</span><span className={styles.secure}><span /> Privado</span></div>
        <h2>Tu espacio<br /><span>te estaba esperando.</span></h2>
        <p className={styles.cardLead}>Ingresa para continuar con tus metas.</p>
        {!enabled && <p className={styles.demoNote}>El acceso privado está pendiente de configuración. Mientras tanto puedes explorar la demo con datos ficticios.</p>}
        <LoginForm enabled={enabled} />
        <div className={styles.divider}><span>o</span></div>
        <Link className={styles.demoLink} href="/demo"><span>Explorar la demo</span><span aria-hidden="true">↗</span></Link>
        <p className={styles.legal}>El registro público está cerrado. Tu cuenta se gestiona de forma privada.</p>
      </section>
    </section>
    <div className={styles.footer}>Hecho para avanzar <span>•</span> PEN · America/Lima</div>
  </main>;
}
