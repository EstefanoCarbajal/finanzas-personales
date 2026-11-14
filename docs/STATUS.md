# Estado al 13 de noviembre de 2026

## Texto de ordenación retirado · 14/11/2026

- Retirada la frase «Arrastra para ordenar · También puedes usar las flechas» y sus estilos exclusivos. El arrastre y las flechas siguen disponibles. Build y typecheck correctos; sin QA de navegador ni integración nueva.

## Nueva cuenta integrada en tarjetas · 14/11/2026

- La acción «Nueva cuenta» se presenta como tarjeta gráfica en la cuadrícula de cuentas; al abrirla muestra el formulario existente. Se mantiene disponible con la lista vacía y respeta temas y movimiento reducido mediante estilos.
- Build, typecheck y diff --check correctos. Sin QA de navegador, pruebas unitarias ni integración remota nuevas; pendientes comprobación visual y de interacción en móvil, teclado y temas, también en privado autenticado.

## Orden persistente de cuentas · 14/11/2026

- Guardado privado de la posición por usuario en cuentas mediante migración 007, Server Action autenticada y transacción con verificación de todas las cuentas. Nuevas cuentas quedan al final; se comunica el guardado o error y se revierte ante fallo. La demo conserva el orden entre secciones en memoria y se reinicia al recargar.
- Migración 007 aplicada a la base exclusiva de pruebas con TLS. Prueba de integración específica aprobada: persistencia, rechazo de cuenta ajena y limpieza de dos usuarios ficticios. Dos pruebas locales específicas, build y typecheck correctos; npm test 10/11 por fallo previo fox: deep/accent. Sin revisión nueva en navegador ni QA privado autenticado.

## Tarjetas de cuentas · 14/11/2026

- Rediseñada la lista compartida de cuentas con tarjetas de billetera, detalle de chip y efectos de elevación. Se puede ordenar arrastrando con ratón o tacto y mediante flechas con anuncio accesible. El orden es temporal mientras la sección está abierta; saldos, formularios y persistencia financiera no cambian.
- Build y typecheck correctos; pendiente QA de navegador para arrastre, teclado, movimiento reducido, temas y 320/390 px, así como sesión privada autenticada. Sin pruebas de integración remota ni publicación.

## Texto de confirmación simplificado · 14/11/2026

- Retiradas las tres frases solicitadas del diálogo de eliminación; la tarjeta conserva la descripción accesible del movimiento y se ajusta el espacio bajo el título.
- Validación nueva: build, typecheck y diff --check correctos; diff revisado. Sin QA de navegador, pruebas unitarias ni integración remota.


## Confirmación de eliminación de movimientos · 14/11/2026

- Rediseñado el diálogo privado con ilustración, tarjeta del movimiento, aviso de efecto en saldos y acciones diferenciadas. Entrada y detalles animados solo sin preferencia de movimiento reducido; estilos adaptados a los temas y a móvil. El diálogo tiene nombre y descripción accesibles, enfoca Conservar y bloquea Escape mientras se elimina.
- Validación nueva: build, typecheck y diff --check correctos; diff revisado. No se realizaron pruebas de navegador, QA privado autenticado, pruebas unitarias ni integración remota. Queda pendiente verificar visualmente los temas, móvil, teclado y estados de espera/error.


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

- Quitado «Ingresos y gastos no incluyen transferencias.» de la vista Resumen privada y eliminado su estilo exclusivo. La regla contable permanece en los cálculos y documentación del producto.
- Validación: build, typecheck y git diff --check correctos; diff revisado. Sin QA nuevo de navegador, pruebas unitarias, integración remota ni publicación.

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

