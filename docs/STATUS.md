# Estado al 10 de noviembre de 2026

## Entrega 1: base y diseño inicial

- Next.js 16.4.6, React 19.3.1 y TypeScript; dependencias fijadas en package-lock.json.
- Diseño responsive en español: resumen, movimientos, planificación y metas/premios.
- Demo identificada con datos ficticios de noviembre de 2026.
- Registro temporal en memoria: ingresos/gastos con céntimos enteros. Saldo y categorías se recalculan.
- Búsqueda y exportación CSV de ejemplo.
- Sin base de datos conectada ni autenticación. Nada de esto está publicado en Hostinger.
- Contexto persistente en PROJECT_CONTEXT.md y reglas de continuidad en AGENTS.md.

## Verificación realizada

- npm install: 0 vulnerabilidades reportadas por npm al instalar.
- npm run build y npm run typecheck: correctos, Node.js 26.13.0 local.
- Navegador: página abre, gasto de S/ 10,25 reduce saldo de S/ 3.963,00 a S/ 3.952,75 y aumenta gastos a S/ 247,25; categoría también cambia.
- Búsqueda encuentra el movimiento de prueba; navegación a planificación y metas funciona.
- Inspección visual a 390 y 1440 píxeles; la tabla permite desplazamiento horizontal.
- Al recargar se restablecen los datos ficticios, como indica la demo.
- No se verificó todavía una conexión MySQL ni un despliegue Hostinger. Exportación implementada, pendiente de comprobar apertura en Excel.

## Git

La primera versión visual fue guardada por el usuario: commit 1b64b5c en main, coincidente con la referencia local origin/main. Se creó la rama codex/acceso-privado-mysql para la segunda entrega, que todavía tiene cambios locales sin commit.

main debe mantenerse como la última versión comprobada e integrada.

## Entrega 2: acceso privado y persistencia en base de pruebas

- Esquema SQL, migraciones con checksum, cuenta inicial, sesiones, login y movimientos persistentes con transferencias implementados. Demo separada en /demo; acceso privado en /privado. Sin registro público.
- Migración 001_private_finances.sql aplicada a la base vacía de pruebas autorizada en Hostinger mediante conexión TLS. Tablas users, sessions, login_limits, accounts, categories, movements y schema_migrations. Cuenta inicial creada con los datos privados proporcionados por el usuario; tres cuentas y siete categorías iniciales, sin movimientos reales.
- Build y typecheck correctos. Cuatro pruebas unitarias aprobadas. Prueba de integración con cinco subpruebas aprobadas en Hostinger: precisión/transferencias, aislamiento de propietarios (incluidas claves foráneas), duplicados/restricciones, contraseñas/sesiones/expiración/revocación y límite de intentos. Usuarios ficticios y sus movimientos eliminados al terminar.
- Verificación HTTP del formulario real: acceso anónimo redirige a login, contraseña inicial inicia sesión, cookie HttpOnly/SameSite, panel privado responde y logout revoca acceso. Sesión de comprobación eliminada. Pantalla de login comprobada en navegador. Falta revisión visual completa del panel privado y formulario en móvil, y prueba de registro a través de la interfaz.
- Se inicializó una instancia aislada de MariaDB en .local-db y configuración privada .env.local (ambas excluidas de Git). No se crearon las tablas de la aplicación ni la base finanzas_test.
- El usuario configuró los secretos en .env.local y confirmó el acceso remoto; conexión verificada a MariaDB 11.8.9 de Hostinger. La contraseña de creación de cuenta se retira de .env.local después de verificar el login. No se ha publicado la aplicación.
- Instancia aislada local detenida mediante SHUTDOWN tras comprobar su directorio. La carpeta .local-db se conserva excluida de Git. No continuar usando esa instancia.

## Siguiente entrega

1. Probar el registro desde la interfaz y revisar visualmente el panel privado en móvil y escritorio.
2. Añadir gestión de cuentas/categorías, búsqueda/exportación privadas y resumen mensual. Actualmente se incluyen cuentas/categorías iniciales y balance acumulado.
3. Presupuestos, pagos futuros y metas siguen siendo ilustrativos en la demo, sin funciones persistentes todavía.
4. Probar Node.js 24, respaldo/restauración, recuperación de acceso y configuración HTTPS antes de publicar o cargar datos reales.
5. Revisar y guardar esta entrega en Git; no se hizo commit ni push de la rama.
