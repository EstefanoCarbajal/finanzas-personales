# Contexto y decisiones

## Exportación nativa a Excel · 16/11/2026

- Movimientos sustituye CSV por un archivo .xlsx real en privado/demo, con los filtros actuales, cabecera fija, autofiltro, ancho de columnas e importes numéricos con dos decimales. Textos almacenados como cadenas, sin fórmulas; fecha civil conservada como texto y columna Moneda separada. ExcelJS 4.4.0 añadido al lockfile y cargado al exportar; generación local en memoria, sin envío de datos a terceros. Botón bloqueado durante generación y error recuperable.
- Build, typecheck y prueba de ida/vuelta XLSX aprobados: acentos, prefijos de fórmula como texto, moneda, pago de tarjeta, céntimos y máximo DECIMAL(13,2). Diff revisado y git diff --check ejecutado. No se reejecutó suite general ni integración; descarga en navegador y apertura en Microsoft Excel pendientes. Esta exportación reemplaza los requisitos históricos de BOM/separador CSV.


## Últimos movimientos sin contador mensual · 16/11/2026

- Retirado el pie «N movimientos en el mes» del Resumen compartido entre privado y demo, por petición del usuario. Conservados listado, filtros mensuales y acceso Ver todos.
- Build y typecheck correctos; diff revisado y git diff --check ejecutado. Cambio visual sin nuevas pruebas de navegador ni integración.


## Restauración de carrera sencilla · 16/11/2026

- Por petición del usuario se revierte exclusivamente la última animación articulada: retirados brazos, rodillas, pies y sombra animada. Restaurada la carrera continua sencilla del cuerpo/piernas, conservando posición según ahorro y movimiento reducido. La entrada anterior de carrera articulada queda como historial, no estado actual.
- Build y typecheck correctos; cambios revisados y git diff --check ejecutado. Sin QA nuevo de navegador ni cambios de datos.


## Carrera articulada del avatar · 16/11/2026

- Avatar del Resumen con brazos y antebrazos, piernas con flexión de rodilla y pies. Ciclo continuo de 680 ms con extremidades alternadas y brazos en contrafase, rebote leve del cuerpo y sombra sincronizada. Posición horizontal conservada según porcentaje ahorrado; movimiento reducido desactiva animaciones.
- Build y typecheck finales correctos; diff revisado y git diff --check ejecutado. Sin cambios monetarios ni persistencia. No se realizó QA visual de navegador; pendiente valorar movimiento en móvil, escritorio y distintos avatares.


## Carrera continua del avatar del Resumen · 16/11/2026

- Cuerpo y piernas corren en bucle en el lugar correspondiente al porcentaje ahorrado, también al completar la meta. Retirado el desplazamiento inicial desde cero y la animación finita que lo dejaba quieto. La posición horizontal continúa derivada del ahorro; movimiento reducido desactiva las animaciones.
- Cambio exclusivo de CSS, sin modificar datos ni cálculos. Build y typecheck correctos; diff revisado y git diff --check ejecutado. No se realizó QA de navegador en esta entrega.


## Retirada del resumen de crédito · 16/11/2026

- Eliminado CreditSnapshot (Deuda en tarjetas / Saldo menos deuda) del Resumen privado y demo, junto con su componente y estilos exclusivos, por petición del usuario. No cambia el cálculo de saldos ni la billetera.
- Build y typecheck aprobados; diff revisado y comprobación de espacios ejecutada. Sin QA de navegador ni pruebas de integración nuevas para esta retirada visual.


## Meta del Resumen con avatar corredor · 16/11/2026

- Nueva tarjeta compartida SummaryGoal en Resumen privado/demo: avatar seleccionado con piernas animadas, pista de progreso y bandera. Avanza hasta el porcentaje de ahorro real, limitado visualmente al 100%; conserva importes exactos BigInt y muestra celebración al completar. Animación breve finita y desactivada con movimiento reducido. Temas existentes, CSS adaptable y enlace al módulo de metas.
- Estado sin meta invita a crear la primera; demo muestra el ejemplo de S/ 480 de S/ 1200 (40%) y navega a Metas y ahorro. No cambia persistencia, aportes ni reglas de negocio; sin dependencias nuevas.
- Validación nueva: build y typecheck aprobados. Diff revisado y comprobación de espacios ejecutada. No se realizó QA de navegador ni integración en esta entrega; quedan pendientes revisión visual móvil/oscuro, animación y estados 0/100% con fixture. Se conservan cambios locales anteriores; sin publicación ni datos reales.


## Planificación visual y agenda de pagos · 16/11/2026

