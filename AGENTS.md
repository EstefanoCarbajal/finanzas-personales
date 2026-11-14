# Instrucciones del proyecto

## Continuidad y alcance de esta guía

Estado contrastado con el código y la documentación del repositorio el **13/11/2026**. Esta guía resume lo construido y las decisiones disponibles; no supone acceso automático a conversaciones de otros chats.

Antes de trabajar:

1. Leer `docs/PROJECT_CONTEXT.md` (acuerdos y alcance) y `docs/STATUS.md` (entregas, verificaciones y pendientes). Consultar `docs/QA.md` para reproducir el escenario privado con identidad ficticia.
2. Revisar rama, cambios locales y archivos afectados. Trabajar en ramas de mejora, con prefijo `codex/` para ramas nuevas; `main` debe conservar la última versión revisada e integrada. No descartar cambios ajenos ni modificar manualmente archivos generados como `next-env.d.ts`.
3. Contrastar el historial con la implementación: los apartados antiguos de STATUS describen su fecha, no necesariamente el presente. README y QA se reconciliaron el 13/11/2026; distinguen cobertura actual, resultados históricos y pendientes. No tratar las primeras entregas como limitaciones actuales.

Al cerrar cada entrega, actualizar **ambos** `docs/PROJECT_CONTEXT.md` y `docs/STATUS.md` con decisiones, cambios, validaciones realmente ejecutadas y pendientes. Distinguir evidencia histórica, inspección de código y comprobaciones nuevas; no declarar QA, integración o despliegue si no se realizaron.

## Producto y restricciones acordadas

- Aplicación personal de ingresos, gastos, cuentas, categorías, resumen mensual, presupuestos, pagos futuros, metas de ahorro, hábitos y recompensas; evolución posterior a producto para otros usuarios.
- Next.js + TypeScript + MySQL en el plan **Hostinger Business existente**, sin nuevos servicios de pago. Supabase no es necesario ni una migración obligatoria.
- Interfaz en español, responsive, moneda inicial **PEN**, formato `es-PE` y fechas de negocio en **America/Lima**. No confundir fechas civiles de Lima con timestamps UTC de sesiones/base.
- Acceso privado con cuenta inicial y registro público cerrado. **No se ha publicado la aplicación ni autorizado cargar datos financieros reales.** La conexión remota existente es a una base exclusiva de pruebas; no confundirla con una publicación web.
- Antes de producción o datos reales: comprobar permisos por usuario, respaldo y restauración, recuperación de acceso, compatibilidad del entorno objetivo y HTTPS/cookies seguras. No publicar por iniciativa propia.
- Fuera del alcance inicial: conexiones bancarias, IA, SMS/WhatsApp, suscripciones cobradas a usuarios, premios comerciales, planes familiares, múltiples monedas y cálculo de intereses de tarjetas.

## Arquitectura y mapa del código

- Dependencias actuales en `package.json` y `package-lock.json`: Next.js **16.4.6**, React/React DOM **19.3.1**, TypeScript y `mysql2/promise`. Respetar el lockfile; no actualizar dependencias sin necesidad de la entrega.
- App Router en `src/app`. `/` redirige a `/privado`; `/login` autentica; `/privado` exige sesión y es dinámico; `/demo` es pública y aislada.
- Las seis secciones privadas se eligen con `/privado?seccion=resumen|movimientos|cuentas|planificacion|metas|habitos`. La demo navega con estado React; no son seis rutas independientes.
- `src/server/auth.ts` y `db.ts`: frontera del servidor con `server-only`, sesión y pool MySQL. `src/lib/database.mjs`: configuración del pool; decimales como cadenas (`decimalNumbers: false`), fechas como cadenas y TLS según entorno.
- `src/lib/repository.mjs`: acceso, sesiones, validación/persistencia de movimientos y lectura del dashboard. `money.mjs`: importes exactos. `planning.mjs`, `goals.mjs`, `habits.mjs` y `profile.mjs`: lógica y persistencia por módulo. Mantener estas utilidades `.mjs` compatibles con las pruebas Node existentes.
- `src/app/privado/actions.ts`, `profile-actions.ts` y `src/app/login/actions.ts`: Server Actions autenticadas y revalidación. La página privada orquesta lecturas; componentes de cliente gestionan interacción y formularios.
- `src/components`: shell, avatares, menú de perfil, espacios de movimientos/cuentas, campos, modal y tablero de hábitos compartidos entre demo/privado. `src/components/dashboard.tsx` compone la demo; los paneles privados están en `src/app/privado`.
- Estilos globales en `src/app/globals.css`, `typography.css` y `avatar-theme.css`; vistas compartidas con CSS Modules. No introducir otro framework visual sin una razón acordada.

