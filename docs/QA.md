# Verificación del espacio privado — 11/11/2026

Entorno: aplicación local, base exclusiva de pruebas en Hostinger mediante TLS. Usuario ficticio aislado de la cuenta del propietario. No se cargaron datos financieros reales.

## Escenario comprobado en navegador

1. Iniciar sesión con el usuario ficticio.
2. Registrar ingreso de S/ 100 en Efectivo y gasto de S/ 10,25 en Alimentación. Saldo esperado: S/ 89,75.
3. Intentar una transferencia con origen y destino iguales. Debe mostrar el error sin borrar descripción/importe ni cambiar el tipo visible. No se guarda ningún movimiento.
4. Corregir el origen a Efectivo y el destino a Ahorros y guardar S/ 25. El formulario limpia descripción/importe, conserva selecciones y vuelve a habilitarse.
5. Comprobar ingresos S/ 100, gastos S/ 10,25, saldo S/ 89,75; Efectivo S/ 64,75 y Ahorros S/ 25.
6. Recargar: los tres movimientos y sus saldos permanecen. También se comprobó la persistencia del ingreso y gasto tras reiniciar el servidor local entre sesiones de trabajo.
7. Revisar panel/formulario/tabla a 390x844 y 1440x1000. Sin desbordamiento horizontal de página en móvil; tabla desplazable en su contenedor.
8. Cerrar sesión y comprobar el regreso a /login.

Resultado: aprobado. Se encontró y corrigió el reinicio del formulario después de errores de validación; corrección guardada en el commit 85983ec antes de cerrar estas pruebas.

## Repetir sin tocar la cuenta del propietario

- Usar exclusivamente una base de pruebas. Configurar TEST_DB_NAME con el mismo nombre que DB_NAME y UI_TEST_PASSWORD con una contraseña temporal en el entorno privado de la terminal.
- Ejecutar `node tests/ui-fixture.mjs create`. Conserva el identificador ficticio en `.local-db/ui-fixture.json`, excluido de Git; no imprime la contraseña.
- Realizar el escenario anterior con el correo ficticio que devuelve el comando.
- Ejecutar `node tests/ui-fixture.mjs cleanup`, que elimina únicamente esa identidad y sus datos. La limpieza de esta ejecución ya terminó correctamente.
- No usar las credenciales de la cuenta del propietario para pruebas que crean o borran movimientos.

## Comprobaciones automatizadas

`npm run build`, `npm run typecheck` y `npm test` validan compilación, tipos y cuatro pruebas unitarias de importes, transferencias, fechas y contraseñas.

`npm run test:integration`, con TEST_DB_NAME definido para la base autorizada, verifica cinco escenarios sobre MySQL: precisión y transferencias; aislamiento entre usuarios; duplicados y restricciones; sesiones, expiración y revocación; límites de acceso. Limpia sus usuarios ficticios al terminar.

## Antes de producción

Pendientes: Node.js 24 en el entorno objetivo, respaldo y restauración, recuperación de acceso y HTTPS/cookies Secure en despliegue. No se ha publicado la aplicación.