- Planificación comparte ahora PlanningWorkspace entre privado y demo: cabecera compacta, calendario con avatar aplicado, próximo compromiso y contadores, resumen circular y tarjetas de presupuesto con iconos de categorías, agenda ordenada y filtros Todos/Próximos 7 días/Vencidos. Las cifras derivadas usan céntimos BigInt; fechas civiles recibidas del servidor, sin depender de la zona horaria del navegador. No se modificaron reglas ni consultas de persistencia.
- Formularios desplegables compartidos, normalización de coma decimal, borradores controlados conservados al fallar/cerrar, controles bloqueados durante envío y cierre/foco al guardar. Confirmar/cancelar un pago exige un segundo paso dentro de su tarjeta; explica el efecto antes de ejecutar, bloquea reenvíos de la interfaz y anuncia resultados. Las acciones existentes devuelven errores controlados conservando autenticación y revalidación.
- CSS Module adaptable a temas/oscuro y móvil; animaciones breves de entrada, calendario/avatar y barras, elevación al pasar el puntero y movimiento reducido. Sin nuevas dependencias, recursos externos ni migraciones. Demo conserva ejemplos de noviembre de 2026: filtros y despliegues interactivos; formularios en vista previa sin guardar ni invocar acciones privadas.
- Validación nueva: build y typecheck finales correctos; Diff de la entrega revisado y git diff --check correcto. suite local 23/26, con fallo histórico fox: deep/accent y dos aserciones de crédito que no contemplan byCurrency/bank_code (código/pruebas de crédito no modificados en esta entrega). QA demo: navegación, filtros (2 todos / 1 próximo / 0 vencidos), estado vacío, formularios desplegables, tema tigre y revisión móvil 320/390 px sin desbordamiento medido; sin errores de consola capturados. No se ejecutó integración ni QA privado de guardado/confirmación/error/espera. Sigue pendiente ese escenario con fixture ficticio, teclado completo, movimiento reducido y otras paletas. El módulo conserva el alcance monetario PEN de la planificación anterior; su adaptación integral a cuentas USD continúa pendiente. Sin publicación ni datos reales.

## Espaciado de grupos bancarios · 16/11/2026

- Los encabezados de banco mantienen una separación mayor respecto de sus tarjetas para evitar que el nombre y la primera cuenta se perciban juntos.

## Diseño unificado de tarjetas · 16/11/2026

- El frente de las tarjetas de crédito comparte el lenguaje visual de las cuentas: degradado oscuro, chip dorado, formas decorativas, bordes redondeados y sombras. La sección inferior conserva los datos específicos de deuda, línea y pagos.

## Acceso al alta de categorías · 16/11/2026

- La cabecera de Categorías usa el botón «Nueva categoría» en lugar de los iconos decorativos. Abre el mismo menú/formulario existente por encima de los grupos Gastos e Ingresos.
- El botón permanece en la esquina superior derecha, mientras que el panel abierto ocupa la fila inferior completa, antes de Gastos.

## Saldo inicial al crear cuentas · 16/11/2026

- El alta de una cuenta permite indicar un saldo inicial opcional en la moneda elegida. Se persiste en `accounts.opening_balance` y se incorpora al saldo acumulado sin crear un ingreso, movimiento ni gasto.
- La migración `012_account_opening_balance.sql` deja el valor en cero para cuentas existentes; la validación conserva importes DECIMAL exactos y la demo replica el comportamiento en memoria.

## Filtro de moneda en la billetera · 16/11/2026

- El control PEN/USD de «Tu billetera» es interactivo. Filtra cuentas y tarjetas por `currency`, actualiza los totales de la moneda elegida y muestra importes USD con `$`; Configuración conserva la vista completa de tarjetas.

## Etiquetas compactas en billetera · 16/11/2026

- Las tarjetas visuales de cuentas y crédito muestran directamente el importe, sin las etiquetas «Saldo disponible», «Crédito disponible» ni «CRÉDITO · PEN». El resumen de la billetera usa «Crédito» como etiqueta breve.
- El botón de edición de cuentas y tarjetas permanece en la esquina superior derecha de cada tarjeta.

## Edición del banco de una cuenta · 16/11/2026

- El diálogo de edición de cuentas muestra ahora el selector de banco agrupado del mismo catálogo usado en el alta. Permite cambiar nombre y banco en una sola operación, conserva errores y bloquea ambos campos mientras guarda.
- La demo conecta también el banco al alta y a la edición en memoria, por lo que las cuentas se mantienen en el grupo bancario elegido. El servidor ya recibía y persistía `bank_code`; no se añadió migración ni dependencia.

## Agrupación visual por banco · 16/11/2026

- La billetera separa las cuentas por banco en bloques con encabezado propio; las cuentas sin banco histórico se muestran en «Otro banco». Las tarjetas conservan el banco asociado para futuras agrupaciones y lo muestran en su identidad visual.

## Banco asociado a cuentas y tarjetas · 16/11/2026

- El alta de cuentas incluye banco obligatorio con catálogo cerrado de diez entidades: BCP, BBVA, Interbank, Scotiabank, BanBif, Banco Pichincha, Banco Falabella, Banco Ripley, Caja Arequipa y Mibanco. El selector usa grupos visuales para reducir ruido.
- Las tarjetas guardan el mismo código de banco; no se almacenan números completos, CVV ni credenciales. La migración 011 deja registros antiguos compatibles.

## Monedas por cuenta · 16/11/2026

- Las cuentas y tarjetas pueden ser PEN o USD; las cuentas existentes conservan PEN. El alta muestra un selector breve y la billetera identifica ambas monedas sin convertir ni sumar saldos de monedas distintas.
- Cada movimiento hereda la moneda de su cuenta de origen. El servidor rechaza transferencias entre monedas distintas, persiste la moneda y mantiene cálculos exactos en céntimos; el tipo de cambio queda fuera de alcance.
- Migración 010 añade `currency` a cuentas y movimientos con valores cerrados PEN/USD. Build y typecheck correctos; no se publicaron datos reales. Pendiente QA privado y prueba de migración en la base de pruebas autorizada.

## Editar y eliminar tarjetas de crédito · 16/11/2026