## Funcionalidad construida

| Módulo | Estado implementado |
| --- | --- |
| Acceso privado | Login, sesiones persistentes, revocación al salir y límite persistente de intentos; sin registro público ni recuperación automática. |
| Resumen | Saldo acumulado, métricas y actividad por mes, navegación a meses anteriores sin avanzar al futuro, gastos por categoría y accesos rápidos. Modal compartido para registrar sin abandonar el resumen. |
| Movimientos | Ingresos, gastos y transferencias; filtros combinables de texto/mes/tipo, historial por fecha, balance de selección y CSV filtrado. No existe edición/borrado desde la interfaz. |
| Cuentas y categorías | Creación con validación de nombre/duplicados; categorías de ingreso/gasto y saldos derivados de movimientos. Cuentas nuevas con saldo cero. |
| Planificación privada | Presupuesto mensual por categoría de gasto; pagos futuros que se pueden confirmar o cancelar. No hay motor de recurrencia automática. |
| Metas privadas | Creación con cuenta de ahorro, objetivo y fecha opcional; aportes transaccionales mediante transferencias e historial de avance. |
| Hábitos y recompensas | Hábitos iniciales/personalizados, registro diario, puntos acumulados, premios personales y límite semanal de canje. |
| Perfil | Seis avatares originales con vista previa, confirmación y tema de toda la interfaz. Preferencia privada persistida por usuario en MySQL. |

En la demo, movimientos, cuentas, categorías, hábitos, canjes y avatar se simulan **solo en memoria**; se restablecen al recargar. Hábitos también se reinicia al salir de su sección. Planificación y metas tienen vistas ilustrativas, sin las acciones persistentes del privado. Los ejemplos usan noviembre de 2026 (hábitos: 11/11/2026), no la fecha actual del usuario.

## Seguridad, datos y migraciones

- Secretos exclusivamente en variables privadas, normalmente `.env.local`; usar `.env.example` como plantilla solo cuando no exista configuración. Nunca versionar ni imprimir contraseñas, tokens, contenido del entorno, datos reales o volcados de base.
- MySQL solo desde servidor. Toda lectura/escritura privada debe tomar el propietario de `requireUser()`, nunca de un campo enviado por el cliente. Mantener consultas parametrizadas, filtros `user_id` y claves foráneas compuestas para referencias del mismo usuario.
- Contraseñas con `scrypt` y sal aleatoria. Sesiones opacas aleatorias de siete días; solo su hash se guarda en MySQL. Cookie HttpOnly, SameSite=Lax, Path=/; en producción Secure y prefijo `__Host-`. Logout revoca sesión en base y elimina cookie.
- El login limita intentos en ventanas de 15 minutos mediante buckets persistentes por correo y global. No sustituirlo por estado de proceso o navegador.
- Conexión de pruebas documentada en Hostinger con TLS y validación de certificado (`DB_SSL=true`). El servicio informa **MariaDB 11.8.9**; no dar por probada compatibilidad con otro motor/versión. Autorizar solo la IP necesaria para acceso remoto.
- La base exclusiva autorizada es `u519053982_finanzas_test`; las migraciones 001–006 constan como aplicadas en STATUS. No ejecutar migraciones sobre bases de otros sitios ni cambiar la cuenta del propietario durante QA.
- `migrations/001_private_finances.sql`: usuarios, sesiones, límites, cuentas, categorías y movimientos. `002_planning.sql`: presupuestos/pagos. `003_goals.sql`: metas/aportes. `004_habits_rewards.sql`: hábitos, marcas, premios y canjes. `005_profile_avatar.sql`: preferencias. `006_avatar_validation.sql`: rechazo de avatar ENUM vacío, incluso sin modo estricto.
- `scripts/migrate.mjs` comprueba SHA-256 en `schema_migrations` y obtiene un bloqueo de migración. **No editar migraciones aplicadas ni sus checksums**; añadir una nueva. Conservar finales LF según `.gitattributes`. DDL autoconfirma: un fallo parcial exige revisar el estado antes de reintentar.
- `db:create-user` solo crea la cuenta inicial cuando no hay usuarios; no usarlo para recrear una cuenta existente. Retirar la contraseña inicial temporal tras verificar acceso.
- No reactivar la antigua instancia MariaDB de `.local-db`. La carpeta sigue excluida de Git y también contiene el identificador del fixture de QA; no confundir ese uso con una base local activa.
- No persistir datos financieros en localStorage, sessionStorage, IndexedDB u otra solución de navegador. La demo no debe escribir en MySQL ni llamar a acciones privadas.

