# Contexto y decisiones

## Movimientos solo con historial · 14/11/2026

- Retirados el balance bajo la tabla y los indicadores y gráficos inferiores en demo y privado, junto con sus cálculos y estilos exclusivos. Permanecen la tabla, filtros, exportación y acciones privadas.
- Validación nueva: build y typecheck correctos; diff revisado y diff --check correcto. Sin QA de navegador, pruebas unitarias ni integración remota.


## Historial primero en Movimientos · 14/11/2026

- El historial y sus filtros encabezan la vista de Movimientos en demo y privado; los indicadores y gráficos quedan debajo. Se retiró la cabecera decorativa del dashboard.
- Validación: build y typecheck correctos; diff revisado y diff --check correcto. Sin QA de navegador ni integración remota.


## Dashboard de movimientos · 14/11/2026

- Movimientos en demo y privado muestra balance, ingresos y gastos de la selección, comparación de entradas/salidas, distribución de gastos por categoría y tabla con fecha, cuenta, tipo e importe. Los gráficos y totales responden a los filtros del historial; las transferencias se excluyen de ingresos y gastos. Las categorías menores se agrupan desde la quinta. Importes acumulados en céntimos BigInt.
- Se retira el formulario de la página; el registro sigue disponible desde el modal del botón superior. Se conservan filtros, CSV y acciones privadas de edición/eliminación. La tabla permite desplazamiento horizontal en pantallas estrechas.
- Validación nueva: build y typecheck correctos; npm test 8/9, con fallo previo de contraste fox: deep/accent; diff revisado y diff --check correcto. No se realizó QA visual o interactivo de navegador, QA privado, integración remota ni publicación. Quedan pendientes la revisión responsive (320/390 px y escritorio), teclado, temas, filtros y estados vacíos en navegador.


## Aviso de transferencias retirado del Resumen · 14/11/2026

- Quitado «Ingresos y gastos no incluyen transferencias.» de la vista Resumen privada y eliminado su estilo exclusivo. La regla contable se mantiene en los cálculos y en el historial técnico.
- Validación: build, typecheck y git diff --check correctos; diff revisado. Sin cambios de lógica financiera, QA de navegador, integración remota ni publicación.

## Modal con título e importe directos · 14/11/2026

- Eliminados «UN PASO MÁS» de la cabecera privada y «¿Cuánto?» del campo de importe en los formularios compactos (registro y edición). Se conserva el nombre accesible «Importe en soles» y el indicador «MODO DEMO» únicamente en la demo.
- Cabecera con título centrado verticalmente junto al avatar/cierre y espacio flexible; menor separación hacia los tipos de movimiento. El importe queda centrado sin margen superior residual, con padding equilibrado en escritorio y móvil.
- Validación nueva: build, typecheck y git diff --check correctos; diff revisado. Modal de demo inspeccionado en escritorio y 320/390 px, sin desbordamiento horizontal en las mediciones móviles ni errores de consola capturados. Sin nuevas pruebas unitarias (cambio visual), QA privado autenticado, integración remota ni publicación.

## Modal desde el topbar en todas las secciones · 14/11/2026

- «Nuevo movimiento» del topbar es ahora un botón que abre el modal en la sección actual, en demo y privado. Ya no navega a Movimientos. La demo reutiliza su modal existente; el privado incorpora PrivateDashboardShell para compartir una sola instancia y borrador entre topbar y «Registrar movimiento» del Resumen.
- La página privada carga también los datos del dashboard en Hábitos para proporcionar cuentas/categorías al registro. Se reutilizan readDashboard con propietario autenticado y MovementForm con addMovement, request_id, revalidación, conservación de datos ante error y bloqueo de cierre durante guardado. Sin cambios en reglas monetarias ni escrituras del servidor.
- QA nuevo de demo: apertura/cierre desde las seis secciones, sin cambiar encabezado ni URL; borrador con coma decimal conservado al reabrir; guardar gasto ficticio S/ 12,50 desde Hábitos cierra el modal y mantiene la sección. Resumen posterior: gastos S/ 249,50 y balance S/ 3.950,50. Escape cierra y devuelve foco al topbar. Móvil a 390 px desde Cuentas, sin desbordamiento horizontal; sin errores de consola capturados.
- Build y typecheck correctos; npm test 8/9, con el fallo previo fox: deep/accent. Diff revisado y git diff --check correcto. Pendiente QA privado autenticado del modal global (incluidos espera, errores y guardado); no se ejecutaron integración remota, migraciones ni publicación.

