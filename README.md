# Finanzas personales

Aplicación en español para registrar ingresos y gastos, planificar pagos, ahorrar y llevar hábitos con recompensas personales. Construida con Next.js, TypeScript y MySQL para el plan Hostinger Business existente, sin nuevos servicios de pago.

## Estado al 13/11/2026

La aplicación se ejecuta localmente y dispone de acceso privado con persistencia en una **base exclusiva de pruebas de Hostinger**. No se ha publicado ni autorizado cargar datos financieros reales. La conexión remota no implica que la web esté desplegada.

| Área | Panel privado | Demo |
| --- | --- | --- |
| Resumen | Saldo acumulado, métricas mensuales, categorías, actividad y registro en modal. | Datos ficticios y registro en memoria. |
| Movimientos | Ingresos, gastos, transferencias, búsqueda, filtros y CSV. | Simulación en memoria con filtros y CSV. |
| Cuentas y categorías | Creación, validación de duplicados y saldos calculados. | Creación en memoria, disponible también al registrar movimientos. |
| Planificación | Presupuestos mensuales; programar, confirmar o cancelar pagos. | Presupuestos y pagos ilustrativos; sin confirmación persistente. |
| Metas y ahorro | Metas con cuenta de ahorro y aportes mediante transferencias. | Meta ilustrativa sin vínculo a cuentas. |
| Hábitos y recompensas | Hábitos iniciales/personalizados, puntos diarios y canjes con límite semanal. | Marcas, creación y canjes simulados. |
| Perfil | Seis avatares originales y temas, guardados por usuario en MySQL. | Selección solo en memoria. |

No hay registro público, recuperación automática de contraseña, edición/borrado de movimientos desde la interfaz ni motor de recurrencia automática de pagos. Respaldo/restauración y preparación para producción siguen pendientes.

La demo usa ejemplos de noviembre de 2026 (hábitos: 11/11/2026), no la fecha actual. No escribe en MySQL ni persiste en el almacenamiento del navegador. Recargar restablece los ejemplos; los hábitos también se reinician al salir de su sección.

## Ejecutar localmente

Usar npm y el lockfile del repositorio. `package.json` admite Node >=22; Node 24 es el objetivo recomendado, **pendiente de validar en Hostinger**. El historial registra compilación y ejecución local con Node 26.13.0.

```sh
npm ci
npm run dev
```