## Reglas de negocio que deben conservarse

- Importes positivos en **DECIMAL(13,2)**; convertir cadenas decimales a céntimos `BigInt` para reglas y acumulados con `money.mjs`. No usar coma flotante para los cálculos monetarios privados. La demo actual usa céntimos enteros en su estado y adapta a las utilidades compartidas; no extrapolarla como almacenamiento definitivo.
- Ingreso/gasto requiere categoría del tipo correcto; transferencia exige cuentas distintas y carece de categoría. Fecha de movimiento real, no futura, validada con fecha civil de Lima.
- Una transferencia es **una sola fila**: disminuye origen y aumenta destino; no cambia ingresos, gastos ni saldo total. Aportes de ahorro tampoco son gastos.
- Conservar `request_id` y restricciones únicas para rechazar reenvíos duplicados. Mantener transacciones, bloqueos y rollback en operaciones de varias escrituras.
- El saldo total es acumulado aunque cambie el mes del Resumen. Métricas, gráfico y actividad son mensuales; transferencias solo aparecen como actividad y cambios de saldos por cuenta. El gráfico agrupa categorías menores cuando hay más de seis.
- Pago programado no modifica saldo ni gasto. Confirmarlo crea exactamente un gasto y cambia su estado en la misma transacción, usando el ID del pago como clave de idempotencia. Cancelarlo no crea movimiento.
- Aportar a una meta crea transferencia y aporte en una sola transacción, entre cuentas propias distintas. El progreso puede superar el objetivo monetario; la barra visual se limita al 100%.
- Hábitos iniciales: agua, pasos, lectura, ahorro y alimentación saludable. Cada hábito completado suma **10 puntos**, una vez por hábito/día, para hoy o los seis días anteriores. El indicador semanal representa días con actividad, no una racha.
- Puntos personales virtuales sin equivalencia monetaria; saldo = acumulado menos canjeado. Premio configurable desde 10 puntos, saldo suficiente y **un canje por usuario por semana ISO**. No premiar cantidad de gastos. Un premio que cuesta dinero requiere registrar gasto cuando se pague; el canje no lo crea automáticamente.
- CSV: conservar filtros, BOM, separador punto y coma y protección contra fórmulas. La inspección del archivo descargado está documentada; su apertura en Excel sigue pendiente.

## Diseño y comportamiento acordados

- Identidad propia alegre y accesible, inspirada en energía lúdica; no copiar personajes ni marca Duolingo. Koala SVG original como marca y favicon; sin mascota animada independiente implementada.
- Nunito variable alojada localmente con `next/font/local`, licencia OFL en `src/app/fonts`; encabezados conservan su familia actual. Sin peticiones del visitante a Google Fonts. Mantener cifras tabulares y controles legibles en móvil.
- Sidebar con icono y nombre de módulo, sin subtítulos. Scroll propio con altura/zoom limitado. Hasta 900 px, navegación en diálogo nativo con fondo aislado, Escape, devolución de foco y bloqueo de desplazamiento.
- Topbar minimalista con título, indicador Demo/Privado, acción «Nuevo movimiento» y perfil; botón de acción de 44 px en móvil. El botón del Resumen «Registrar movimiento» abre el modal. Padding superior de escritorio de 26 px.
- Resumen y Cuentas con poco texto: nombres directos, cifras protagonistas, estados vacíos breves y aviso demo compacto. No reintroducir frases decorativas eliminadas por preferencia del usuario.
- En Movimientos, la zona verde corresponde al formulario «Anota tu movimiento»; historial debajo y a todo el ancho. No restaurar el antiguo resumen de saldo/ingresos/gastos sobre el formulario.
- Ante errores de formulario, conservar datos. Después de guardar movimiento, limpiar solo descripción/importe y mantener selecciones; bloquear controles durante guardado. Modal: cierre manual conserva borrador en memoria, éxito cierra y actualiza resumen, cierre bloqueado mientras guarda. Conservar normalización de coma decimal en campos compartidos.
- Avatar/tema: koala/lima, zorro/durazno, gato/lavanda, panda/menta, conejo/rosa, oso/arena. Catálogo/paletas en `avatars.mjs` y `avatar-themes.mjs`; tema derivado de identificador, sin guardar colores arbitrarios. Vista previa solo en menú hasta «Aplicar avatar y colores»; privado persiste en `user_preferences`, demo solo en memoria.
- Aplicar temas a las seis secciones y al modal; conservar koala de marca y colores semánticos de ingresos, gastos y errores. Respetar movimiento reducido, teclado, foco visible, cierre exterior/Escape, contraste y acceso al cierre de sesión.