- Cada tarjeta incorpora el mismo botón discreto de lápiz que las cuentas, con Editar tarjeta/Eliminar tarjeta. Disponible en la billetera y Configuración, en privado y demo. Editor de nombre, línea de crédito y últimos cuatro dígitos opcionales; deuda inicial e historial no se editan. Mantiene las paletas, diálogos nativos, foco inicial/restaurado, Escape/exterior y bloqueo durante envío. Al borrar enfoca otra tarjeta o Nueva tarjeta si no quedan.
- Nuevas acciones autenticadas de edición/borrado y utilidades credit.mjs con parámetros y propietario de requireUser. Ambas bloquean la fila del usuario y la tarjeta, como las operaciones de movimientos. Editar conserva apertura, valida línea contra deuda inicial y libro actual y revierte ante duplicado/límite incompatible. No modifica movimientos ni sus importes; los nombres leídos del historial reflejan el cambio. Solo se elimina una tarjeta credit propia sin deuda inicial ni referencias: claves foráneas bloquean historial incluso a deuda cero; sin cascada ni desvinculación. La demo replica restricciones en memoria.
- Se reutilizan los estilos de opciones de cuentas y se bloquean acciones/alta/pagos entre sí durante mutaciones; borradores y errores se conservan. Sin migraciones ni dependencias nuevas. Sigue sin haber cálculo de intereses/cuotas, devoluciones ni ejecución bancaria de pagos.
- Validación nueva: build/typecheck correctos, diff revisado y diff --check correcto. npm test 25/26: nueva prueba de identificadores de edición/borrado aprobada y persiste fallo histórico fox: deep/accent. Integración específica de crédito ampliada y aprobada con dos usuarios ficticios en base exclusiva y TLS, limpieza comprobada: edición/no-op, propietario/tipo, duplicados, límites, últimos dígitos, deuda inicial inmutable ante campo falsificado, historial monetario intacto, borrado vacío, rechazo por apertura/historial a deuda cero y carrera entre reducción de línea y compra. No se reejecutó toda la integración general.
- QA nuevo demo: duplicado Efectivo conserva formulario con error; Visa personal→Visa Oro, línea 6000,50→6000.50 y dígitos 4321 actualizan tarjeta/total disponible sin tocar efectivo. Conservar cancela, foco vuelve al lápiz; eliminar la tarjeta vacía cierra diálogo y enfoca Nueva tarjeta con disponible cero. Recarga restaura ejemplos. Editor claro de escritorio, eliminación clara a 320 px y editor oscuro a 390 px inspeccionados; medidas de ambos móviles sin desbordamiento, Escape devuelve foco y consola sin errores capturados. Viewport restaurado. Pendientes QA privado de navegador, errores reales/espera, eliminación usada en demo, resto de paletas, cierre exterior y teclado/movimiento reducido exhaustivos. Sin publicación ni datos financieros reales.


## Billetera unificada · 15/11/2026

- Cuentas reúne cuentas y tarjetas dentro de una única sección Tu billetera, con grupos identificados como Cuentas/Tu dinero y Tarjetas de crédito/Tu línea. Categorías queda después de toda la billetera. Se retira la cabecera repetida de Cuentas y el hero ilustrado anterior; cabecera compacta con moneda y tres cifras: dinero en cuentas, deuda y crédito disponible (suma exacta BigInt de disponibles de tarjetas, sin sumarlo al dinero propio).
- Composición compartida entre privado y demo mediante creditSection en AccountsWorkspace/AccountsDemo. Se conservan ordenación/acciones de cuentas, alta de tarjetas y registro de pagos. La vista independiente de tarjetas en Configuración recibe también cabecera/espaciados simplificados. Sin cambios de reglas, consultas, acciones, migraciones ni dependencias.
- CSS Module wallet con panel continuo, divisores, cuadrículas adaptables y temas existentes. Menos texto decorativo en altas/cabecera/pie de tarjetas; se conservan las aclaraciones de formularios. Encabezados jerárquicos: Tu billetera (h1), grupos (h2), nombres (h3).
- Validación nueva: build y typecheck correctos; diff revisado y diff --check correcto. QA demo: sección única con los dos grupos antes de Categorías, cuadrícula de cuentas en escritorio, ArrowRight reordena Efectivo conservando crédito/saldos, formulario Nueva tarjeta desplegable y escritura en móvil. Claro a 320/390 px y escritorio; oscuro inspeccionado en escritorio. Medidas móviles sin desbordamiento horizontal, sin errores de consola capturados; viewport restaurado. No se repitieron pruebas unitarias ni integración porque esta entrega modifica composición y estilos. Pendientes QA privado, guardar formularios/espera/error tras esta reorganización, oscuro móvil, arrastre táctil, teclado completo, movimiento reducido y restantes paletas. Sin publicación ni datos reales.


## Tarjetas de crédito integradas · 15/11/2026