- La vista privada de Movimientos ahora muestra acciones de editar y eliminar por fila: discretas al pasar el cursor, visibles al enfocarlas y siempre disponibles en dispositivos táctiles. La edición abre un diálogo compacto con los datos precargados; eliminar exige confirmación y muestra el impacto sobre el saldo.
- Añadidas `editMovement` y `removeMovement` como Server Actions. El repositorio valida propietario, cuentas, categorías, fechas e importes dentro de transacciones con bloqueo; los saldos, resumen y filtros se recalculan mediante `revalidatePath`.
- Los movimientos que respaldan aportes a metas quedan protegidos para evitar inconsistencias entre una transferencia y el progreso de la meta; se informa la razón al usuario. No se modifican migraciones ni se añaden dependencias.
- Validación nueva: `npm run typecheck`, `npm run build` y `git diff --check` correctos. `npm test` ejecutó 9 pruebas: 8 correctas y 1 fallida en `avatar-theme.test.mjs` por la aserción preexistente `fox: deep/accent`; no se ejecutó QA privado, integración remota ni revisión visual nueva.

## Rediseño de acceso con constelación de avatares · 13/11/2026

- Rediseñados `src/app/login/page.tsx` y `src/app/login/login-form.tsx`; añadido `src/app/login/login.module.css`.
- La pantalla deja el panel centrado anterior y pasa a una composición editorial: marca koala, titular de bienvenida, tarjeta privada con campos renovados, CTA principal, enlace a demo y seis avatares decorativos orbitando alrededor. La decoración no es interactiva ni transmite información.
- Se conservan las acciones de servidor, mensajes de autenticación, límite de configuración de base y enlace `/demo`. Se añadieron placeholders, jerarquía de labels, estados de foco, media queries para 390 px y movimiento reducido.
- Comprobaciones realizadas: `npm run typecheck`, `npm run build` y `git diff --check`. Build final correcto con permisos ampliados después de un `spawn EPERM` inicial del sandbox. `npm test` ejecutó 9 pruebas: 8 correctas y 1 fallida en `avatar-theme.test.mjs` por `fox: deep/accent`, una aserción de contraste asociada a los cambios locales de paleta previos, no al login. No se ejecutaron pruebas de integración ni QA privado; la inspección visual con navegador quedó pendiente por bloqueo del controlador de Windows al no poder determinar la URL de la ventana existente.

## Ajuste de colores profundos de zorro, oso y gato · 13/11/2026

- Actualizados los valores de `--theme-deep`: zorro `#995439`, oso `#7b6341` y gato `#4b416b`.
- Cambio limitado a la paleta visual; no afecta persistencia, reglas ni migraciones. Validación realizada: typecheck, build y diff --check.

## Ajuste del color profundo de la coneja · 13/11/2026

- Actualizado el valor de `--theme-deep` de la coneja a `#83546b`, aplicado desde `src/lib/avatar-themes.mjs`.
- No se modifican las demás variables de la paleta ni otros avatares. Validación realizada: typecheck, build y diff --check.

## Ajuste de mejillas de avatares · 13/11/2026

- El rubor SVG ahora se muestra únicamente en gato, conejo y oso; se eliminó visualmente de koala, zorro y tigre.
- Cambio acotado a `src/components/animal-avatar.tsx`; no afecta datos, temas ni persistencia. Validación realizada: typecheck, build y diff --check. El primer build fue bloqueado por `spawn EPERM` del sandbox y el segundo terminó correctamente con permisos ampliados.

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

## README y QA reconciliados · 13/11/2026