## Resumen sin accesos rápidos · 14/11/2026

- Retirada por petición del usuario la sección «Accesos rápidos» del Resumen en demo y privado, para todos los avatares. Eliminadas las listas de etiquetas/iconos utilizadas exclusivamente por ese bloque.
- Validación nueva: npm run build, npm run typecheck y git diff --check correctos; diff revisado. Sin cambios de reglas o datos; no se repitieron pruebas unitarias, QA de navegador ni integración remota.

## Revisión visual de gastos y rojo cálido · 14/11/2026

- La revisión del usuario confirma que la primera variante frambuesa parecía rosada. Se sustituye por rojo cálido #bc352d en temas claros y #ff8278 en tigre oscuro, con fondos, bordes y barras coordinados. El 0.00 del modal deja de usar opacidad reducida; gasto mensual, balance mensual negativo e importes del formulario usan el mismo rojo. Corregido el selector base que aún conservaba marrón, compartido con la edición privada.
- QA nuevo en /demo: inspección visual de las seis secciones con los seis avatares (36 combinaciones) a 1440 px, más apertura/cierre del modal con importe ficticio 25.75 para cada avatar, sin enviarlo. Planificación, metas y hábitos conservan sus colores de tema donde no representan gastos registrados. Modal claro a 320/390 px, modal oscuro a 390 px y Movimientos oscuro a 320 px inspeccionados; mediciones sin desbordamiento horizontal en esos escenarios y modal oscuro medido a 320 px. Sin errores de consola capturados. No equivale a QA privado autenticado ni a una revisión completa de estados negativos/errores.
- Contraste calculado del texto de gasto sobre surface/soft/expenseBg: mínimo 4,78:1 en temas claros; tigre mínimo 5,58:1 incluyendo raised. Build y typecheck correctos; npm test 8/9, persiste el fallo previo fox: deep/accent, ajeno al rojo de gastos. Diff revisado y git diff --check correcto. Sin integración remota, mutaciones privadas, migraciones ni publicación.

## Gastos en rojo suave · 14/11/2026

