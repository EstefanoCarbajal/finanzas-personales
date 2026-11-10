import Link from 'next/link';
import { databaseConfigured } from '@/server/db';
import LoginForm from './login-form';

export const dynamic = 'force-dynamic';
export default function LoginPage() {
  const enabled = databaseConfigured();
  return <main className="login-shell"><section className="panel login-panel">
    <span className="eyebrow">FINANZAS PERSONALES</span><h1>Tu espacio privado.</h1>
    <p>Ingresa con tu cuenta para consultar y registrar tus movimientos.</p>
    {!enabled && <p className="demo-note">El acceso privado está pendiente de configuración. Mientras tanto puedes explorar la demo con datos ficticios.</p>}
    <LoginForm enabled={enabled} />
    <p className="subtle">El registro público está cerrado. La cuenta inicial se crea desde la administración del proyecto.</p>
    <Link href="/demo">Explorar la demo sin guardar datos →</Link>
  </section></main>;
}