- Inspección de `scripts/check-access.mjs`: las aserciones de contenido aún buscan textos del resumen anterior. Se documenta en QA y AGENTS su actualización pendiente antes de reusarlo; sin cambios de código ni ejecución HTTP.
- README actualizado con funcionalidades construidas, diferencias privado/demo, rutas, arquitectura, seis migraciones y configuración/ejecución segura. Retiradas las afirmaciones de que cuentas/categorías no se crean y de que planificación/metas aún son futuras; recurrencia automática se mantiene como no implementada.
- QA conserva el escenario privado aprobado del 11/11 y resume la evidencia histórica de integración, módulos, demo y perfil. Añade cobertura actual (siete pruebas locales; ocho subpruebas de integración general más perfil), límites de esa evidencia, preparación/limpieza de fixtures y plan autenticado pendiente. No se declara una reejecución conjunta de integración tras añadir perfil.
- AGENTS y contexto sincronizados: completado el pendiente de actualizar README/QA. Permanecen QA privado de rediseños, zoom, Excel, Node 24/Hostinger, respaldo/restauración, recuperación de acceso y HTTPS/cookies de producción.
- Validación de esta continuación documental: revisión cruzada con scripts y estado, enlaces locales y `git diff --check`. No se repitieron npm test, build/typecheck, navegador, integración remota ni migraciones; el resultado local 7/7 sigue siendo el de la auditoría anterior del mismo día. Sin publicación. Cambio previo de `next-env.d.ts` conservado.

## Auditoría documental y guía de agentes · 13/11/2026

- `AGENTS.md` actualizado tras contrastar contexto/estado, README/QA, package.json, rutas, componentes compartidos, acciones privadas, lógica de dominio, configuración de conexión, seis migraciones, scripts y pruebas. Incluye arquitectura implementada, módulos privados frente a demo, reglas de seguridad/dinero, diseño aprobado y validaciones exigidas. El bloque administrado por Next.js se conserva íntegro.
- Estado vigente: seis módulos privados y perfil persistente, base exclusiva de pruebas en Hostinger, demo aislada en memoria; sin publicación ni autorización para datos financieros reales. Esta auditoría no vuelve a comprobar conectividad, esquema remoto ni permisos ejecutados en Hostinger; distingue esas verificaciones históricas de la inspección actual.
- Discrepancias documentales localizadas: README aún niega creación de cuentas/categorías y propone módulos persistentes ya construidos como próxima entrega; QA mantiene recuentos iniciales de pruebas. Se registra su actualización como pendiente, sin reescribir los resultados históricos. No existe recurrencia automática de pagos; planificación y metas de demo son ilustrativas.
- Validación nueva: `npm test` correcto, **7/7** pruebas locales. Entrega exclusivamente documental: no se ejecutaron build/typecheck, QA de navegador, integración remota ni migraciones. Revisión final con `git diff --check`. Se conserva el cambio previo de `next-env.d.ts`, ajeno a esta entrega. Trabajo sobre la rama de mejora existente `codex/resumen-premium`.
- Pendientes vigentes: QA privado ficticio de rediseños recientes (incluidos modal, perfil, estados de espera/error y logout), sidebar con zoom elevado, CSV en Excel, Node 24/Hostinger, respaldo/restauración, recuperación de acceso y HTTPS/cookies de producción. No convertir QA de demo o integración histórica en aprobación de producción.

Los apartados siguientes conservan la evidencia de cada entrega en su fecha; las limitaciones de las primeras versiones no describen necesariamente el estado actual.

## Perfil animado y temas por avatar · 13/11/2026

