# Finanzas personales

Aplicación de gastos, planificación y metas personales. Primera versión prevista con Next.js, TypeScript y MySQL en Hostinger Business, sin contratar servicios adicionales.

## Estado

Aplicación Next.js con acceso privado y persistencia en una base exclusiva de pruebas de Hostinger. Incluye login, sesiones, cuentas/categorías iniciales, ingresos, gastos y transferencias. La demo independiente conserva búsqueda, exportación CSV y vistas ilustrativas de planificación, metas y premios. No hay publicación ni autorización para cargar datos financieros reales.

## Ejecutar en tu computadora

Recomendado: Node.js 24 y npm. Instalar dependencias desde las versiones fijadas:

```sh
npm ci
npm run dev
```

Abrir http://localhost:3000. El acceso privado requiere `.env.local`; la demo en `/demo` no necesita credenciales y pierde los cambios al recargar. No introducir información real durante las pruebas.

## Base de pruebas y acceso privado

Copiar `.env.example` a `.env.local` solo si el archivo privado no existe. Completar servidor, puerto, base, usuario y contraseña. En Hostinger autorizar únicamente la IP pública del equipo en MySQL remoto. Mantener `DB_SSL=true`: la conexión TLS con certificado válido ya se comprobó en el alojamiento del proyecto. La aplicación sigue ejecutándose en el equipo; esto no publica la web.

En una base nueva y exclusiva para este proyecto, ejecutar `npm run db:migrate`. La migración inicial **ya está aplicada** en la base de pruebas de este proyecto. Las migraciones aplicadas no deben editarse: se comprueba su checksum. MySQL confirma automáticamente las operaciones de esquema; una migración parcialmente fallida requiere revisión manual antes de reintentar.

Para una instalación nueva, definir temporalmente `INITIAL_USER_EMAIL` e `INITIAL_USER_PASSWORD` (12 a 128 caracteres) en `.env.local` y ejecutar `npm run db:create-user`. El comando solo funciona sin usuarios existentes. Después retirar la contraseña inicial del archivo privado. **La cuenta inicial de este proyecto ya está creada.**

El acceso está en `/login` y el panel en `/privado`. Cada usuario ve sus propias cuentas, categorías y movimientos. El panel muestra balance acumulado; las transferencias entre cuentas, incluidos aportes a ahorros, no suman ingresos ni gastos. Aún no hay edición/borrado de movimientos ni gestión de nuevas cuentas/categorías desde la interfaz.

Las sesiones duran siete días y se revocan al salir. El entorno publicado debe usar HTTPS: las cookies de producción llevan Secure. No existe registro público ni recuperación automática de contraseña todavía.

Para las pruebas de integración, definir `TEST_DB_NAME` con el nombre exacto de la base de pruebas y ejecutar `npm run test:integration`. El comando crea usuarios ficticios con identificadores aleatorios y limpia únicamente sus datos al terminar. No usarlo en producción. `node scripts/check-access.mjs` verifica el login y logout HTTP con el servidor local en 127.0.0.1:3000 y las variables de cuenta inicial presentes temporalmente; no imprime credenciales.

Comprobar antes de integrar cambios:

```sh
npm run build
npm run typecheck
npm test
```

Para ejecutar la compilación: `npm run start`. Se usa webpack al compilar para facilitar compatibilidad con Hostinger. En este equipo se verificó con Node.js 26.13.0; la verificación con Node.js 24 en Hostinger queda pendiente.

## Contexto para continuar

- `docs/PROJECT_CONTEXT.md`: decisiones y alcance acordado.
- `docs/STATUS.md`: avances, verificaciones y siguiente entrega.
- `AGENTS.md`: instrucciones para asistentes que trabajen en el repositorio.
- `.env.example`: plantilla sin secretos para la conexión MySQL.

## Primera versión

1. Acceso privado: una cuenta inicial, registro público cerrado y permisos por usuario.
2. Cuentas, categorías, ingresos, gastos y transferencias sin doble contabilización.
3. Dashboard mensual y presupuestos por categoría.
4. Pagos previstos y recurrentes, separados de movimientos realizados.
5. Metas de ahorro y aportes, sin tratar las transferencias a ahorro como gastos.
6. Revisión semanal, puntos virtuales y premios personales. Historial de canjes y protección contra premios duplicados.
7. Exportación de movimientos y procedimiento de respaldo y recuperación de MySQL.

Moneda inicial: PEN. Zona horaria inicial: America/Lima. Importes almacenados con precisión decimal, nunca como números de coma flotante en la base de datos.

## Arquitectura prevista

- Next.js y TypeScript para interfaz y servidor.
- MySQL en Hostinger para datos persistentes.
- Acceso a MySQL exclusivamente desde el servidor.
- Contraseñas protegidas mediante hash y sesiones seguras.
- Datos de desarrollo separados de los datos reales.
- Una aplicación organizada por módulos; sin Supabase ni servicios de pago adicionales en esta etapa.

Las versiones y bibliotecas concretas se fijarán al crear la aplicación y comprobar su compatibilidad con el entorno Node.js de Hostinger.

## Trabajar desde varios equipos

Primera vez en cada computadora:

```sh
git clone https://github.com/EstefanoCarbajal/finanzas-personales.git
cd finanzas-personales
```

Antes de trabajar, actualizar la rama correspondiente con `git pull --ff-only`. Crear una rama para cada mejora, por ejemplo `git switch -c feat/registro-movimientos`.

Al terminar, revisar los cambios, crear un commit y subir la rama con `git push -u origin NOMBRE_DE_RAMA`. En otro equipo, ejecutar `git fetch` y cambiar a esa rama antes de continuar. Los archivos sin commit o sin push no se sincronizan entre equipos.

`main` contendrá cambios revisados y comprobados. La futura publicación de Hostinger se conectará a esa rama cuando exista una versión funcional. Aún no hay despliegue configurado.

## Secretos y respaldos

Nunca guardar contraseñas, tokens, archivos `.env`, datos financieros reales ni exportaciones de MySQL en Git. Cada equipo tendrá su configuración privada; Hostinger tendrá sus propias variables de entorno.

Git conserva el código, no respalda la base de datos. Antes de usar información real se deberá probar una restauración del respaldo de MySQL.

## Fuera del alcance inicial

Conexiones bancarias, inteligencia artificial, WhatsApp/SMS, cobros a usuarios, premios financiados por terceros, cuentas familiares, múltiples monedas y cálculo de intereses de tarjetas.

## Próxima entrega

La verificación visual y el registro desde la interfaz están completados; el escenario reproducible está en docs/QA.md. Continuar con gestión de cuentas/categorías y resumen mensual, después planificación y metas persistentes. Antes de publicar: verificar Node.js 24, HTTPS, respaldo/restauración y recuperación de acceso. Consultar docs/STATUS.md para las pruebas realizadas y pendientes exactos.
