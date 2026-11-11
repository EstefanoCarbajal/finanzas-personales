# Estado al 11 de noviembre de 2026

## Mejora visual inicial

- Se estableció una dirección visual alegre y motivadora, inspirada en la energía lúdica de Duolingo con identidad propia. Se renovaron colores, tipografía, botones, navegación, tarjetas, paneles, etiquetas y formularios en estilos compartidos por demo y panel privado.
- La mascota queda para una fase futura; el sistema visual deja espacio para incorporarla sin imitar personajes ni marca de terceros.
- Revisión visual de demo y login completada en navegador. La demo adapta bien la navegación y las tarjetas al ancho disponible; el login conserva jerarquía clara y buen contraste. No se accedió con credenciales al panel privado en esta revisión; comparte estilos con la demo y su puerta de entrada comprobada es /login. Revisar el panel con sesión autorizada en la siguiente pasada.
- Panel privado actualizado para compartir la identidad visual: navegación a resumen, movimientos y cuentas; resumen de saldos, formulario y tabla con tipos de movimiento identificados. Build y typecheck correctos. Pendiente revisar el panel en navegador con una sesión autorizada y ajustar móvil/escritorio.
- Navegación privada organizada por secciones: Resumen, Movimientos, Cuentas, Planificación, Metas y ahorro, y Hábitos y recompensas. El resumen conserva indicadores generales y accesos; cada herramienta aparece al elegir su sección en el sidebar. Navegación comprobada con usuario ficticio y a ancho móvil.
- La demo ahora presenta esas mismas seis secciones con datos ficticios. Incluye cuentas ilustrativas y marcas interactivas de hábitos/puntos para exploración; los cambios viven solo en memoria y se reinician al recargar, sin guardarse en navegador ni en MySQL. Build, typecheck y diff check correctos.
- Se permitió `127.0.0.1` como origen adicional del servidor Next.js de desarrollo, ya que el navegador trata ese host distinto de `localhost`; esto evita que la seguridad de recursos de desarrollo deje la demo sin interacción al entrar por la IP local. Reiniciar el servidor de desarrollo tras cambiar la configuración.
- Panel privado ahora permite añadir cuentas y categorías por tipo mediante acciones ligadas al usuario autenticado, con validación de nombre y duplicados. Confirmado en QA con usuario ficticio en la base u519053982_finanzas_test.
- El resumen mensual ahora permite navegar a meses anteriores, bloquea avanzar más allá del mes actual y conserva el cálculo exacto excluyendo transferencias. Los movimientos permiten búsqueda, filtro por mes y tipo; el CSV se genera con los filtros aplicados y protección contra fórmulas.
- QA visual confirmó noviembre con gasto ficticio de S/ 23,45, octubre vacío y vuelta a noviembre con saldo esperado. Búsqueda + filtros por mes/tipo devolvieron el movimiento correcto. Se activó Exportar CSV con los filtros aplicados, pero queda confirmar el archivo descargado en una hoja de cálculo. Revisión a ancho ~700 px; pendiente escritorio amplio.
- Usuario ficticio y movimiento de QA eliminados al terminar; sesión cerrada. No se modificó la cuenta del propietario. Build, typecheck y diff check correctos.

## Presupuestos y pagos futuros

- Migración 002_planning.sql aplicada a u519053982_finanzas_test. Crea presupuestos mensuales por categoría y pagos programados con cuenta/categoría, vencimiento y estado. Sin datos de prueba activos tras el QA.
- El panel permite guardar/actualizar límite mensual por categoría, revisar consumo y disponible, programar pagos, marcarlos como pagados o cancelarlos. Los pagos programados no afectan saldos ni gastos; confirmar el pago crea, en una transacción, un movimiento de gasto y marca el pago, con el ID del pago como clave de idempotencia.
- Restringido por propietario en consultas y claves foráneas compuestas; solo categorías de gasto son válidas para presupuestos/pagos. Importes con DECIMAL(13,2), positivos y hasta dos decimales.
- QA visual: presupuesto S/ 120, pago futuro S/ 25,75; saldo permaneció S/ 0 mientras estaba programado. Tras confirmación, el pago desapareció de pendientes, se registró un solo gasto y el presupuesto mostró S/ 25,75 consumidos y S/ 94,25 disponibles. Sesión y fixtures eliminados.
- `npm test`: 4 pruebas aprobadas. `npm run test:integration`: 7 pruebas aprobadas, incluyendo propiedad, saldo sin alterar antes de confirmar, exactamente un gasto al confirmar, rechazo de doble confirmación y cancelación. Build, typecheck y diff check correctos.

## Metas y ahorro

- Migración 003_goals.sql aplicada únicamente a u519053982_finanzas_test. Metas con nombre, objetivo, cuenta de ahorro y fecha opcional; aportes con historial ligado a la meta y a una transferencia real entre cuentas del usuario.
- Aporte transaccional e idempotente: crea una transferencia hacia la cuenta de ahorro y registra el avance en la misma transacción. No incrementa ingresos ni gastos. La base exige vínculo del aporte con una meta y un movimiento del mismo usuario.
- Panel permite crear metas, consultar progreso/importe restante y aportar desde otra cuenta. Al alcanzar o superar el objetivo, progreso visual limitado a 100% y etiqueta de meta alcanzada.
- QA visual: meta Viaje QA de S/ 500, aporte ficticio S/ 25,50 desde Efectivo a Ahorros; progreso 5%, gastos e ingresos siguieron en S/ 0. Transferencia visible en movimientos. Sesión y fixtures eliminados.
- Integración comprueba propiedad, precisión, no inflar ingresos/gastos y rechazo de reenvío duplicado. `npm run test:integration`: 8 pruebas aprobadas; `npm test`: 4 aprobadas; build, typecheck y diff check correctos.