- Se completa el menú de perfil iniciado antes de la interrupción: seis avatares SVG originales, vista previa con entrada y parpadeo breve, opciones escalonadas, selección por teclado, Escape/cierre exterior y retorno de foco. Topbar con avatar ilustrado y botón de movimiento con detalle animado. Animaciones desactivadas con movimiento reducido. Menú disponible en demo y privado; acción original de cierre de sesión conservada.
- A petición del usuario, «Aplicar avatar y colores» cambia la paleta del sistema completo: koala/lima, zorro/durazno, gato/lavanda, panda/menta, conejo/rosa y oso/arena. La vista previa se limita al menú hasta confirmar. Tras éxito, colores y avatar se mantienen al navegar por las seis secciones y en el modal. Paletas centralizadas, sin nuevas dependencias; colores semánticos de transacciones/errores conservados.
- Persistencia privada mediante readAvatar/saveAvatar y acción autenticada que toma el propietario de la sesión, nunca del cliente. Migraciones 005_profile_avatar.sql y 006_avatar_validation.sql aplicadas exclusivamente a u519053982_finanzas_test. La segunda rechaza ENUM vacío incluso sin modo estricto. Se verificó que los checksums antiguos diferían solo por CRLF; se normalizaron a LF y se fijó esa convención en .gitattributes sin cambiar SQL previo ni checksums almacenados.
- QA en /demo a 1440 × 1000, 390 × 844 y 320 × 568: seis paletas aplicables, colores conservados al navegar, estados financieros diferenciados, cierre sin aplicar conserva estilo anterior, flechas cambian selección y Escape devuelve foco. Sin desbordamiento horizontal; menú desplazable en pantalla baja. Recarga restablece koala/verde. Modal de registro adopta el tema. Sin errores de consola.
- Build, typecheck y diff check correctos; siete pruebas locales aprobadas, incluyendo contraste de texto/controles de todas las paletas. Integración específica MySQL aprobada: dos usuarios ficticios con elecciones independientes, actualización y lectura persistente, rechazo de avatar inválido/propietario inexistente y limpieza por cascada. Fixtures eliminados. El script de integración general incluye ahora esta prueba adicional.
- Sin publicación ni uso de datos financieros reales. Pendiente QA con sesión privada autorizada para comprobar visualmente espera/error y cierre de sesión; persistencia y aislamiento ya comprobados por integración en la base de pruebas.

## Resumen con menos texto · 12/11/2026

- Se conserva la composición visual y se simplifica el contenido de demo/privado: «Tu resumen», «Saldo total», «Resumen mensual», «Gastos por categoría», «Últimos movimientos» y «Accesos rápidos». Se retiran sobre-títulos, frases motivadoras, texto decorativo del koala y notas redundantes. Demo identificada en una línea; saldo acumulado y fórmula del balance siguen explícitos.
- Métricas con nombre/importe, barras conservadas y flecha del balance adaptada al signo. Estados vacíos breves con botón para registrar; pie de actividad reducido al número de movimientos. Tarjeta de meta privada conserva nombre, importe y progreso, con menos texto.
- QA visual de demo a 1440, 390 y 320 px, sin desbordamiento horizontal. Octubre vacío y regreso a noviembre comprobados, saldo acumulado intacto; registro desde actividad vacía abre el modal. Build, typecheck y diff check correctos. Sin cambios de reglas monetarias ni permisos, sin publicación ni uso de datos privados.

## Registro desde Resumen en modal · 12/11/2026

- En codex/resumen-premium: el botón «Registrar movimiento» del Resumen privado deja de navegar a Movimientos. Modal compartido con la demo, CSS Module propio, importe grande, selector gasto/ingreso/transferencia, etiquetas breves, encabezado con koala y botón lima. Panel centrado en escritorio y situado abajo en móvil, con desplazamiento interior en pantallas de poca altura.
- Diálogo HTML nativo: aislamiento del fondo, bloqueo del desplazamiento, foco inicial en importe, cierre por Escape/botón/fondo y devolución del foco al disparador. Cierre bloqueado durante guardado privado. Al guardar se cierra, anuncia el resultado y actualiza el resumen con la revalidación existente. Errores conservan datos; cierre manual conserva borrador en memoria y éxito limpia descripción/importe manteniendo selecciones. Formularios de Movimientos conservan su presentación. Campos compartidos aceptan coma decimal convirtiéndola en punto.
- QA en /demo: gasto S/ 10,25 deja saldo S/ 3.952,75 y gastos S/ 247,25 sin cambiar de sección; transferencia S/ 25,50 conserva ambos importes, y transferencia a la misma cuenta muestra error conservando descripción/importe. Ingreso S/ 50 deja saldo S/ 4.002,75. Recarga restaura saldo inicial S/ 3.963,00. Escape devuelve foco y libera desplazamiento.
- Revisión visual a 1440 × 1000, 390 × 844 y 320 × 568: sin desbordamiento horizontal; en pantalla baja los controles siguen accesibles mediante scroll interior. Sin errores de consola. Build, typecheck, diff check y las cuatro pruebas existentes correctos; build/pruebas necesitaron permisos de ejecución por bloqueo de procesos del entorno restringido.
- No se publicó ni se accedió a datos privados. Pendiente QA del guardado, espera y errores del modal con una sesión privada autorizada. Sin cambios en acciones del servidor, esquema ni permisos.