- Se amplía el alcance autorizado: tarjetas personales con línea de crédito en PEN, nombre, deuda inicial opcional y últimos cuatro dígitos opcionales. No se guardan PAN/CVV, no se vinculan bancos ni se ejecutan pagos reales. Intereses, cuotas, ciclos de facturación, devoluciones, adelantos, edición/eliminación de tarjetas y cambios de línea quedan fuera de esta entrega.
- Modelo: accounts distingue asset/credit; migración nueva 009 añade tipo, límite, deuda inicial y last_four con restricciones. Cuentas existentes siguen como asset sin reinterpretar su historial. Migración aplicada exclusivamente a u519053982_finanzas_test tras comprobar nombre/TLS, mediante ejecutor de checksum/bloqueo y finales LF. No se editaron migraciones aplicadas.
- Compra: movimiento expense con tarjeta de origen y categoría de gasto; aumenta gasto/deuda sin reducir dinero en cuentas. Pago: una sola transferencia desde cuenta propia a tarjeta propia; reduce dinero y deuda sin generar otro gasto ni ingreso. Se admiten pagos parciales. Ingresos a tarjeta y transferencias desde tarjeta se rechazan. Línea disponible = límite menos deuda. Deuda inicial no genera gasto del mes. No se admiten sobrepagos ni exceder la línea.
- Resumen/Cuentas muestran Saldo en cuentas (solo activos); Resumen añade deuda y saldo menos deuda. Métricas/presupuestos incluyen compras con crédito; transferencias/pagos quedan fuera de gastos. Historial/CSV identifican Pago de tarjeta, y lecturas conservan category_id para editar. Conservar totals(movements) sigue siendo compatible; al proporcionar catálogo devuelve además debt/net y calcula balance de activos. Reglas privadas siguen con céntimos BigInt.
- Guardar/editar/eliminar movimientos autentica propietario, usa parámetros, conserva request_id y valida referencias; bloqueo de fila del usuario serializa cambios, seguido de lecturas bloqueantes del libro y rollback si el resultado rompe línea/deuda. También se comprueban edición/eliminación de compras o pagos existentes. Metas/aportes y pagos programados de esta entrega admiten solo cuentas asset; consultas de servidor lo exigen. La ordenación de cuentas excluye tarjetas; las acciones antiguas de editar/eliminar cuenta tampoco aceptan tarjetas.
- UI compartida de tarjetas en Configuración y Cuentas: crédito disponible protagonista, deuda/línea y barra, alta desplegable y formulario de pago. Selector de gasto permite cuenta o tarjeta; ingresos/origen de transferencias solo cuentas, destino puede ser tarjeta. Formularios conservan errores, bloquean campos durante guardado y normalizan coma decimal. Demo simula todo en memoria con Visa personal de S/ 5000 y deuda cero; recargar restaura ejemplos. Sin dependencias ni almacenamiento de navegador nuevos.
- Validación nueva: build y typecheck correctos; suite local 24/25 (tres pruebas nuevas de crédito aprobadas; persiste fallo histórico fox: deep/accent). Integración completa con ocho archivos y 16 comprobaciones aprobadas, incluida prueba de crédito con dos usuarios ficticios y limpieza: precisión, compras/pagos, idempotencia, sobrepago/sobrelímite, referencias ajenas, edición/eliminación con rollback, exclusión de tarjetas en metas/pagos futuros, restricciones SQL y dos compras concurrentes sin exceder línea. La integración específica de crédito se repitió tras reforzar el rechazo de borrado de tarjetas sin movimientos por las acciones antiguas de cuentas y pasó con limpieza. Primera integración general detectó aserción antigua sin debt/net; actualizada y repetición completa aprobada.
- QA nuevo en demo: compra S/ 120.50 conserva efectivo S/ 3963 y aumenta deuda; sobrepago S/ 130 rechazado conservando campo; pago S/ 50.25 deja efectivo S/ 3912.75, deuda S/ 70.25, gastos S/ 357.50 y saldo menos deuda S/ 3842.50. Alta de tarjeta con línea S/ 2000/deuda S/ 100/4321 muestra S/ 1900 disponibles; alta adicional y cierre del editor tras éxito comprobados. Conservación al navegar a Configuración/Resumen, claro/oscuro, móvil 320/390 px sin desbordamiento medido y sin errores de consola capturados. Viewport restaurado y recarga devuelve saldo/gastos/deuda iniciales. No se realizó QA privado de navegador: pendiente alta/compra/pago/error/espera con fixture, teclado exhaustivo, movimiento reducido, otras paletas y CSV en Excel. Sin publicación ni datos financieros reales.


## Edición y eliminación de categorías · 15/11/2026

- Editor desde cada tarjeta para nombre, tipo e icono; errores conservan datos, controles bloqueados al guardar y foco restaurado. Eliminar abre diálogo nativo con foco inicial en Conservar categoría, cierre por Escape/exterior y bloqueo durante envío. Tras borrar, foco a otra tarjeta o creación.
- Acciones autenticadas y consultas parametrizadas por propietario. Categorías usadas admiten nombre/icono; cambiar tipo exige ausencia de movimientos, presupuestos y pagos. Borrado protegido atómicamente por claves foráneas existentes, sin cascada. Edición transaccional bloquea categoría; guardar presupuesto también bloquea su validación para evitar carreras con cambio de tipo. Sin migraciones nuevas.
- Demo vincula movimientos y presupuestos ilustrativos por IDs estables: renombrar actualiza nombres sin alterar importes. Cambios solo en memoria; recargar restaura ejemplos.
- Validación nueva: build/typecheck correctos; npm test 21/22, incluidas tres pruebas nuevas aprobadas, con fallo histórico `fox: deep/accent`. Integración específica y general ejecutadas juntas: 10/10 aprobadas en base exclusiva autorizada con TLS y usuarios ficticios limpiados; aislamiento, duplicados, referencias, concurrencia con presupuestos y regresión financiera. Un marcador SQL adicional introducido en esta adaptación se corrigió antes de repetir ambas integraciones con éxito. Otros archivos de integración no se reejecutaron.
- QA demo: duplicado conserva entrada; cambio de tipo usado y eliminación usada rechazados; Alimentación→Comida actualiza historial conservando importes y saldo S/ 3,963.00. Vivienda→Alquiler cambia nombre/tipo/icono y se elimina tras confirmar, con foco a otra tarjeta. Conservar/Escape cierran diálogo y recarga restaura ejemplos. Editor claro en escritorio/320 px y oscuro en 390 px; confirmación clara en 320 px. Sin desbordamiento medido a ambos anchos ni errores de consola capturados; viewport restaurado. Pendientes QA privado de interfaz, espera/error reales, otras paletas y teclado exhaustivo. Sin publicación ni datos reales.

