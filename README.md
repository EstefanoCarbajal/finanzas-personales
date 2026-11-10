# Finanzas personales

Aplicación de gastos, planificación y metas personales. Primera versión prevista con Next.js, TypeScript y MySQL en Hostinger Business, sin contratar servicios adicionales.

## Estado

Repositorio inicial de planificación. La aplicación todavía no está implementada ni publicada.

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

Crear la base ejecutable de Next.js, configuración de ejemplo sin secretos, esquema MySQL y acceso privado. Después implementar y comprobar movimientos y transferencias antes de añadir dashboards y recompensas.