## Cuentas con menos texto · 12/11/2026

- Simplificación solicitada sobre el rediseño: cabecera solo con título; bloque verde con «Saldo total» e importe; tarjetas compactas con icono, nombre y saldo. Se eliminan subtítulos, notas explicativas repetidas, monedas redundantes y frases en la ilustración. Categorías conserva iconos de ingreso/gasto, agrupación y chips.
- Acciones «Nueva cuenta» y «Nueva categoría» con símbolo +; formularios desplegables con etiqueta «Nombre», botón «Crear» y mensajes breves. Nombres accesibles completos conservados, junto con errores, controles de guardado y saldo inicial cero. Aviso de demo reducido a una línea, sin cambiar otras secciones.
- QA de demo: crear cuenta por Enter, error de duplicado, creación de categoría y apertura del desplegable por teclado correctos. Revisión visual de escritorio/móvil y comprobación a 320 px sin desbordamiento. Build, typecheck y diff check correctos. Sin cambios monetarios, de permisos ni de persistencia; sigue pendiente la revisión autenticada de los formularios privados.

## Rediseño de Cuentas · 12/11/2026

- En codex/resumen-premium: AccountsWorkspace compartido por privado y demo, con estilos encapsulados. Saldo total protagonista, tarjetas por cuenta con saldo acumulado, tratamiento de saldos negativos/cero, composición gráfica propia y listado de categorías separado por ingresos/gastos. Incluye estados sin cuentas o categorías.
- Formularios de cuenta y categoría desplegables con controles compartidos. En privado se conservan addAccount/addCategory y sus validaciones/permisos; nombres controlados se conservan ante errores y se limpian tras éxito. Campos bloqueados mientras se guarda. Sin cambios de esquema ni consultas.
- Demo: creación en memoria de cuentas (saldo cero) y categorías; disponibles también en los formularios de Movimientos y Resumen. Los saldos de Cuentas ahora usan totals, la utilidad exacta compartida con el servidor, y coinciden con los movimientos. Se eliminan los saldos ilustrativos fijos que antes no respondían a la actividad.
- QA de demo: duplicado «efectivo» con espacios muestra error y conserva texto; nueva cuenta aparece con saldo cero. Categoría de gasto creada y disponible en Movimientos; duplicado del mismo tipo rechazado y mismo nombre aceptado como ingreso. Transferir S/ 25,50 desde Efectivo a la nueva cuenta conserva el total S/ 3.963,00, con saldos S/ 3.937,50 y S/ 25,50. Gasto de S/ 30,75 desde esa cuenta deja S/ -5,25 y total S/ 3.932,25.
- Revisión responsive a 1440, 1024, 768, 390 y 320 px sin desbordamiento horizontal. Formularios a 320 px con controles de 16 px, categorías y nombres largos ajustados. Recarga devuelve las dos cuentas iniciales, siete categorías y total S/ 3.963,00, sin conservar pruebas.
- Build, typecheck, diff check y cuatro pruebas unitarias correctos. No se accedió a datos privados ni se publicó. Pendiente comprobar guardado, duplicados y estado de espera de los formularios con una sesión privada autorizada.

## Menos espacio bajo el topbar · 12/11/2026

