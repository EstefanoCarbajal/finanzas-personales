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

La creación de la rama feat/base-aplicacion falló por restricciones de escritura de los archivos internos de Git, incluso después del permiso solicitado. Los archivos permanecen en la copia local del usuario, sin commit ni push de esta entrega. No se modificó el historial ni el remoto.

Para guardar desde la terminal del usuario, primero revisar git status, crear la rama con git switch -c feat/base-aplicacion, añadir los archivos, hacer commit y push. main debe mantenerse como la última versión comprobada e integrada.

## Siguiente entrega

1. Esquema MySQL con usuario propietario y restricciones de integridad.
2. Migraciones y procedimiento para crear la cuenta inicial sin registro público.
3. Login con hash de contraseñas y sesiones protegidas; comprobación de permisos en cada operación.
4. Movimientos reales con cuentas, categorías, transferencias y pruebas de precisión monetaria.
5. Probar Node.js 24, respaldo/restauración y publicación en Hostinger cuando corresponda.