Abrir [la demo](http://localhost:3000/demo) sin credenciales o [el acceso privado](http://localhost:3000/login) con configuración de base. `/` redirige a `/privado`, que exige sesión. Las seis secciones privadas usan `?seccion=resumen|movimientos|cuentas|planificacion|metas|habitos`; la demo navega mediante estado React.

Para compilar y ejecutar el build:

```sh
npm run build
npm run start
```

El build usa webpack. `next.config.mjs` permite `127.0.0.1` como origen adicional de desarrollo; reiniciar el servidor al modificar esa configuración.

## Configurar la base de pruebas

Copiar `.env.example` a `.env.local` **solo si el archivo privado no existe**. Completar las variables privadas de conexión sin imprimirlas ni añadirlas a Git. Para Hostinger, autorizar únicamente la IP pública necesaria y mantener `DB_SSL=true`, con validación de certificado.

La base autorizada es `u519053982_finanzas_test`. El servicio MySQL de Hostinger informa MariaDB 11.8.9; TLS e integración en ese motor constan como comprobados en [el historial](docs/STATUS.md). Esta actualización documental no volvió a conectarse al alojamiento. No reactivar la antigua instancia local de MariaDB en `.local-db`.

Las seis migraciones constan como aplicadas exclusivamente a la base de pruebas:

| Migración | Contenido |
| --- | --- |
| 001_private_finances.sql | Usuarios, sesiones, límites de login, cuentas, categorías y movimientos. |
| 002_planning.sql | Presupuestos y pagos programados. |
| 003_goals.sql | Metas y aportes. |
| 004_habits_rewards.sql | Hábitos, marcas, recompensas y canjes. |
| 005_profile_avatar.sql | Preferencias de avatar por usuario. |
| 006_avatar_validation.sql | Rechazo de avatar vacío, incluso sin modo SQL estricto. |

Para una instalación nueva en una base exclusiva, `npm run db:migrate` aplica las migraciones pendientes. Comprueba SHA-256 y bloqueo de ejecución; no editar migraciones aplicadas ni checksums. Conservar finales LF según `.gitattributes`. DDL autoconfirma y un fallo parcial requiere revisión antes de reintentar. No ejecutar sobre bases de otros sitios.

La cuenta inicial del proyecto ya existe. Solo en una instalación sin usuarios, definir temporalmente `INITIAL_USER_EMAIL` e `INITIAL_USER_PASSWORD` (12–128 caracteres) y ejecutar `npm run db:create-user`. Retirar la contraseña inicial después de comprobar acceso; no usar ese comando para recrear una cuenta existente.

## Arquitectura y reglas

- Next.js 16.4.6, React/React DOM 19.3.1, TypeScript y `mysql2/promise`; versiones resueltas en `package-lock.json`.
- App Router en `src/app`; autenticación y pool en `src/server`; lógica/persistencia en `src/lib`; vistas y controles compartidos en `src/components`. Server Actions privadas validan sesión y revalidan el panel.
- MySQL solo desde servidor, con consultas parametrizadas, propietario tomado de la sesión y referencias compuestas entre datos del mismo usuario.
- Contraseñas con scrypt; sesiones opacas de siete días con hash en MySQL, cookie HttpOnly/SameSite=Lax y revocación al salir. En producción: HTTPS, cookie Secure y prefijo `__Host-`. Límites de intentos persistentes por correo y global.
- PEN, formato `es-PE` y fechas de negocio en America/Lima. Importes positivos DECIMAL(13,2); reglas y acumulados privados con cadenas decimales y céntimos BigInt.
- Transferencias y aportes de ahorro no suman ingresos ni gastos. Pagos futuros no alteran saldos hasta confirmarse; confirmar crea un solo gasto de forma transaccional. Movimientos y aportes rechazan reenvíos duplicados.
- El saldo del Resumen es acumulado; métricas, categorías y actividad corresponden al mes seleccionado. Hábitos: 10 puntos por hábito/día, hoy y seis días anteriores; canjes con saldo suficiente y máximo uno por semana ISO. Los puntos no tienen equivalencia monetaria.
- Identidad propia con koala SVG, Nunito local con licencia OFL y seis temas por avatar; teclado, foco visible y movimiento reducido. Sin solicitudes del visitante a Google Fonts.

## Validación: realizada y pendiente

El detalle reproducible está en [docs/QA.md](docs/QA.md); las fechas y resultados por entrega, en [docs/STATUS.md](docs/STATUS.md).

**Realizado y documentado:** build/typecheck en entregas de código; QA privado inicial y módulos persistentes con usuarios ficticios; integración de permisos, dinero, acceso, planificación, metas y hábitos; integración específica de perfil; QA de rediseños en demo e inspección del CSV descargado. Las siete pruebas locales pasaron en la auditoría documental del 13/11. Estos resultados no equivalen a una nueva ejecución completa ni aprueban producción.

**Pendiente:** QA autenticado de los rediseños recientes, sus estados de espera/error y logout; sidebar con zoom elevado; apertura del CSV en Excel; Node 24/Hostinger; respaldo/restauración, recuperación de acceso y HTTPS/cookies del despliegue.

Al cambiar código:

```sh
npm run build
npm run typecheck
npm test
```

`npm test` contiene nueve pruebas locales, sin conexión a MySQL. Si cambian reglas monetarias, permisos o persistencia, ejecutar/ampliar la integración relevante. `npm run test:integration` ejecuta los archivos general y de perfil; requiere `TEST_DB_NAME` idéntico a `DB_NAME` y crea/limpia identidades ficticias. Usar exclusivamente la base de pruebas. No hay script lint ni suite automatizada de navegador configurados.

## Continuidad y trabajo entre equipos

Leer [AGENTS.md](AGENTS.md), [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) y [STATUS.md](docs/STATUS.md) antes de trabajar. Actualizar contexto y estado al cerrar cada entrega; distinguir resultados históricos de verificaciones nuevas.

```sh
git clone https://github.com/EstefanoCarbajal/finanzas-personales.git
cd finanzas-personales
```

En una copia existente, revisar rama y cambios locales antes de actualizar con `git pull --ff-only`. Trabajar en ramas de mejora, por ejemplo `codex/registro-movimientos`. Los cambios sin commit/push no se sincronizan entre equipos. `main` debe conservar la última versión revisada e integrada; la futura publicación de Hostinger se conectará a ella cuando se autorice.

Nunca versionar contraseñas, tokens, archivos privados de entorno, datos financieros reales ni volcados de base. Git conserva código, no respalda MySQL. No cargar datos reales antes de probar restauración y las demás condiciones de producción.

Fuera del alcance inicial: conexión bancaria, IA, SMS/WhatsApp, cobros a usuarios, premios comerciales, planes familiares, múltiples monedas e intereses de tarjetas.