- Padding superior del contenido de escritorio ajustado a 26 px, tanto en el tamaño base (antes 42 px) como desde 1500 px (antes 55 px). Laterales y reglas móviles conservados.
- Verificación: build, typecheck y diff check correctos.

## Topbar minimalista · 12/11/2026

- Trabajo en codex/resumen-premium. Encabezado compartido simplificado: título directo, mayor espacio libre, fondo translúcido y separador suave. Se eliminan breadcrumb, icono decorativo y moneda redundante. Acción «Nuevo movimiento» sin sombra de volumen, etiqueta Demo discreta y estado Privado en escritorio.
- En móvil, menú y acción principal con objetivos de 44 px; títulos largos se ajustan sin recortarse. Avatar privado abre popover HTML nativo con contexto de cuenta y el mismo formulario de cierre de sesión del servidor. No se modifican permisos, sesiones, cálculos ni persistencia de demo.
- QA visual de demo en escritorio 1440 px y móvil 390/320 px; título «Hábitos y recompensas» sin desbordamiento y acceso a Movimientos comprobado. Menú móvil se cierra al navegar y con Escape, devuelve foco al disparador y libera el desplazamiento del fondo.
- Menú de cuenta comprobado con una ruta temporal sin datos ni sesión privada, retirada al finalizar: 320 y 1024 px, opción de cierre visible, Tab llega al botón y Escape cierra devolviendo foco al avatar. No se ejecutó un cierre real; pendiente validarlo con sesión autenticada autorizada.
- Build, typecheck y diff check correctos. Sin dependencias nuevas, publicación ni acceso a datos privados.

## Navegación más limpia · 11/11/2026

- Se retiran los subtítulos debajo de los seis módulos del sidebar, por preferencia del usuario. Se eliminan también sus propiedades y estilos sin uso; nombres e iconos conservados en escritorio/móvil y demo/privado.
- Verificación: build, typecheck y diff check correctos.

## Sidebar y topbar renovados · 11/11/2026

- En la rama de mejora codex/resumen-premium, componente DashboardShell común a privado y demo. Sidebar verde profundo, marca koala, iconos SVG, navegación en dos grupos, estado activo lima, acceso a metas y perfil. Estilos encapsulados y microinteracciones con respeto a movimiento reducido.
- Topbar fijo con fondo translúcido, sección actual, PEN, modo demo/privado y acceso a registrar movimientos. Cierre de sesión mantiene la acción original del servidor.
- Móvil hasta 900 px: panel modal nativo con fondo desenfocado, cierre al navegar/Escape/botón, bloqueo de desplazamiento, aislamiento del fondo y devolución de foco. En escritorio bajo, tarjeta compacta y sidebar desplazable sin recortar bloques.
- QA en /demo: navegación por las seis secciones en escritorio 1280 px; menú móvil a 390 px, selección/cierre, Escape y retorno de foco comprobados. A 320 px, encabezado y página sin desbordamiento horizontal. Build, typecheck y diff check correctos. No se probaron sesiones privadas; pendiente QA visual con sesión autorizada. Sin publicación, cambios monetarios ni acceso a datos privados.

## Movimientos: formulario protagonista e historial debajo · 11/11/2026

- Ajuste solicitado por el usuario sobre codex/resumen-premium: se retira el resumen de saldo/ingresos/gastos de Movimientos. La zona verde contiene «Anota tu movimiento» y todo el formulario; «La historia de tus movimientos» aparece debajo, fuera de la zona verde y al mismo ancho.
- Campos en dos columnas en escritorio y una en móvil, con controles claros sobre el fondo verde, botón lima y koala. Se conserva la tipografía amigable, búsqueda, filtros, CSV y balance de la selección en el historial. Se eliminan propiedades y estilos del resumen anterior.
- QA de demo a 1280 y 390 px: formulario e historial al mismo ancho y orden vertical confirmado; móvil sin desbordamiento. Registrar gasto ficticio S/ 10,25 y buscarlo devuelve una fila y balance de selección -S/ 10,25. No se cambiaron acciones privadas, reglas monetarias ni persistencia.
- Build y typecheck correctos; build repetido con permisos autorizados tras restricción al generar archivos. Sin publicación ni datos privados. Se mantiene pendiente la revisión privada con sesión autorizada.
## Rediseño de Movimientos · 11/11/2026

