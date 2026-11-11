# Contexto y decisiones

## Objetivo
Aplicación personal para registrar gastos e ingresos, categorías, dashboards, presupuestos, ahorros, pagos futuros, metas, puntos y canjes. Evolución posterior a producto para otros usuarios.

## Acuerdos con Estefano
- Usar Next.js + TypeScript + MySQL en el plan Business de Hostinger que ya tiene. No contratar servicios adicionales.
- Hostinger muestra Web App, subida por Git y dominio temporal. El usuario confirmó MySQL y capacidad disponible. No se ha publicado la aplicación.
- Git desde el inicio porque desarrolla desde varios ordenadores. Repositorio: https://github.com/EstefanoCarbajal/finanzas-personales.git
- Copia elegida: C:\Users\ofici\Documents\Proyectos_GitHub\finanzas-personales
- main estable; mejoras en ramas. Hostinger se conectará posteriormente a main.
- Usuario inicial privado, registro público cerrado, separación por usuario desde el modelo de datos.
- PEN y America/Lima como valores iniciales, pendientes de personalización futura.
- Supabase no es necesario ni una migración obligatoria.
- Decisión del 10/11/2026: usar una base exclusiva de pruebas en Hostinger con datos ficticios. No continuar con MariaDB local. Conexión remota TLS con validación de certificado comprobada y primera migración aplicada. El servicio MySQL de este alojamiento informa MariaDB 11.8.9; las pruebas de integración pasaron en ese motor. Configuración exclusivamente en .env.local. No ejecutar migraciones sobre bases de otros sitios.
- Acceso privado en /privado, login en /login y demo aislada en /demo. Sesiones opacas de siete días con hash en MySQL y cookie HttpOnly (Secure en producción); contraseñas con scrypt y límite persistente de intentos. No hay registro público.
- Movimientos de importe positivo DECIMAL(13,2), propietario obligatorio y referencias compuestas que impiden usar cuentas/categorías ajenas. Una transferencia es una sola fila con origen y destino. Idempotencia mediante identificador de envío. Balance acumulado calculado con céntimos BigInt; PEN y fecha de Lima.
- Verificación de interfaz completada el 11/11/2026 con usuario ficticio independiente y limpieza posterior. Conservar valores del formulario ante errores; tras guardar, limpiar descripción/importe y mantener tipo, cuentas y fecha. Pruebas de escritorio y móvil incluidas en docs/QA.md. La siguiente mejora es gestión de cuentas/categorías y resumen mensual, sin publicar todavía.
- Dirección visual acordada el 11/11/2026: frontend alegre, motivador y accesible, inspirado en la energía lúdica de Duolingo pero con marca propia. Usar verdes y lima, formas redondeadas, microdetalles expresivos y reservar espacio futuro para una mascota original; no copiar personajes ni identidad visual de Duolingo.
- La demo y el panel privado comparten la navegación por Resumen, Movimientos, Cuentas, Planificación, Metas y ahorro, y Hábitos y recompensas. La demo usa exclusivamente datos ilustrativos en memoria; no los guarda en navegador ni en la base de datos y se restablecen al recargar.
- Identidad visual: icono minimalista propio de koala en SVG, aplicado a demo, panel privado y favicon.
- El resumen mensual privado destaca visualmente el balance disponible, compara ingresos y gastos con barras simples y ofrece mensajes de orientación; conserva PEN, exactitud decimal y exclusión de transferencias.

## Fases
1. Base ejecutable y diseño inicial.
2. Modelo MySQL, migraciones y acceso privado.
3. Movimientos, cuentas, categorías y transferencias.
4. Dashboard calculado, presupuestos y pagos futuros.
5. Metas, puntos y premios personales.
6. Pruebas de permisos, cálculos, respaldos y restauración; despliegue Hostinger.

## Reglas de negocio
Transferencias y aportes de ahorro no deben inflar gastos. Pagos futuros se mantienen separados hasta confirmación. Puntos virtuales sin equivalencia monetaria: cada hábito personal marcado suma 10 puntos por día, máximo una vez por hábito/día; se puede llevar registro de hoy y los seis días anteriores. Hábitos iniciales: tomar agua, alcanzar pasos diarios, leer páginas, ahorrar y comer saludable; se pueden añadir hábitos propios. Canjes con saldo suficiente e historial, máximo una recompensa por semana; no premiar cantidad de gastos registrados. Premios que cuestan dinero se registran como gasto al pagarse.

## Fuera de la primera versión
Conexión bancaria, IA, SMS/WhatsApp, cobros de suscripción, premios comerciales, planes familiares, varias monedas y cálculo de intereses de tarjetas.

## Memoria
Este documento es el contexto persistente del proyecto, guardado en Git; no supone memoria automática de todos los chats. Actualizarlo cuando se acuerden cambios.