## Ejecución y validación

- `npm ci` instala el lockfile; `npm run dev` inicia desarrollo; `npm run build` compila con webpack; `npm run start` sirve el build. `next.config.mjs` permite `127.0.0.1` como origen adicional de desarrollo; reiniciar servidor al cambiar configuración.
- `package.json` admite Node >=22; Node 24 es el objetivo recomendado aún pendiente de validar en Hostinger. El historial registra ejecución local en Node 26.13.0; no asumir paridad con producción.
- Al cambiar código, ejecutar **`npm run build` y `npm run typecheck`**. Tras generar tipos con build, comprobar typecheck. Ejecutar `npm test` para reglas afectadas; actualmente contiene siete pruebas locales de dinero, fechas, contraseñas, perfil y contraste. No hay script lint ni suite automatizada de navegador configurados.
- Si se modifican reglas monetarias, permisos o persistencia, ampliar/ejecutar pruebas relevantes. `npm run test:integration` ejecuta `tests/integration.mjs` y `tests/profile-integration.mjs`; exige `TEST_DB_NAME` idéntico a `DB_NAME` y crea/limpia usuarios ficticios exclusivamente en la base de pruebas. No ejecutarlo contra producción.
- QA interactivo privado: `node tests/ui-fixture.mjs create` y `cleanup`, con `UI_TEST_PASSWORD` temporal y base confirmada. Usar identidad ficticia aislada, limpiar al finalizar y no probar mutaciones con credenciales del propietario. `scripts/check-access.mjs` comprueba login/logout HTTP; consultar sus requisitos antes de ejecutarlo.
- Revisar responsive (incluidos 320 px, 390 px y escritorio), teclado, estados vacíos, errores/espera, foco, cierre de diálogos y ausencia de desbordamiento. Demo debe restablecer ejemplos al recargar.
- Antes de cerrar, `git diff --check`, revisar diff y actualizar contexto/estado. Para entregas solo documentales no es obligatorio recompilar; indicar el alcance de las comprobaciones.

## Pendientes reales al cierre de esta auditoría

1. QA con sesión privada ficticia autorizada de los rediseños recientes: resumen, modal de registro, movimientos, cuentas/categorías, hábitos, perfil/temas, espera/errores y logout. El QA privado inicial y la integración histórica no sustituyen esa revisión de interfaz nueva.
2. Comprobar sidebar con zoom elevado y CSV en Excel; completar validación en Node 24/entorno Hostinger.
3. Diseñar y probar respaldo/restauración y recuperación de acceso; verificar HTTPS/cookies de producción antes de publicar o introducir datos reales.
4. Actualizar las aserciones de interfaz de `scripts/check-access.mjs` antes de reutilizarlo: aún busca «Tus cuentas» y «Movimientos guardados» en el resumen, textos de la interfaz anterior. QA documenta esta limitación detectada por inspección; el script no se ejecutó en esta entrega.
README y QA actualizados el 13/11/2026: documentan cuentas/categorías y módulos privados persistentes, siete pruebas locales e integración adicional de perfil, con resultados históricos separados de pendientes. No hay recurrencia automática de pagos.

La auditoría documental no constituye una auditoría exhaustiva de seguridad ni una nueva verificación remota. Consultar STATUS para el alcance y resultado de cada entrega.


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