- En codex/resumen-premium, vista compartida por privado y demo: bloque protagonista de saldo acumulado, ingresos/gastos y koala; formulario con selección visual de tipo, importe destacado, cuentas/categoría y fecha; historial agrupado por día con iconos, origen/destino, tipo y signo monetario. CSS Module aislado y tipografía Nunito.
- Filtros combinables por texto, mes y tipo con limpieza rápida, estados vacíos, cantidad de resultados y balance de la selección calculado con BigInt excluyendo transferencias. Exportación CSV mantiene protección contra fórmulas, BOM, separador punto y coma y filtros aplicados.
- Campos compartidos con formulario privado: se conservan acciones, request_id, bloqueo al guardar y preservación de valores ante errores. Tras éxito solo se limpian descripción e importe. No se modificaron reglas del servidor, permisos ni MySQL.
- Demo ahora permite ingresos, gastos y transferencias entre cuentas ficticias, sin persistencia. Formulario del resumen reutiliza los mismos campos. Transferencias excluidas también del resumen y acumulados de demo.
- QA: gasto S/ 10,25 dejó saldo S/ 3.952,75 y gastos S/ 247,25. Transferencia S/ 25,50 a la misma cuenta mostró error conservando descripción/importe; al elegir Ahorros se registró sin alterar esos totales. Filtro texto + noviembre + transferencias devolvió una fila y balance S/ 0,00. CSV descargado inspeccionado: solo esa transferencia, con origen Efectivo, destino Ahorros, fecha e importe correctos. Búsqueda sin resultados, limpieza y bloqueo de exportación vacía comprobados.
- Revisión visual en escritorio (~1280 px) y móvil 390 px; comprobación adicional a 320 y 768 px, sin desbordamiento de página. Build y typecheck finales correctos; 4 pruebas unitarias aprobadas. No se accedió a datos privados ni se publicó. Pendiente comprobar guardado/errores privados con sesión autorizada y apertura del CSV en Excel.
## Tipografía más cercana · 11/11/2026

- En codex/resumen-premium se incorpora Nunito variable para textos, controles, navegación e importes. Archivo local desde el repositorio oficial google/fonts, licencia OFL incluida en src/app/fonts; carga mediante next/font/local con swap y fallback. La aplicación sirve la fuente sin consultar Google en cada visita ni durante builds posteriores.
- Los encabezados h1–h6 conservan su familia anterior y sus estilos específicos. Ajustes globales en typography.css y ajustes encapsulados para resumen/hábitos: textos auxiliares más legibles, interlineado más amplio, espaciado más natural y campos de 16 px en móvil. Se mantienen cifras tabulares para lectura de importes.
- Build, typecheck y diff check correctos. QA en navegador confirmó Nunito en body/campos y Arial en encabezados; revisión visual de resumen en escritorio y hábitos en móvil. Las seis secciones de demo a 390 px no desbordan horizontalmente (tabla conserva scroll propio). Campo de creación de hábito confirmado a 16 px.
- No se modificaron reglas monetarias, permisos ni acciones privadas. Pendiente revisión visual con sesión privada autorizada.
## Rediseño de Hábitos y recompensas · 11/11/2026