## Configuración personal · 15/11/2026

- Nueva sección compartida Configuración en privado y demo, accesible desde sidebar y menú de perfil. Cabecera con avatar aplicado, tarjetas de acceso/seguridad, formularios desplegables y bloque visual de futuros métodos de pago/tarjetas marcado como no disponible. Moneda, idioma y zona horaria son informativos. CSS Module con temas, modo oscuro, responsive, foco y movimiento reducido; sin dependencias ni recursos externos nuevos.
- Cambio real de correo/contraseña en privado mediante Server Action autenticada. Requiere contraseña actual; valida correo normalizado, clave de 12–128 caracteres y confirmación. Limita a ocho intentos por usuario en ventana persistente de 15 minutos, comprueba sesión vigente dentro de transacción, bloquea usuario, conserva errores y revoca todas sus sesiones al guardar. Cookie eliminada y acceso posterior por login. El correo cambia inmediatamente, sin servicio de verificación por email; la interfaz lo explica antes de guardar. No implementa recuperación de acceso.
- Demo permite desplegar formularios, con campos/guardado deshabilitados y aviso de vista previa; no recibe credenciales ni llama acciones privadas. Métodos de pago/tarjetas son exclusivamente un espacio futuro, sin altas, cobros ni almacenamiento de tarjetas. Se preservaron los cambios locales anteriores de cuentas/categorías/metas.
- Validación nueva: build y typecheck correctos; dos pruebas locales de configuración aprobadas. Suite local 18/19: persiste el fallo histórico de contraste fox: deep/accent. Integración específica de configuración aprobada en u519053982_finanzas_test con TLS, dos usuarios ficticios y limpieza comprobada: contraseña incorrecta, sesión de otro usuario, correo duplicado con rollback, cambio de correo/clave, revocación de sesiones, rechazo de sesión revocada, aislamiento y límite persistente. Integración añadida al comando general; no se reejecutó toda la integración. El primer intento se detuvo antes de conectar por TEST_DB_NAME ausente; reejecución con destino explícito aprobada.
- QA nuevo de demo: navegación al módulo, apertura/cierre del formulario de clave, enlace desde perfil y aplicación de tigre oscuro; inspección clara/oscura en escritorio y móvil 320/390 px, sin desbordamiento horizontal medido a ambos anchos ni errores de consola capturados. Corregido conflicto global del color del h1. Viewport restaurado. Pendientes QA privado de navegador para guardado/error/espera y vuelta al login, teclado completo, movimiento reducido y restantes paletas. Sin publicación, migraciones ni datos financieros reales.


## Editar y eliminar cuentas · 15/11/2026

- Cada tarjeta incorpora un botón discreto de lápiz con opciones «Editar nombre» y «Eliminar cuenta», independiente del arrastre. Diálogos nativos con foco inicial, Escape/cierre exterior, bloqueo durante envío, errores conservando datos y confirmación de eliminación enfocada primero en «Conservar cuenta». Tras eliminar, foco a otra tarjeta o creación; menú y diálogo adaptados a temas/móvil.
- Editar cambia únicamente nombre (hasta 80 caracteres, sin duplicados por usuario). Eliminar solo admite cuentas sin vínculos: claves foráneas existentes bloquean atómicamente cuentas con movimientos de origen/destino, metas o pagos, incluso con saldo cero. No hay cascada, desvinculación ni eliminación de historial. `accounts.mjs` usa consultas parametrizadas y propietario de requireUser en nuevas Server Actions; sin migraciones ni cambios de reglas monetarias.
- Demo usa identificadores estables para vincular movimientos a cuentas y resolver sus nombres; renombrar actualiza historial/selectores sin cambiar saldos. Eliminar una cuenta usada se rechaza; cuentas vacías se pueden eliminar tras confirmar. Cambios solo en memoria. Ordenación por teclado/arrastre permanece y no se activa al usar opciones.
- Build final, typecheck y diff --check correctos; diff revisado. npm test 16/17: tres pruebas nuevas aprobadas; persiste fallo histórico `fox: deep/accent`. Integración específica aprobada con dos usuarios ficticios en base exclusiva y TLS: nombres/duplicados/no-op/propiedad, eliminación de vacía, rechazo por movimientos origen/destino a saldo cero/metas/pagos, historial/saldos intactos y limpieza comprobada. Añadida al script test:integration; no se reejecutó la integración conjunta.
- QA nuevo de demo: duplicado conserva entrada, Efectivo→Billetera actualiza cuatro filas de historial, eliminación de cuenta usada bloqueada; cancelar conserva Ahorros y confirmar elimina la vacía sin alterar total S/ 3,963.00. Escape devuelve foco; eliminación devuelve foco a otra tarjeta y libera scroll. Crear Caja tras eliminar y reordenar por teclado funciona; renombrada a Caja chica en móvil y arrastre real posterior correcto. Menú/diálogos inspeccionados en escritorio claro y 320/390 px oscuro, sin desbordamiento medido ni errores de consola capturados. Viewport restaurado. Pendientes QA privado ficticio de interfaz, espera/error reales, resto de temas y táctil; sin publicación ni datos reales.