## Hábitos y recompensas personales

- Migración 004_habits_rewards.sql aplicada solo a u519053982_finanzas_test. Se crean hábitos iniciales al abrir el panel: tomar agua, pasos diarios, leer, ahorrar y comer saludable; se admiten hábitos personalizados.
- Cada hábito suma 10 puntos una vez por día. Se pueden marcar hoy y los seis días anteriores; la base impide duplicados por usuario/hábito/fecha. El saldo de puntos es acumulado menos canjes.
- Recompensas configurables con costo en puntos, saldo suficiente y límite de un canje por semana. Recompensas y puntos son personales y virtuales, sin equivalencia monetaria.
- QA visual confirmó marcar “Tomé agua” (+10 puntos), crear y canjear una recompensa de 10 puntos; el saldo pasó a 0, historial mostró 10 acumulados/10 canjeados y bloqueó otro canje esa semana. Usuario, marcas, puntos y recompensa ficticios limpiados.
- `npm test`: 4 pruebas aprobadas; `npm run test:integration`: 9 aprobadas con propiedad, doble marca, saldo y límite semanal. Build, typecheck y diff check correctos.

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

La primera versión visual fue guardada por el usuario: commit 1b64b5c en main. La segunda entrega y la corrección del formulario fueron guardadas por el usuario en 85983ec (Base_Pruebas), en la rama codex/acceso-privado-mysql. Esta entrega documenta la verificación final sobre esa rama.

main debe mantenerse como la última versión comprobada e integrada.

## Entrega 2: acceso privado y persistencia en base de pruebas

- Esquema SQL, migraciones con checksum, cuenta inicial, sesiones, login y movimientos persistentes con transferencias implementados. Demo separada en /demo; acceso privado en /privado. Sin registro público.
- Migración 001_private_finances.sql aplicada a la base vacía de pruebas autorizada en Hostinger mediante conexión TLS. Tablas users, sessions, login_limits, accounts, categories, movements y schema_migrations. Cuenta inicial creada con los datos privados proporcionados por el usuario; tres cuentas y siete categorías iniciales, sin movimientos reales.
- Build y typecheck correctos. Cuatro pruebas unitarias aprobadas. Prueba de integración con cinco subpruebas aprobadas en Hostinger: precisión/transferencias, aislamiento de propietarios (incluidas claves foráneas), duplicados/restricciones, contraseñas/sesiones/expiración/revocación y límite de intentos. Usuarios ficticios y sus movimientos eliminados al terminar.
- Verificación HTTP del formulario real: acceso anónimo redirige a login, contraseña inicial inicia sesión, cookie HttpOnly/SameSite, panel privado responde y logout revoca acceso. Sesión de comprobación eliminada.
- Verificación de interfaz finalizada el 11/11: ingreso ficticio de S/ 100, gasto de S/ 10,25 y transferencia de S/ 25 desde Efectivo a Ahorros. Saldo total S/ 89,75, Efectivo S/ 64,75 y Ahorros S/ 25; ingresos y gastos no cambian por la transferencia. Los tres movimientos persisten tras recargar y reiniciar el servidor local. Cierre de sesión devuelve a /login.
- Corregido y verificado el reinicio automático del formulario: ante una transferencia inválida se conservan descripción, importe y tipo; después de guardar se limpian solo descripción/importe y se mantiene la selección. Campos bloqueados mientras se guarda. Corrección incluida en 85983ec.
- Panel revisado visualmente a 390x844 y 1440x1000. En móvil no hay desbordamiento horizontal de la página; la tabla tiene desplazamiento propio. Correo largo se ajusta a varias líneas. Cuenta ficticia de interfaz y sus tres movimientos eliminados mediante tests/ui-fixture.mjs cleanup; cuenta del usuario conservada.
- Se inicializó una instancia aislada de MariaDB en .local-db y configuración privada .env.local (ambas excluidas de Git). No se crearon las tablas de la aplicación ni la base finanzas_test.
- El usuario configuró los secretos en .env.local y confirmó el acceso remoto; conexión verificada a MariaDB 11.8.9 de Hostinger. La contraseña de creación de cuenta se retira de .env.local después de verificar el login. No se ha publicado la aplicación.
- Instancia aislada local detenida mediante SHUTDOWN tras comprobar su directorio. La carpeta .local-db se conserva excluida de Git. No continuar usando esa instancia.

## Siguiente entrega

1. Revisar respaldo/restauración, recuperación de acceso y configuración HTTPS/cookies seguras antes de producción.
2. Probar en Node.js 24 y revisar la descarga CSV en Excel.
3. La aplicación sigue sin publicar; completar respaldos/restauración, recuperación de acceso y HTTPS/cookies seguras antes de producción o datos reales.