- Continúa en codex/resumen-premium. Vista compartida entre privado y demo, con CSS Module propio: bienvenida con koala, tarjeta de puntos, calendario de siete días, hábitos con SVG originales, progreso circular, días con actividad y catálogo de recompensas con avance hacia el costo.
- Formularios desplegables para crear hábitos y premios; estados de guardado, errores, saldo insuficiente y canje semanal utilizado. Se conservan las acciones privadas y todas las validaciones del servidor, sin cambios en MySQL ni permisos. El progreso usa hábitos activos; no se inventan rachas.
- La demo ahora permite registrar hábitos por día, crear hábitos/recompensas y simular un canje semanal. Datos ilustrativos del 11/11/2026, solo en memoria; se reinician al salir de la sección o recargar. No usa acciones privadas ni almacenamiento del navegador.
- QA en demo: completar los cinco hábitos pasó de 80 a 110 puntos y de 40% a 100%; canjear un premio de 60 dejó 50 puntos y bloqueó los otros canjes. Crear un sexto hábito recalculó progreso a 83%; crear premio de 40 conservó bloqueo semanal aun con saldo suficiente. Selector de día anterior mostró 0/6 hábitos. Revisado en escritorio y móvil 390 × 844 sin desbordamiento horizontal.
- Build y typecheck correctos; 4 pruebas unitarias existentes aprobadas. Build repetido con permisos autorizados tras restricción al generar archivos. Sin publicación ni uso de datos privados. Pendiente revisar los formularios y acciones con sesión privada autorizada; esta entrega no cambió reglas del servidor ni ejecutó integración remota.
## Rediseño integral del resumen · 11/11/2026

- Rama de mejora: codex/resumen-premium. Resumen compartido por panel privado y demo; estilos encapsulados en CSS Module.
- Nuevo bloque protagonista verde profundo con saldo acumulado, koala original, detalles orbitales y acción para registrar movimientos. Tarjetas mensuales de ingresos/gastos/balance, selector de mes, gráfico circular por categorías y actividad reciente. El saldo total permanece acumulado al cambiar de mes; el resto corresponde al mes seleccionado.
- Distribución completa de gastos: si hay más de seis categorías, agrupa las menores en «Otras categorías». Importes y porcentajes calculados desde céntimos BigInt; transferencias excluidas de ingresos, gastos y categorías, pero visibles en actividad.
- Estados vacíos, balance negativo y ausencia de ingresos contemplados. Adaptación móvil, foco visible y animaciones que respetan movimiento reducido. Sin dependencias ni servicios nuevos.
- Verificado en navegador con demo: escritorio y 390 × 844, sin desbordamiento horizontal; octubre vacío y regreso a noviembre con avance futuro bloqueado. Registrar gasto ficticio S/ 10,25 actualizó saldo a S/ 3.952,75, gastos a S/ 247,25 y gráfico; recarga restauró datos iniciales.
- Build, typecheck y 4 pruebas unitarias aprobados. Primera compilación limitada por permisos de generación; repetición con permisos autorizados correcta. No se publicaron cambios ni se accedió a datos privados para este QA. Pendiente revisión visual del resumen privado con sesión autorizada.
## Sidebar con zoom

- El sidebar privado ahora permite desplazamiento vertical propio cuando el zoom o la altura de ventana impiden mostrar toda la navegación, el mensaje lateral y el perfil a la vez. Sus secciones conservan su tamaño y acceso.
- Pendiente comprobar visualmente con zoom elevado en escritorio y con navegación móvil.

## Resumen más visual

- El balance mensual del panel privado ahora tiene mayor jerarquía visual y un mensaje amable que se adapta al resultado; los ingresos y gastos incluyen barras comparativas, manteniendo los cálculos exactos y excluyendo transferencias.
- En meses sin actividad se muestra una guía clara. Diseño adaptable a móvil.
- `npm run typecheck` y `npm run build` correctos.

## Icono de marca

- Se reemplazó el monograma «f.» por un koala minimalista original en SVG, con fondo lima y trazos verde oscuro. Se usa en demo, panel privado y favicon.
- Build y typecheck pendientes de ejecutar para esta entrega.

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