## Arrastre desde toda la tarjeta de cuenta · 15/11/2026

- Retirado el botón de puntos por petición del usuario. Toda la tarjeta es enfocable y ordenable: cursor grab/grabbing, pequeña elevación/balanceo al hover y seguimiento del puntero durante arrastre. Umbral de 6 px separa clic/arrastre; captura en cuadrícula estable evita interrupciones al reordenar. Posición visual limitada a la cuadrícula. Escape/pointercancel revierten; guardado, rollback y anuncios existentes conservados.
- Flechas del teclado funcionan sobre la tarjeta; ayuda solo accesible y aria-disabled durante guardado sin eliminar foco. Animaciones decorativas respetan movimiento reducido; en táctil se permite pan-y para scroll nativo. Sin cambios de servidor/persistencia.
- Build, typecheck y diff --check correctos; diff revisado. QA demo: teclado reordena, arrastre real desde el centro de Efectivo hacia Ahorros cambia orden y muestra guardado; comprobados cursor grab, animación aplicada y ausencia de botones interiores. Inspección a 320 px y medida sin desbordamiento horizontal; sin errores de consola capturados. Viewport restaurado. Pendientes táctil real, cancelación/espera/error, movimiento reducido y privado autenticado. Sin pruebas unitarias, integración o publicación nuevas.

## Tarjetas de cuentas sin flechas ni ondas · 15/11/2026

- Retirados por petición del usuario los botones de flechas de las tarjetas y las ondas decorativas junto al chip, con sus estilos exclusivos. Se conserva el control de puntos para arrastrar y se añade ordenación con flechas del teclado sobre ese mismo control, con ayuda solo para lectores de pantalla. Guardado de orden y saldos conservados.
- Build, typecheck y diff --check correctos; diff revisado. Demo inspeccionada en escritorio: tarjetas sin flechas/ondas; ArrowRight mueve Efectivo después de Ahorros y ArrowLeft restaura el orden. Sin QA privado, integración, pruebas unitarias o publicación nuevos.

## Categorías visuales e iconos persistentes · 15/11/2026

- Cuentas sustituye las etiquetas por tarjetas ilustradas con nombre/icono y acceso directo a cambiarlo, separadas en gastos e ingresos. Catálogo propio de 16 SVG con paletas decorativas, temas de avatar, oscuro, responsive y movimiento reducido. Crear categoría incorpora tipo con control segmentado, nombre, selector nativo de iconos y vista previa. Se conserva el diseño de cuentas.
- Catálogo/compatibilidad en `category-icons.mjs`: categorías antiguas sin icono usan una sugerencia por nombre; elegir otro prevalece. `categories.mjs` valida nombre/tipo/icono y guarda con propietario autenticado; editar solo cambia icono. La migración 008 añade columna nullable y CHECK de catálogo. Aplicada únicamente a `u519053982_finanzas_test`, con nombre/TLS confirmados y ejecutor con checksum/bloqueo. No cambia saldos, movimientos ni nombres/tipos existentes.
- Las acciones usan requireUser, consultas parametrizadas y filtros user_id. Campos/selector y tarjetas se bloquean durante guardado del icono; errores conservan selección. El selector recibe foco y al cerrar/aplicar lo devuelve a la tarjeta. Demo conserva iconos y categorías entre secciones en memoria y los restablece al recargar; sin almacenamiento de navegador ni acciones privadas.
- Validación nueva: build y typecheck finales correctos en Node 24.21.0 local; diff revisado y diff --check correcto. npm test 13/14: pasan las tres nuevas de iconos, persiste fallo previo `fox: deep/accent`. Integración específica nueva aprobada en la base de pruebas: crear/leer/editar, guardar sin cambios, impedir edición ajena, duplicados, iconos inválidos en app/base, legado null y ausencia de efectos financieros; dos usuarios ficticios limpiados. Se añadió al comando test:integration, pero no se reejecutó toda la integración.
- QA nuevo de demo: creación de Mascotas con huella, duplicado conserva nombre/icono, edición a Viajes y conservación al navegar, alta de Ingreso extra, reinicio al recargar, flecha de teclado cambia radio y foco vuelve a tarjeta. Inspección clara de escritorio y 390 px, oscuro a 320 px (selector/creación); medidas a 320/390 px sin desbordamiento horizontal y sin errores de consola capturados. Viewport restaurado. Pendientes QA privado ficticio de interfaz, espera/error reales, estados vacíos y otras paletas. Sin publicación ni datos reales.

## Formulario de metas con más aire · 15/11/2026

- Se aligera el formulario aprobado: más padding y separación entre grupos, menos peso en etiquetas y sugerencias sin bordes/sombras prominentes. Se retiran numeración, título interior repetido y frase de cabecera; las ideas y cantidades rápidas siguen visibles y funcionales. El importe usa una superficie más neutra y la etiqueta de vista previa deja de ser una píldora. Se conserva avatar 3D, layout compacto responsive y acciones existentes.
- Build, typecheck y diff --check correctos; diff revisado. QA nuevo en demo clara: escritorio y 320 px inspeccionados, medidas a 320/390 px sin desbordamiento; Viaje/S/ 1200 y entrada 875,50 → 875.50 conservan vista previa. Sin errores de consola capturados; viewport restaurado. Sin pruebas unitarias, QA privado, integración o publicación nuevos. Otros temas y accesibilidad completa pendientes.

