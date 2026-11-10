# Instrucciones del proyecto

Leer docs/PROJECT_CONTEXT.md y docs/STATUS.md antes de trabajar. Actualizarlos al cerrar cada entrega para conservar decisiones y pendientes entre equipos y chats.

- Next.js + TypeScript + MySQL. Publicación futura en Hostinger Business existente. Sin nuevos servicios de pago.
- Trabajar en ramas de mejora. No publicar ni conectar datos reales hasta comprobar acceso privado y permisos por usuario.
- Interfaz en español, responsive; moneda PEN y zona America/Lima.
- No almacenar datos reales en navegador como solución final. La demo debe identificarse y no persistir datos.
- Secretos solo en variables de entorno privadas. Nunca añadirlos al repositorio.
- Dinero con precisión decimal en MySQL; transferencias no son gastos.
- Ejecutar build y typecheck al cambiar código. Probar reglas monetarias y permisos cuando se implementen.


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