- Color semántico compartido de gastos en rojo frambuesa apagado (#b23e50), fondos rosados suaves y barras coordinadas; tigre oscuro con rojo claro (#f5a3aa). Aplicado a resumen, actividad, historial, selector/importe de formularios y modal, categorías de gasto y saldos negativos de cuentas, en demo y privado. Paletas decorativas existentes conservadas.
- Validación nueva: build y typecheck correctos; npm test 8/9, con el fallo previo fox: deep/accent. git diff --check correcto. Sin QA nuevo de navegador, integración remota, migraciones ni publicación.

## Ajuste puntual del gato · 14/11/2026

- A petición del usuario, tema Lavanda: surface = #ffffff (equivalente a #fff) y ondark = #eae8f0. Resto de paleta y avatares conservados; tigre blanco ya presente en el código actual.
- Build, typecheck y diff --check correctos. Contraste puntual del gato: ink/surface 11,09:1, muted/surface 5,26:1 y ondark/deep 7,63:1. npm test: 8/9; persiste el fallo previo fox: deep/accent, ajeno a este cambio. Sin QA de navegador, integración remota ni publicación nuevos.

## Edición y eliminación de movimientos · 14/11/2026

- La sección privada de Movimientos permite editar o eliminar registros desde cada fila. Editar conserva el mismo formulario visual dentro de un diálogo, precarga tipo, importe, descripción, cuentas, categoría y fecha, y mantiene los datos si el servidor devuelve un error. Eliminar requiere una confirmación explícita.
- `src/lib/repository.mjs` valida y persiste actualizaciones/eliminaciones con el `userId` de `requireUser()`, transacciones y bloqueos. No se aceptan IDs de cuentas, categorías o movimientos ajenos. Los aportes de metas no se pueden editar/eliminar para conservar la coherencia de su progreso.
- El rediseño añade acciones contextuales, mejor jerarquía visual y estados táctiles sin alterar demo, CSV, filtros, cálculo exacto con céntimos ni la regla de transferencias como una sola fila.
- Estado de validación de esta entrega: typecheck y build correctos; `npm test` 8/9 por la aserción histórica `fox: deep/accent`; `git diff --check` correcto. QA privado autenticado e integración remota siguen pendientes.

## Rediseño de acceso con constelación de avatares · 13/11/2026

- `/login` ahora usa una composición de alto impacto visual con identidad propia: escenario verde/lima, marca koala, mensaje de bienvenida, tarjeta de acceso elevada y enlace secundario a la demo.
- Los seis avatares SVG existentes se muestran como decoración orbital alrededor del login; son elementos `aria-hidden` y no alteran autenticación, persistencia ni datos. Se conserva el tigre blanco y el catálogo vigente.
- El formulario mantiene `useActionState`, validación HTML, estados de espera/error y deshabilitado cuando la base no está configurada. Los estilos quedan encapsulados en `src/app/login/login.module.css`, con responsive para móvil, foco visible y movimiento reducido.
- Validación nueva: `npm run typecheck`, `npm run build` y `git diff --check` correctos. `npm test` ejecutó 8 de 9 pruebas; falló la aserción preexistente de contraste `fox: deep/accent`, relacionada con los cambios locales de paleta de avatar y no con el login. El primer intento de build/test fue bloqueado por `spawn EPERM` del sandbox y terminó correctamente al repetir con permisos ampliados. La revisión visual en navegador quedó pendiente porque el controlador de Windows no pudo identificar con suficiente confianza la URL de la ventana existente; no se inició sesión ni se tocaron datos.

## Ajuste de colores profundos de zorro, oso y gato · 13/11/2026

- El tema del zorro usa `--theme-deep: #995439`, el del oso `#7b6341` y el del gato `#4b416b`. Se conservan las demás variables, la coneja y los otros avatares.
- Validación realizada: typecheck, build y diff --check; sin cambios de datos ni migraciones.

## Ajuste del color profundo de la coneja · 13/11/2026

- El tema Rosa suave de la coneja usa `--theme-deep: #83546b` en lugar de `#603c4e`. El resto de la paleta y los demás avatares no cambian.
- Validación realizada: typecheck, build y diff --check; sin cambios de datos ni migraciones.

## Ajuste de mejillas de avatares · 13/11/2026

- Se retiró el rubor de las ilustraciones de koala, zorro y tigre. Se conserva en gato, conejo y oso; no cambian catálogos, temas, persistencia ni reglas.
- Validación realizada: typecheck, build y diff --check; sin cambios de datos ni migraciones. El primer build fue bloqueado por `spawn EPERM` del sandbox y el segundo terminó correctamente con permisos ampliados.


## Ajuste del avatar: tigre blanco · 13/11/2026

- Por aclaración del usuario, el tigre representa la variante blanca del tigre de Bengala: pelaje blanco, matices gris perla y rayas negras. Catálogo y nombre accesible actualizados a «Tigre blanco de Bengala».
- Se conservan el identificador tiger, su compatibilidad de almacenamiento y el tema Carbón. Cambio exclusivamente de ilustración y nombre; sin nuevas mutaciones de base, migraciones ni cambios de reglas.
- Validación de esta corrección: build, typecheck y diff --check. Sin nueva prueba de navegador ni integración; el QA y las nueve pruebas locales del apartado anterior son evidencia de la entrega previa.

## Tigre de Bengala y modo oscuro · 13/11/2026

- Panda sustituido por un tigre de Bengala SVG original, conservando seis opciones y el estilo de la familia. Tema «Carbón · Modo oscuro»: carbón/grafito, texto marfil y acento ámbar; superficies, formularios, tarjetas, gráficos, mensajes y controles adaptados en las seis secciones. El modal conserva estructura e interacción; solo incorpora colores oscuros.
- Vista previa limitada al menú hasta confirmar. Aplicar otro avatar restaura su tema claro. Demo permanece en memoria; privado conserva preferencia por usuario. Los colores semánticos mantienen significado con variantes legibles sobre fondos oscuros.
- Compatibilidad deliberada: la aplicación usa tiger; profile.mjs traduce el valor histórico MySQL panda al leer y guarda tiger como panda en el ENUM existente. Preferencias antiguas pasan al tigre sin perderse. No se modifica ni ejecuta ninguna migración; no escribir directamente identificadores de UI en la tabla sin este adaptador.
- Validación: build y typecheck correctos, nueve pruebas locales (incluidos contraste oscuro y compatibilidad de preferencias). Integración específica de perfil aprobada en la base exclusiva de pruebas, con aislamiento de usuarios ficticios y limpieza. Primer intento bloqueado por red del sandbox (EACCES); repetición con permisos ampliados correcta. No se reejecutó la integración general.
- QA nuevo de demo: vista previa oscura antes de aplicar, confirmación, navegación por las seis secciones, modal de registro y regreso al koala claro. Inspección de escritorio y móvil a 320/390 px; mediciones sin desbordamiento horizontal y sin errores de consola registrados. Pendientes: QA privado autenticado, revisión completa por teclado/movimiento reducido y resto de condiciones de producción. Sin publicación ni datos financieros reales.

## Movimientos: coherencia con el selector de avatar · 13/11/2026

- Rediseño limitado a la sección principal de Movimientos, compartida por demo y privado: superficies, bordes de 25 px, controles de 13 px, paletas por avatar y elevación suave inspirados en el selector de perfil. Cabecera y aviso demo simplificados; formulario en su zona de color e historial debajo.
- Filas como tarjetas, importes con colores semánticos y signos, fechas agrupadas, filtros compactos con etiquetas accesibles y vacío breve. Entrada escalonada global limitada a 245 ms, transiciones con curva elástica, hover y pulsación; movimiento reducido desactiva animaciones. No se inventan estados pendientes para movimientos registrados.
- Modales y campos compartidos sin modificaciones; nuevos estilos acotados al workspace. Conservados filtros, CSV, cálculo BigInt, acciones y persistencia. Sin dependencias nuevas.
- Verificación nueva: build, typecheck y siete pruebas locales correctos; revisión del diff y diff --check. Demo inspeccionada en escritorio (1440 px) y móvil (320/390 px), sin desbordamiento horizontal en las mediciones móviles. Filtro de ingresos devuelve un registro y balance S/ 4,200.00; transferencias sin resultados deshabilita CSV; limpiar restaura cuatro registros y S/ 3,963.00.
- Pendientes: QA privado autenticado, teclado exhaustivo, seis temas y preferencia de movimiento reducido en navegador. No se ejecutaron integración remota, migraciones ni publicación; resultados históricos no sustituyen estas verificaciones.

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

### Reconciliación de README y QA · 13/11/2026

- Limitación adicional detectada por lectura: `scripts/check-access.mjs` conserva aserciones de textos anteriores del resumen («Tus cuentas» y «Movimientos guardados»). Pendiente actualizarlas antes de reutilizar el script; no se modificó ni ejecutó en esta entrega.
- README y `docs/QA.md` ya reflejan módulos privados persistentes, límites de la demo, seis migraciones y comandos actuales. Se completa el pendiente documental detectado en la auditoría de AGENTS; las referencias anteriores a ese pendiente son históricas.
- QA separa evidencia histórica, cobertura de scripts y plan de pruebas pendientes. La integración actual contiene ocho subpruebas en el archivo general y una prueba adicional de perfil; no consta reejecución conjunta tras añadir perfil. Las siete pruebas locales aprobadas pertenecen a la auditoría previa del mismo día.
- Esta continuación solo modifica documentación y verifica diff/coherencia; no repite pruebas locales, build/typecheck, navegador, integración remota ni migraciones. Los pendientes privados y de producción siguen abiertos.

### Auditoría de continuidad · 13/11/2026

- `AGENTS.md` se amplía como guía operativa del estado actual, contrastada con código, migraciones, scripts, pruebas y documentación disponible. Resume arquitectura, módulos construidos, seguridad, reglas monetarias, preferencias visuales, comandos y pendientes. No implica acceso al historial completo de otros chats.
- STATUS conserva entregas históricas; afirmaciones antiguas como «sin base de datos» no describen el estado vigente. README y recuentos de QA requieren actualización: cuentas/categorías ya se crean desde la interfaz, planificación/metas/hábitos privados ya persisten, y hay siete pruebas locales más integración específica de perfil. No hay motor de recurrencia automática de pagos.
- La demo comparte vistas pero conserva planificación/metas ilustrativas; sus hábitos también se reinician al cambiar de sección. Los ejemplos son de noviembre de 2026. No confundir esta simulación con las acciones persistentes del panel privado.
- Esta entrega es documental: siete pruebas locales aprobadas, sin compilación nueva, QA interactivo, integración remota, migraciones ni publicación. Los pendientes de producción y de revisión privada de los rediseños siguen abiertos.
Este documento es el contexto persistente del proyecto, guardado en Git; no supone memoria automática de todos los chats. Actualizarlo cuando se acuerden cambios.

- Perfil y temas por avatar del 13/11/2026: menú del topbar con seis animales SVG originales (koala, zorro, gato, panda, conejo y oso), apertura animada, vista previa, selección por teclado y confirmación «Aplicar avatar y colores». Cada avatar define una paleta completa (lima, durazno, lavanda, menta, rosa y arena) para sidebar, topbar, botones, fondos, resumen, movimientos/modal, cuentas, planificación, metas y hábitos. Mantener colores semánticos de ingresos, gastos y errores y el koala de marca. Respetar movimiento reducido y conservar acceso al cierre de sesión.
- Avatar privado guardado en MySQL por usuario autenticado mediante user_preferences; el tema se deriva del identificador, sin almacenamiento local. Migraciones 005 y 006 aplicadas solo a la base exclusiva de pruebas. Restricción adicional contra el valor vacío de ENUM, porque el motor puede convertir valores inválidos cuando no está en modo estricto. Demo mantiene elección únicamente en memoria y vuelve al koala al recargar. Migraciones con finales LF fijados en .gitattributes para conservar sus checksums entre equipos. Pruebas de persistencia, aislamiento y contraste completadas; pendiente comprobar la interacción privada con sesión autorizada.

- Simplificación del Resumen del 12/11/2026: conservar el diseño aprobado y reducir texto. Cabecera «Tu resumen», saldo total con una aclaración de acumulado, métricas «Ingresos», «Gastos» y «Balance» con fórmula breve, títulos directos para categorías y movimientos. Se retiran frases decorativas, subtítulos repetidos y texto del koala; aviso demo en una línea. Estados vacíos breves y acceso a registrar desde actividad vacía. Aplicado a demo/privado, conservando gráficos, selector mensual, cifras y modal.

- Modal de registro del 12/11/2026: «Registrar movimiento» del Resumen abre un diálogo compartido en privado/demo, sin navegar a Movimientos. Diseño compacto con importe protagonista, selector visual por tipo, etiquetas breves, koala y botón lima; en móvil se presenta junto al borde inferior. Diálogo nativo con fondo aislado, bloqueo de desplazamiento, Escape, cierre exterior y retorno de foco. Tras éxito se cierra y el resumen se actualiza; los errores conservan los datos y el cierre manual conserva el borrador en memoria. En privado se mantienen addMovement, revalidación, idempotencia y bloqueo durante el guardado. Coma decimal normalizada a punto en los campos compartidos. Sin nuevas dependencias, cambios de permisos ni persistencia de demo. QA interactivo completado en demo; pendiente verificar guardado del modal con sesión privada autorizada.

- Rediseño del resumen del 11/11/2026: componente visual compartido por privado y demo, estilos aislados en CSS Module, saldo acumulado protagonista verde profundo/lima y koala original. Métricas, categorías y actividad se filtran por mes, mientras el saldo total sigue acumulado. Gráfico circular con leyenda monetaria completa y agrupación de categorías menores; estados vacíos y mensajes según balance. Sin nuevas dependencias ni persistencia de demo. QA de demo en escritorio/móvil completado; pendiente revisión con sesión privada autorizada.
- Hábitos y recompensas rediseñados el 11/11/2026 con vista común para privado/demo y CSS Module aislado: calendario de siete días, progreso del día, puntos y catálogo de premios. El indicador semanal cuenta días con registros, no rachas. Acciones privadas y reglas de canje originales conservadas. La demo simula creación, marcas y canjes solo en memoria; se reinicia al salir de la sección o recargar. QA visual/interactivo de demo aprobado en escritorio y móvil; pendiente sesión privada autorizada.
- Tipografía acordada el 11/11/2026: mantener encabezados actuales y usar Nunito variable para una voz más cálida en textos, controles e importes. Fuente alojada localmente con next/font/local; licencia OFL incluida y origen https://github.com/google/fonts/tree/main/ofl/nunito. Mejorar tamaños auxiliares/interlineado y conservar cifras tabulares. Sin servicios nuevos ni solicitudes del visitante a Google Fonts.
- Movimientos rediseñados el 11/11/2026 con vista y campos compartidos para privado/demo: saldo acumulado, formulario visual por tipo, actividad agrupada por fecha y filtros texto/mes/tipo. Balance de selección exacto con BigInt y transferencias excluidas. CSV conserva protección contra fórmulas y filtros. Demo admite transferencias ficticias solo en memoria. Se mantienen acciones privadas, idempotencia y preservación del formulario; QA de demo y CSV descargado completado, pendiente sesión privada y Excel.
- Ajuste visual de Movimientos del 11/11/2026: por preferencia explícita del usuario, la zona verde se dedica exclusivamente a «Anota tu movimiento» y su formulario. Se elimina el resumen superior de saldo/ingresos/gastos; el historial aparece debajo, fuera de la zona verde y a todo el ancho. Diseño compartido en privado/demo; filtros, exportación y reglas de guardado se conservan.

- Rediseño de navegación del 11/11/2026: DashboardShell compartido por demo/privado con CSS Module, sidebar verde profundo y selección lima, iconos SVG propios y grupos por uso. Topbar fijo con contexto, moneda PEN, modo visible y acceso a Movimientos; cierre de sesión conserva acción del servidor. A 900 px o menos, menú modal nativo con bloqueo de fondo, Escape y retorno de foco. Sin dependencias nuevas ni cambios de datos/permisos.

- Preferencia de navegación: mostrar solo el nombre de cada módulo junto a su icono, sin subtítulos explicativos (como «Tu panorama»). Aplicado al sidebar de escritorio y al menú móvil compartidos por demo/privado.

- Topbar minimalista del 12/11/2026: título de sección sin breadcrumb ni icono decorativo, indicador discreto Demo/Privado y acción «Nuevo movimiento» con botón circular de 44 px en móvil. Se retira la moneda redundante del encabezado; en privado, el avatar abre un popover nativo con contexto de cuenta, PEN y la acción original de cierre de sesión. Popover con cierre exterior/Escape y soporte nativo de foco; sidebar y reglas financieras conservados. Diseño compartido en demo/privado, sin nuevas dependencias. QA de demo y vista temporal ficticia del shell privado; pendiente comprobar cierre de sesión con una sesión autenticada.

- Ajuste solicitado el 12/11/2026: padding superior del contenido de escritorio reducido a 26 px (antes 42 px y 55 px en pantallas amplias). Se conservan los espaciados laterales y las reglas móviles.

- Cuentas rediseñadas el 12/11/2026: vista compartida para privado/demo con CSS Module, saldo total destacado y composición gráfica original con koala, tarjetas adaptables por cuenta y categorías agrupadas en ingresos/gastos. Formularios desplegables con campos compartidos, bloqueo al guardar y nombre conservado ante error; solo se limpia tras éxito. Acciones privadas y cálculos del servidor conservados. La demo permite crear cuentas/categorías en memoria y usarlas en Movimientos; sus saldos se derivan de los movimientos con la misma utilidad BigInt del servidor, reemplazando los importes estáticos anteriores. Las transferencias cambian saldos individuales sin modificar el total. Todo se restablece al recargar, sin almacenamiento del navegador. QA interactivo de demo y responsive completado; pendiente comprobar los nuevos formularios con sesión privada autorizada.

- Preferencia explícita del 12/11/2026 para Cuentas: menos texto y mayor intuición visual. Conservar el diseño, pero mostrar saldo total y tarjetas con solo icono, nombre e importe; eliminar subtítulos, frases motivadoras, notas repetidas y texto de la ilustración. Mantener etiquetas de acción breves, nombres accesibles completos y errores útiles. Aviso de demo resumido en una línea; formularios se muestran a petición.