## Vista previa de metas sin indicadores ni frase · 15/11/2026

- Retirados por petición del usuario los indicadores «Nombre · Objetivo · Cuenta» y la frase inferior de la vista previa, incluida su variante «¡Tu meta está lista para empezar!». Eliminados cálculos y estilos exclusivos; se conservan avatar 3D, nombre, importe y cuenta.
- Build, typecheck y diff --check correctos; diff revisado. Demo inspeccionada en escritorio: ambos bloques ausentes. Sin QA privado, pruebas unitarias, integración o publicación nuevos; sin cambios de validación/persistencia.

## Avatar 3D en tarjetas de metas · 15/11/2026

- Las tarjetas compartidas `SavingsGoalCard` usan también VacationAvatar en su cabecera, sustituyendo la cumbre SVG. Siguen el avatar aplicado del perfil, conservando estado, porcentaje, importes, barra y aportes. El estado vacío conserva su ilustración anterior. Se reutilizan los seis PNG existentes, sin generación ni dependencias nuevas; sizes configurable permite optimizar el tamaño de tarjeta sin cambiar la vista previa del formulario.
- Build y typecheck correctos, diff revisado y diff --check correcto. QA nuevo de demo: koala inicial, previsualización de zorro conserva koala y aplicar los otros cinco personajes carga la imagen correcta (138 px optimizados). Tigre oscuro inspeccionado a 320 px; mediciones a 320/390 px sin desbordamiento y sin errores de consola capturados. Viewport restaurado. Sin QA privado, pruebas unitarias o integración nuevos; pendientes meta alcanzada, múltiples tarjetas y accesibilidad completa. Sin publicación.

## Vacaciones 3D según avatar aplicado · 15/11/2026

- `VacationAvatar` conecta la ilustración de Nueva meta al AvatarContext existente del shell. Usa el avatar confirmado, tanto al cargar el privado como al aplicar perfil en demo; probar una opción sin confirmar no cambia la ilustración. Conserva borrador y acciones del formulario, sin modificar preferencias ni persistencia.
- Generadas cinco variantes transparentes mediante imagegen integrado usando el koala como referencia: zorro/durazno, gato/lavanda, tigre blanco/ámbar, conejo/rosa y oso/arena. Recursos en `public/images/*-vacation-3d.png`, importación estática con `next/image`, texto alternativo por personaje y fallback al koala si el contexto no corresponde al catálogo. Prompts exactos y rutas en `docs/GOAL_VACATION_ASSET.md`.
- Build y typecheck correctos; diff revisado y diff --check correcto. QA de demo: seis selecciones aplicadas cargan su recurso correcto, probar zorro sin aplicar conserva koala y nombre/importe 875.50 siguen presentes tras los cambios. Tigre oscuro inspeccionado a 320 px; gato medido a 390 px; sin desbordamiento horizontal medido en ambos ni errores de consola capturados. Viewport restaurado. Sin QA privado, pruebas unitarias, integración remota o publicación nuevos; persistencia privada y accesibilidad completa pendientes.

## Koala de vacaciones en 3D · 15/11/2026

- La vista previa de «Nueva meta» sustituye las ilustraciones SVG por un koala 3D vacacionando en tumbona y sombrilla, PNG transparente generado con la herramienta integrada imagegen. Archivo local `public/images/koala-vacation-3d.png`, importado estáticamente con `next/image` y tamaños responsive. Prompt/procedencia en `docs/GOAL_VACATION_ASSET.md`.
- Es una ilustración fija del koala compartida por privado/demo y todos los temas; no cambia según el avatar del perfil. Las ideas siguen completando el nombre, y nombre/importe/cuenta conservan la vista previa interactiva. Se conserva el formulario compacto y se retiran SVG/animaciones exclusivos de la ilustración anterior. Sin nuevas reglas, dependencias, llamadas de IA del visitante o persistencia.
- Build, typecheck y diff --check correctos; diff revisado. QA nuevo de demo: imagen cargada en escritorio a 205 px, ideas/importe rápido, móvil 320 px claro sin desbordamiento horizontal y transparencia inspeccionada en oscuro a 320 px. Sin errores de consola capturados; viewport restaurado. Pendiente QA privado ficticio y restantes escenarios de accesibilidad/temas. Sin pruebas unitarias, integración, publicación o datos reales nuevos.

## Metas sin bloque hero · 15/11/2026

- Retirado por petición del usuario el bloque superior `hero` de GoalsWorkspace, junto con sus totales, conteos y estilos exclusivos. Demo y privado comienzan en «Tus metas», conservando creación, tarjetas y aportes.
- Build, typecheck y diff --check correctos; diff revisado. Inspección nueva de demo en escritorio confirma ausencia del bloque y presencia de formulario/tarjeta. Sin QA privado, integración o pruebas unitarias nuevas; sin cambios de reglas ni publicación.

## Formulario de meta compacto · 15/11/2026

- A petición del usuario se conserva la experiencia ilustrada, reduciendo espacios, cabecera, tamaño de ilustración y altura de campos. Cuenta/fecha comparten fila cuando hay espacio; en móvil, vista previa horizontal compacta con ilustración al lado del nombre e importe. Etiquetas abreviadas y un único contorno de foco alrededor del importe. Sin cambios de acciones, reglas ni datos.
- Build y typecheck finales correctos; diff revisado y diff --check correcto. QA nuevo de demo clara en escritorio y 320/390 px: ideas/importes rápidos, coma decimal y tarjeta responsive; mediciones móviles sin desbordamiento horizontal. Contorno de foco final comprobado en navegador y sin errores de consola capturados. Sin nuevas pruebas unitarias, integración remota o sesión privada; pendientes QA privado, otras paletas y accesibilidad completa. Sin publicación.

