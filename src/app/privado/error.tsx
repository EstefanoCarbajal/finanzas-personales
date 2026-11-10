'use client';
export default function PrivateError({ reset }: { reset: () => void }) {
  return <main className="login-shell"><section className="panel"><h1>No pudimos cargar tu espacio.</h1><p>Comprueba que la base de datos esté disponible y vuelve a intentar.</p><button className="primary" onClick={reset}>Reintentar</button></section></main>;
}