## Creación de metas interactiva · 15/11/2026

- `GoalCreateForm` sustituye el formulario básico por editor y tarjeta de vista previa: ideas opcionales de viaje/tranquilidad/tecnología con ilustraciones SVG originales, nombre libre con cohete, importe protagonista y cantidades sugeridas. La tarjeta refleja nombre, objetivo y cuenta; las marcas de campos preparados describen el formulario, no avance de ahorro. Fecha sigue siendo opcional; las ideas no añaden campos persistentes.
- En privado reutiliza `addGoal`, campos controlados, validación nativa/servidor y bloqueo durante envío; no cambia reglas ni base. En demo se permite explorar el mismo formulario con botón de creación deshabilitado y aviso de vista previa sin guardar. Las ilustraciones, controles y animaciones respetan temas, foco y movimiento reducido mediante CSS Module.
- Build, typecheck y diff --check correctos. QA nuevo de demo: tres ideas, importes rápidos, coma decimal 875,50 → 875.50, cuenta Ahorros reflejada, borrador conservado al cerrar/reabrir y activación de importe con Enter. Inspección clara en escritorio inicial y 320/390 px; oscura a 320/1440 px. Mediciones sin desbordamiento a 320/390/1440 px; sin errores de consola capturados. Pendientes guardado/espera/error con fixture privado, ausencia de cuentas, otras paletas y revisión completa de teclado/movimiento reducido. Sin pruebas unitarias ni integración remota nuevas, publicación o datos reales.

## Metas y ahorro visual · 15/11/2026

- Vista compartida `GoalsWorkspace`/`SavingsGoalCard` para privado y demo: ahorro acumulado de aportes, conteos de metas en camino/alcanzadas, ilustración SVG original de una cumbre y tarjetas con porcentaje, importe, restante, cuenta y fecha. Menos texto y formularios privados desplegables «Nueva meta»/«Aportar». La demo sigue siendo ilustrativa, sin acciones privadas ni nuevas simulaciones financieras.
- CSS Module con temas de avatar, modo oscuro, adaptación móvil, foco visible y movimiento reducido. Los formularios normalizan coma decimal, conservan campos controlados ante errores y bloquean controles/cierre del desplegable durante el envío. Se mantienen acciones autenticadas, transferencias, cálculo BigInt y request_id; este último se renueva tras éxito y se conserva ante error. Sin cambios de servidor, migraciones ni dependencias.
- Validación nueva: build y typecheck correctos; diff revisado y diff --check correcto. QA visual de demo en navegador: koala a 320/390 px y escritorio inicial, tigre oscuro a 320 y 1440 px; mediciones sin desbordamiento horizontal a 320/390/1440 px y sin errores de consola capturados. No se ejecutaron pruebas unitarias ni integración remota. Pendientes: QA privado ficticio de creación/aporte, espera/error, estados vacíos/meta alcanzada, teclado completo, movimiento reducido y otras paletas. Sin publicación ni datos reales.

## Texto de ordenación retirado · 14/11/2026

- Eliminada la indicación visible de arrastre y flechas en cuentas; se conservan los controles y la ordenación. Build y typecheck correctos; sin QA de navegador ni integración nueva.

## Nueva cuenta integrada en tarjetas · 14/11/2026

- «Nueva cuenta» ocupa una tarjeta gráfica dentro de la cuadrícula compartida y despliega allí el formulario existente. Funciona también sin cuentas; conserva los temas, el control nativo de expansión y la preferencia de movimiento reducido. Sin cambios en persistencia ni reglas de cuentas.
- Build y typecheck correctos; diff --check correcto. Sin QA visual o de interacción en navegador, pruebas unitarias ni integración remota nuevas; pendientes revisión responsive, teclado y temas en demo y privado.

## Orden persistente de cuentas · 14/11/2026

- En privado, la migración 007 añade posición a cada cuenta. El orden se guarda con sesión autenticada, validación de propiedad y transacción; cuentas nuevas aparecen al final. Fallos de guardado restauran el orden anterior y muestran el error. En demo se conserva al cambiar de sección y se reinicia al recargar, como sus demás datos.
- Migración 007 aplicada en la base exclusiva de pruebas con TLS. Integración nueva aprobada con dos usuarios ficticios, aislamiento y limpieza; dos pruebas locales específicas aprobadas. Build y typecheck correctos. Suite local 10/11: persiste el fallo anterior de contraste fox: deep/accent. Sin QA de navegador autenticado o de demo.

## Tarjetas de cuentas · 14/11/2026

- «Tus cuentas» presenta tarjetas con diseño de billetera, animación y orden por arrastre de ratón o tacto; también ofrece flechas accesibles y anuncia cambios de posición. El orden vive solo mientras la sección está abierta, tanto en demo como en privado; no se guarda en navegador ni en MySQL. No cambia saldos ni reglas financieras.
- Validación nueva: build y typecheck correctos; pendiente revisión en navegador de arrastre, teclado, movimiento reducido, temas y móvil, incluido privado autenticado. Sin integración remota ni publicación.

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
