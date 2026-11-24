## Iconos de categoría en el historial · 23/11/2026

- El historial general y el de cada cuenta muestran el icono y tono vigentes junto al nombre de la categoría. El modo automático utiliza el tono del icono. Las transferencias muestran su destino. La lectura privada usa la unión existente por categoría y propietario.
- Build y typecheck aprobados. En Chrome se cambió el icono y el color de Alimentación en demo y se verificó la coincidencia en ambos historiales. Sin migración ni comprobación privada nueva.

## Paleta de colores para categorías · 23/11/2026

- Alta y edición incorporan seis muestras con nombre, selector por teclado, indicador de selección, opción automática y vista previa. Los registros anteriores usan el tono del icono. La edición que omite el campo conserva la elección guardada.
- Migración 020 aplicada con el migrador y TLS en la base exclusiva de pruebas. Integración específica de iconos aprobada con creación, edición, restauración del color automático, comprobación de restricción SQL, aislamiento y limpieza. Compilación y typecheck aprobados. Siete pruebas locales específicas aprobadas. Suite general 44/45 por el fallo previo de contraste del tema zorro.
- Chrome en demo y en privado con usuario ficticio comprobó el alta con Azul mediante teclado, cambio de icono conservando el color, edición a Rosa y regreso a Automático. En privado se verificó el resultado después de recargar y se limpió el fixture. Se comprobó el ancho del formulario a 1366, 390 y 320 px y la adaptación de Rosa al tema tigre en demo. Pendiente inspección visual específica de presupuestos y del diálogo de eliminación.

## Nueva cuenta como acción general · 23/11/2026

- El botón pasó del último grupo bancario al encabezado de Cuentas, junto a Ordenar. Se retiró la tarjeta de alta de la cuadrícula. El alta de la demo permite elegir el banco y cierra el diálogo al guardar, igual que en privado.
- Build y typecheck aprobados. Chrome en demo a 1366, 390 y 320 px verificó un botón único fuera de los grupos, apertura con Enter, cierre con Escape, retorno de foco y ausencia de desbordamiento horizontal. Con USD vacío se creó una cuenta ficticia eligiendo Interbank y se comprobó su aparición en ese grupo. Sin nueva revisión privada ni cambios de persistencia.

## Estilos de cuentas por banco · 23/11/2026

- La apariencia por posición se sustituye por paletas y motivos gráficos vinculados a la entidad. El nombre del banco ocupa la parte superior de la tarjeta, y el nombre de la cuenta y el dinero libre quedan juntos. El detalle reutiliza los mismos colores y motivos. Las cuentas antiguas sin banco reciben la presentación neutra.
- Compilación de producción y comprobación de tipos aprobadas. Seis pruebas locales de cuentas, orden y selección aprobadas. La entrega es visual, sin migraciones. No se ejecutó integración remota ni QA autenticado nuevo.
- Chrome en demo verificó diez fondos y tramas diferenciados, estado sin banco, actualización al editar el banco, selección para el total, entrada y salida del modo ordenar, apertura con Enter y retorno de foco. Se detectó y corrigió una regla del tema tigre que cubría el fondo. Revisión final a 1366, 390 y 320 px con el tema oscuro: lista y detalle sin desbordamiento horizontal ni excepciones de página en los escenarios probados.

## Etiqueta del filtro de mes · 23/11/2026

- Retirada la etiqueta visible «Mes» del filtro de gastos por categoría; el selector conserva su nombre accesible. Cambio compartido por demo y privado. Build y typecheck aprobados; sin revisión nueva en navegador.

## Textos bajo barras del ranking · 23/11/2026

- Retirados los porcentajes y recuentos bajo las barras del ranking de gastos por categoría en demo y privado. Se conservan categorías, importes y barras. Build y typecheck aprobados; sin revisión nueva en navegador.

## Textos secundarios de gastos por categoría · 23/11/2026

- Retirados los tres textos small debajo de las cifras principales del tablero de gastos por categoría, compartido por demo y privado. Se conservan cifras, ranking y cálculos. Build y typecheck aprobados; sin revisión nueva en navegador.

## Catálogo y vista previa de tarjetas peruanas · 23/11/2026

- Alta compartida por demo y privado con selección progresiva de banco, red y modelo, alternativa manual y vista previa. Las selecciones dependientes se limpian al cambiar el banco o la red. El nombre del modelo elegido se genera en el servidor para el alta privada y los cuatro últimos dígitos opcionales distinguen tarjetas del mismo modelo. Edición de alias y reasignación de modelo disponibles en las tarjetas existentes.
- Migración aditiva 019 aplicada con el migrador, previa comprobación del nombre de la base exclusiva de pruebas y TLS. La integración de crédito aprobó la recuperación de un modelo de catálogo y otro manual, edición conservando el diseño, aislamiento entre propietarios, transacciones y limpieza de fixtures.
- Build y typecheck posterior aprobados. Suite local 43/44, incluidas las seis pruebas de crédito. Sigue fallando la aserción histórica de contraste del tema zorro. Se actualizó la expectativa de totales de crédito para comprobar también el desglose PEN que ya devolvía la aplicación. No se ejecutó toda la suite de integración.
- Chrome en demo a 1366, 390 y 320 px comprobó filtrado, cambio de banco, alta de catálogo y manual, coma decimal, borrador, Escape, retorno de foco y ausencia de desbordamiento horizontal o excepciones de página. En privado, un usuario ficticio inició sesión, creó una tarjeta Interbank American Express Gold, la cambió a Scotiabank Visa Singular Signature y editó su alias. Banco, diseño y nombre se comprobaron tras recargas. Fixture privado eliminado al terminar.
- El catálogo requiere mantenimiento manual. Sigue pendiente la revisión con lector de pantalla y la comparación visual individual de las 64 variantes con sus plásticos físicos.

## Visibilidad persistente del saldo · 23/11/2026

- Resumen guarda por usuario si el saldo acumulado está oculto, con lectura desde user_preferences y acción autenticada. El control actualiza inmediatamente, bloquea clics mientras guarda y revierte con aviso ante error. Demo conserva la preferencia en memoria al cambiar de sección y la restablece al recargar. No se guardan datos en navegador.
- Migración nueva 018_balance_visibility.sql aplicada mediante migrador y TLS únicamente a u519053982_finanzas_test. Prueba local y prueba de integración específica aprobadas: preferencia independiente entre dos usuarios ficticios, estado por defecto, cambios y conservación del avatar; fixtures limpiados y ausencia de preferencias comprobada. Integración añadida al script general, no ejecutado en conjunto. Build y typecheck aprobados; pendiente QA de navegador con sesión privada ficticia (recarga, salida/entrada, errores, espera, responsive y teclado). Sin publicación ni datos reales.

## Selección persistente de cuentas · 23/11/2026

- Corregida la lectura de summary_selected: mysql2 devuelve 0/1 y se convierte a booleano antes de entregar cuentas al cliente. La selección privada ya se guardaba por propietario en MySQL, pero el 0 se interpretaba como seleccionado tras recargar. No hay migración; demo conserva selección solo en memoria.
- Prueba local con pool simulado aprobada para 0/1 y propietario; build y typecheck aprobados. No se realizó integración real ni QA privado de recarga/logout; quedan pendientes. Primer intento de prueba bloqueado por EPERM del sandbox y repetido fuera de él.

## Texto de ilustración de cuenta · 23/11/2026

- Retirada la frase «Cada plan tiene su lugar» de la ilustración del detalle de cuenta, compartido por demo y privado. Build y typecheck aprobados; sin revisión nueva en navegador.

## Etiqueta de total en cuenta · 23/11/2026

- La etiqueta del saldo de la cuenta en el detalle se abrevia a «Total» en demo y privado; el importe conserva su cálculo. Build y typecheck aprobados; sin revisión nueva en navegador.

## Orden de saldos en detalle de cuenta · 23/11/2026

- Dinero libre pasa a ser la cifra principal y saldo de la cuenta aparece junto al importe en alcancías; se conservan los cálculos y la descripción accesible de la barra. Se retira el punto de color del saldo total para no confundirlo con la porción libre. Cambio compartido por demo y privado. Build y typecheck aprobados; sin revisión nueva en navegador ni cambios de reglas.

## Textos de la sección de alcancías · 23/11/2026

- Retiradas las frases introductorias y explicativas solicitadas en la sección de alcancías de demo y privado. Se conserva el aviso cuando no hay saldo libre. Build y typecheck aprobados; sin nueva revisión en navegador ni cambios de reglas.

## Texto de alcancías vacías · 23/11/2026

- Retirada la frase «Un lugar para tu próximo plan» de las alcancías vacías en demo y privado; se conserva la acción de separar dinero. Build y typecheck aprobados, sin revisión nueva en navegador ni cambios de reglas.

## Ancho de cuenta única por banco · 23/11/2026

- Un grupo de banco con una sola tarjeta ocupa como máximo media fila en pantallas de más de 480 px; en móvil ocupa el ancho disponible. Los grupos con más tarjetas conservan el máximo de tres por fila. Cambio de presentación compartido por demo y privado. Build y typecheck aprobados; queda pendiente la revisión visual responsive y del ordenamiento en navegador.

## Máximo de tres cuentas por fila · 23/11/2026

- La cuadrícula de cuentas muestra hasta tres tarjetas por fila dentro de cada grupo de banco, incluida la tarjeta para crear cuenta; las adicionales pasan a la fila siguiente. Mantiene menos columnas según el espacio disponible y una en móvil. Cambio compartido entre demo y privado, sin modificar datos ni orden. Build y typecheck aprobados; revisión visual responsive y ordenamiento pendiente.

## Fila de moneda y banco · 23/11/2026

- En el modal de nueva cuenta, moneda y banco comparten fila también en pantallas estrechas; nombre y saldo ocupan el ancho completo. Cambio de presentación compartido por demo y privado. Build y typecheck aprobados; sin nueva revisión de navegador, pendiente comprobar 320/390 px y escritorio.

## Modales de creación en la billetera · 23/11/2026

- Nueva cuenta y Nueva tarjeta abren diálogos nativos compartidos con ilustración, animación discreta y colores del tema. Los formularios conservan validaciones, datos ante errores y borrador al cerrar; al guardar correctamente se cierra el diálogo. Cierre por Escape o exterior y retorno de foco; cierre bloqueado durante guardado. Demo permanece en memoria y privado conserva sus acciones existentes.
- Validación nueva: build y typecheck aprobados. En demo de escritorio se revisaron visualmente ambos diálogos y el cierre de cuenta con Escape y retorno de foco. Pendientes creación y errores en navegador, responsive 320/390 px, teclado completo, movimiento reducido, temas y QA privado ficticio. No se ejecutó integración ni se cambió persistencia. El primer build falló por EPERM del sandbox; se completó fuera de él.

# Estado al 13 de noviembre de 2026

## Registro desde el login · 23/11/2026

- Se habilitó crear cuenta desde login por indicación del usuario, con contraseña confirmada, categorías propias, ninguna cuenta financiera y sin rol administrador. Se requiere administrador inicial. Registro limitado en base y respuesta genérica para duplicados. No envía ni verifica correos; no hay recuperación automática.
- Build y typecheck aprobados; prueba local de validación e integración específica aprobadas en base exclusiva TLS; identidad ficticia y datos eliminados. Se verificó concurrencia, hash, login/logout, duplicados, límites y datos iniciales. El contador global de pruebas expira según su ventana. Primer intento detenido por no establecer TEST_DB_NAME, sin conexión. Pendiente QA visual/interactivo y comprobaciones de producción; sin migración ni publicación.

## Tarjetas de cuenta con banco y nombre · 23/11/2026

- Título compartido de las tarjetas cambiado a Banco - nombre de cuenta, retirando la moneda del título. Sin banco configurado muestra Sin banco. Importe conserva su símbolo monetario; sin cambios de datos, selección ni orden.
- npm run build y typecheck posterior aprobados; cambio revisado y git diff --check correcto. Sin nuevas pruebas de reglas ni QA de navegador; pendiente revisión visual responsive. Cambios locales previos conservados.

## Textos del tablero de categorías · 23/11/2026

- Reducidos textos decorativos y repetidos; etiquetas directas y estado vacío breve, conservando los datos y filtros. Cambio compartido por privado/demo, sin cambios de reglas.
- Build y typecheck aprobados; diff comprobado. Sin QA nuevo de navegador, pendiente revisión visual e interactiva del tablero.

## Tablero de gastos por categoría · 23/11/2026

- Añadido bajo Categorías en privado/demo: selección de mes y moneda, total, categoría principal, comparación con mes anterior, gráfico de distribución y ranking accesible en texto. Cálculo exacto en céntimos; excluye ingresos y transferencias y no mezcla monedas.
- Prueba local de agregación aprobada; build y typecheck aprobados. No se hizo QA de navegador: el entorno de control falló al iniciar con error 1920. Pendientes visual, responsive, teclado, temas y comprobación con sesión ficticia; sin integración remota ni publicación.

## Apertura y orden de cuentas · 23/11/2026

- Tarjeta completa abre movimientos y alcancías; botón «Ordenar» activa modo de arrastre con manos animadas y «Listo» lo desactiva. Se conservan controles independientes y orden por banco, flechas de teclado y movimiento reducido.
- Verificación nueva: `npm run build` y `npm run typecheck` aprobados; diff revisado. Pendiente QA de navegador para animación, arrastre táctil, teclado y responsive en demo/privado. Sin cambios de persistencia ni integración nueva.

## Cuentas sin etiqueta de inclusión en total · 23/11/2026

- Retirado el texto visible Incluida en total / Excluida del total de las tarjetas compartidas por privado/demo. Se conserva el selector, su estado y nombre accesible, sin cambios de cálculo ni persistencia.
- npm run build y npm run typecheck posterior aprobados; cambio revisado por inspección y git diff --check correcto. Sin nuevas pruebas de reglas/integración ni QA de navegador; pendiente revisión visual. Cambios anteriores conservados.

## Usuarios nuevos sin cuentas predeterminadas · 23/11/2026

- Eliminada la creación automática de Efectivo, Cuenta principal y Ahorros en createManagedUser y en el script de primera instalación db:create-user. Un usuario nuevo comienza sin cuentas y puede crearlas desde Cuentas; se conservan las categorías iniciales propias y los permisos/acceso existentes. Las cuentas ya creadas no se modifican ni eliminan. Este acuerdo sustituye el alta de tres cuentas descrita en entradas históricas.
- Las pruebas de alta ahora exigen cero cuentas y crean una cuenta propia explícitamente para verificar movimientos/aislamiento. El fixture de borrado crea sus cuentas cuando necesita probar relaciones de los módulos; editar un usuario recién creado conserva cero cuentas.
- Validación nueva: npm run build y npm run typecheck posterior aprobados; dos pruebas locales de user-management.test.mjs y las integraciones user-management-integration.mjs/user-directory-integration.mjs aprobadas (7/7 incluyendo contenedores). Alta real de fixture y login con cero cuentas comprobados, más creación explícita de cuenta propia con saldo cero, aislamiento, edición con cero cuentas y borrado posterior de fixtures con relaciones completas. Identidades ficticias limpiadas y ausencia comprobada por ambas suites. Script de primera instalación revisado por inspección, sin ejecutarlo sobre la base existente. README actualizado, diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni suite general; pendiente revisión del estado vacío de Cuentas/Resumen con identidad ficticia. Sin migraciones, publicación ni datos financieros reales; cuentas previas conservadas.

## Lista, edición y eliminación de usuarios · 23/11/2026

- Configuración → Usuarios muestra el directorio solo al administrador, con correo, fecha de creación en Lima y rol; no incluye contraseñas, hashes, sesiones ni datos financieros. El alta revalida la página para actualizar la lista. Usuarios normales y demo no reciben el directorio ni sus controles.
- Editar permite cambiar correo y opcionalmente contraseña (12–128 caracteres, repetida); dejar las claves vacías conserva la actual. Cada edición revoca las sesiones del usuario objetivo y conserva sus datos. Los administradores están protegidos de edición/borrado desde esta lista; la cuenta propia conserva Acceso y seguridad.
- Eliminar exige contraseña actual del administrador y escribir exactamente el correo objetivo. El diálogo explica el borrado irreversible de cuenta y datos. Borrado físico de dependientes por propietario en orden de FK dentro de una transacción: alcancías/solicitudes, canjes/premios, marcas/hábitos, presupuestos/pagos, aportes/metas, movimientos, preferencias, categorías/cuentas y sesiones; luego usuario. Ante fallo se revierte completo. No se elimina ningún usuario real como parte de la entrega.
- Autorización compartida con altas: sesión vigente y rol comprobados en servidor, contraseña actual, límite persistente común de ocho intentos por administrador/15 minutos, contador confirmado antes de verificar contraseña. Consultas parametrizadas y objetivo validado; rechazo de correo duplicado y usuario ya eliminado. Sin migraciones ni cambios de permisos financieros; el administrador gestiona acceso, no consulta las finanzas ajenas.
- Comprobación remota final de solo conteos: dos usuarios y un administrador; cero identidades con los prefijos ficticios de ambas suites. Se conservaron las cuentas ajenas a las pruebas.
- Validación nueva: npm run build y npm run typecheck posterior aprobados; dos pruebas locales de user-management.test.mjs aprobadas. Integraciones user-directory-integration.mjs y user-management-integration.mjs aprobadas juntas (7/7 contando contenedores): lista sin secretos, denegación a usuarios normales/sesión inválida, protección del administrador, contraseña incorrecta, correo duplicado, conservación y cambio de contraseña con revocación/login, límite persistente compartido, confirmación incorrecta sin borrado, eliminación con datos de todos los módulos y sesiones, rechazo de reenvío y aislamiento del otro usuario. Fixtures y datos eliminados, ausencia verificada por las suites. Nueva integración añadida a test:integration, sin ejecutar suite general. Diff revisado y git diff --check correcto. Sin QA de navegador: pendientes responsive, teclado/foco, errores/espera, actualización de lista tras alta/edición/borrado y comprobación de visibilidad en sesiones privadas ficticias. Cambios previos conservados, sin publicación ni datos reales.

## Alta privada de usuarios con datos separados · 23/11/2026

- Configuración incorpora Usuarios → Crear usuario solo para el administrador. Formulario con correo del nuevo usuario, contraseña de 12–128 caracteres, confirmación y contraseña actual del administrador. Bloqueo durante envío, conservación ante errores, limpieza tras éxito y foco al botón. No envía correos ni abre registro público; demo no incorpora altas reales.
- Migración nueva 017_private_user_admins.sql aplicada solo en la base exclusiva de pruebas con TLS mediante el migrador/checksums. Antes de aplicar se confirmó por COUNT que existía una única cuenta, sin imprimir identidades; esa cuenta inicial recibe el rol. La migración solo asigna automáticamente si existe exactamente un usuario; instalaciones nuevas asignan administrador desde db:create-user, que sigue limitado a la primera cuenta. El rol es una tabla privada, no un valor enviado por el cliente ni una preferencia editable. No se añadieron otros administradores persistentes.
- createManagedUser exige rol de administrador, sesión vigente y contraseña actual comprobados en servidor. Límite persistente de ocho intentos por administrador/15 minutos, consumido antes de verificar contraseña para que errores no reviertan el contador. Nuevas contraseñas con scrypt/sal aleatoria existente. Alta transaccional con bloqueo del creador, consultas parametrizadas, correo normalizado/único y rechazo de duplicados concurrentes.
- Cada alta crea tres cuentas propias con saldo cero y siete categorías propias, sin copiar saldos, movimientos, presupuestos, pagos, metas, alcancías, preferencias ni recompensas del creador. Nuevos usuarios no reciben rol administrador. Los hábitos iniciales y preferencias siguen el comportamiento por usuario existente. El administrador no recibe acceso a finanzas ajenas; lecturas/escrituras privadas conservan propietario de sesión y FK compuestas. Se reutiliza el mismo login y logout.
- Validación nueva: npm run build y typecheck posterior aprobados. user-management.test.mjs aprobado. Integración específica user-management-integration.mjs en la base exclusiva TLS aprobada (dos escenarios y contenedor, 3/3): sesión inválida, contraseña incorrecta y contador persistente, alta/contraseña hasheada/login/logout, rol enviado por cliente ignorado, usuario normal sin permiso de alta, cuentas/categorías propias vacías, metas/presupuestos vacíos, rechazo de movimiento con referencias ajenas, movimientos visibles solo por dueño, correo duplicado/concurrencia y límite persistente. Identidades y datos ficticios eliminados, ausencia comprobada. Integración añadida al script general, que no se ejecutó completo. Diff revisado y git diff --check correcto.
- Pendiente QA interactivo con identidad ficticia administradora: formulario, responsive 320/390 px/escritorio, teclado/foco, error/espera/éxito y visibilidad para usuario normal. Las pruebas de repositorio no sustituyen ese QA ni una auditoría exhaustiva de seguridad. Sin publicación ni uso de datos financieros reales; cambios anteriores conservados.

## Editar y eliminar pagos futuros · 23/11/2026

- Cada pago pendiente incorpora un menú de tres puntos Editar/Eliminar en privado/demo. Editar permite descripción, importe, fecha, cuenta de activo, categoría de gasto y modo manual/automático con hora de Lima; conserva datos ante error y normaliza coma decimal. Eliminar requiere confirmación y retira el pago de pendientes sin crear gasto ni alterar saldo. Se conserva Marcar pagado y la cancelación previa.
- manageFuturePayment toma propietario de requireUser, bloquea usuario y pago pendiente en transacción antes de editar/cancelar y serializa con settlePayment/procesador automático. Valida referencias propias, tipo de cuenta/categoría, DECIMAL positivo y fecha/hora. Nuevas fechas hoy/futuras; permite conservar vencimiento histórico manual. Modo automático siempre exige hora futura de Lima. Pagados/cancelados no admiten edición/eliminación; los movimientos existentes se conservan. Eliminar utiliza estado cancelled existente, sin migraciones.
- readPlanning incluye IDs de cuenta/categoría para precargar formulario. Demo modifica pagos solo en memoria, actualizando lista/calendario/panorama al guardar o eliminar y restableciendo al recargar; sus fechas siguen siendo ilustrativas del 11/11/2026. Creación y confirmación demo conservan su alcance previo. Menú con teclado, Escape/exterior, foco devuelto al disparador antes del diálogo, Conservar como foco de eliminación y controles/cierre bloqueados al guardar.
- Validación nueva: npm run build final y npm run typecheck posterior aprobados. Prueba local payment-management.test.mjs aprobada (precisión, fecha civil, manual/automático y conversión Lima/UTC). Integración específica payment-management-integration.mjs en base exclusiva de pruebas TLS aprobada: dos escenarios y contenedor (3/3), con edición/repetición, referencias ajenas rechazadas y rollback, PEN/USD, cambio de modo/hora, eliminación sin gastos, carrera con registro automático y rechazo de cambios a pagos procesados. Usuarios ficticios limpiados y ausencia verificada por la suite. Integración añadida a test:integration, sin ejecutar la suite general. Diff revisado y git diff --check correcto.
- Sin QA nuevo de navegador; pendientes responsive 320/390 px/escritorio, teclado/foco, estados de espera/error privados, calendario tras cambios de fecha y demás temas. Cambios anteriores conservados; sin publicación, datos reales ni dependencias nuevas.

## Editar y eliminar metas de ahorro · 23/11/2026

- Menú de tres puntos con Editar/Eliminar en cada meta, compartido por privado/demo. Edición de nombre, objetivo monetario y fecha opcional; conserva cuenta de ahorro e importe aportado. Admite objetivo inferior a lo ahorrado (barra existente limitada al 100%), coma decimal y mantener una fecha histórica ya existente. Nuevas fechas deben ser válidas y hoy/futuras. Confirmación de eliminación informa que el dinero sigue en su cuenta y las transferencias/aportes se conservan.
- Migración nueva 016_goal_deletion.sql con deleted_at nullable, aplicada exclusivamente en la base de pruebas autorizada con TLS mediante el migrador/checksums. LF conservado. Borrado lógico oculta metas de Planificación/Resumen sin romper FK, historial ni idempotencia de aportes. Lectura, edición y contribución excluyen metas eliminadas. El dinero no vuelve a origen ni crea movimientos. Las referencias históricas a la cuenta se conservan.
- manageGoal usa propietario de requireUser, validación compartida sin flotantes, transacción y bloqueo de usuario/meta para serializar con aportes, filtros user_id y consultas parametrizadas. Cuenta de ahorro inmutable en edición para conservar trazabilidad. Demo modifica metas ilustrativas en memoria y refleja el cambio en Resumen; recarga restablece ejemplos. Creación/aportes demo conservan su alcance previo.
- Nuevo GoalControls reutiliza el patrón de menú y estilos de presupuestos, con cierre exterior/Escape, teclado, foco inicial y devolución al disparador antes del diálogo. Formularios conservan valores ante errores y bloquean controles/cierre durante guardado; eliminación lleva foco al encabezado de metas.
- Validación nueva: npm run build final y typecheck posterior aprobados; prueba local goal-management.test.mjs aprobada. Integración específica goal-management-integration.mjs aprobada con TLS (dos escenarios y contenedor, 3/3): propiedad, precisión, validación, mismo valor, objetivo inferior al ahorro, cuenta intacta, ocultación, rechazo de edición/aporte posterior, historial/movimientos/saldos intactos y concurrencia aporte/eliminación. Usuarios ficticios limpiados y ausencia comprobada. Integración añadida a test:integration, sin ejecutar suite completa. El primer build detectó tipado de fecha opcional, corregido con JSDoc antes del build final. Diff revisado y git diff --check correcto.
- Sin QA nuevo de navegador; pendientes responsive 320/390 px/escritorio, temas, navegación de teclado, cierre/foco de diálogos y espera/errores privados. Cambios previos conservados. Sin publicación, datos reales ni dependencias nuevas.

## Menú de tres puntos en presupuestos · 23/11/2026

- Editar y Eliminar se agrupan en un menú de tres puntos en la esquina superior de cada tarjeta, compartido por privado/demo. Reutiliza la edición de límite y confirmación de eliminación existentes.
- Disparador de 44 px con nombre por categoría, aria-expanded/haspopup, foco en primera opción, flechas/Home/End, cierre exterior/Escape/salida de foco y retorno al disparador antes de abrir el diálogo. Estilos ligados al tema y superposición sobre tarjetas contiguas.
- Validación nueva: npm run build y npm run typecheck posterior aprobados; cambio revisado por inspección y git diff --check correcto. Sin pruebas de integración nuevas porque no cambian permisos, reglas ni persistencia. No se realizó QA de navegador; pendientes revisión responsive, teclado y retorno de foco al cancelar los diálogos. Cambios anteriores conservados; sin migraciones, publicación ni datos reales.

## Editar y eliminar presupuestos · 23/11/2026

- Cada tarjeta de presupuesto incorpora Editar y Eliminar en privado/demo. Editar abre el límite actual para modificar su importe, manteniendo categoría y mes; admite coma decimal. Eliminar pide confirmación y conserva todos los gastos. Diálogos compartidos, foco inicial en importe/Conservar, controles y cierre bloqueados al guardar, datos conservados ante error y foco al encabezado tras borrar.
- Nuevas operaciones updateBudget/deleteBudget parametrizadas y filtradas por propietario obtenido de requireUser. Edición transaccional con bloqueo del presupuesto, validación DECIMAL positiva existente y aceptación del mismo importe; borrado atómico por ID/propietario. Revalidación de privado; recálculo del disponible y avance desde importes exactos existentes. Sin cambios de categoría/mes, movimientos ni migraciones.
- Demo permite editar/eliminar los presupuestos ilustrativos solo en memoria y restablece al recargar; conserva creación de presupuestos y pagos en su alcance previo de vista ilustrativa. El gasto mostrado sigue derivándose de movimientos. Nuevo BudgetControls compartido con estilos del tema.
- Validación nueva: npm run build y npm run typecheck posterior aprobados; tres pruebas locales de money.test.mjs y nueva integración budgets-integration.mjs en base exclusiva de pruebas con TLS aprobadas (dos escenarios y contenedor, 3/3). Comprueba precisión, importes inválidos, mismo importe, aislamiento entre usuarios/meses, rechazo de presupuesto eliminado, gastos/saldos intactos y recreación con consumo previo. Usuarios ficticios limpiados y ausencia verificada por la suite. Integración añadida al script test:integration; no se ejecutó la suite general. Diff revisado y git diff --check correcto.
- Sin QA nuevo de navegador; pendientes revisión visual a 320/390 px y escritorio, teclado/foco al guardar/borrar, espera/errores privados y demás temas. Cambios anteriores conservados; sin publicación, datos reales ni dependencias nuevas.

## Alcancías con forma de cerdito · 23/11/2026

- Sustituida la ilustración de frasco por un cerdito SVG original: cuerpo redondo, hocico, oreja, ojo, patas, cola rizada y ranura para moneda. Componente renombrado a Piggybank y compartido por tarjetas ocupadas/vacías, cabecera y diálogos de privado/demo. Conserva número, moneda animada, colores derivados del tema y movimiento reducido existente.
- Validación nueva: npm run build y npm run typecheck posterior aprobados; SVG renderizado con sharp a una vista previa local en .next y revisado visualmente en su estado ocupado. Diff revisado y git diff --check correcto. Sin cambios de reglas ni persistencia, ni pruebas monetarias/integración nuevas. No se realizó QA interactivo de navegador: pendientes revisión en móvil/escritorio, estado vacío y demás temas. Cambios previos conservados; sin dependencias nuevas, publicación ni datos reales.

## Botones de alcancías en una fila · 23/11/2026

- «Agregar dinero» y «Liberar dinero» comparten una fila de dos columnas iguales en cada alcancía, en privado/demo. Ajuste de padding y texto adaptable al ancho disponible, con altura mínima existente de 44 px y estado deshabilitado visible.
- Cambio de presentación; conserva las acciones, diálogos y reglas de saldo. npm run build y npm run typecheck aprobados; cambio revisado por inspección y git diff --check correcto. Sin pruebas monetarias/integración nuevas ni QA de navegador; pendiente revisión visual a 320/390 px y escritorio. Documentación actualizada y cambios anteriores conservados. Sin publicación ni datos reales.

## Menú de tres puntos en alcancías · 23/11/2026

- «Cambiar nombre» y «Eliminar alcancía» pasan a un menú de tres puntos en la esquina superior de cada alcancía, compartido por privado/demo. Agregar y liberar dinero siguen visibles. Reutiliza los diálogos y acciones existentes.
- Botón de 44 px con nombre accesible por alcancía, aria-expanded/haspopup, foco inicial en primera opción, flechas/Home/End, cierre por Escape/exterior/salida de foco y devolución al disparador antes de abrir un diálogo. Estilos ligados al tema y superposición sobre tarjetas contiguas; eliminados estilos exclusivos de las acciones sueltas.
- Validación nueva: npm run build y npm run typecheck posterior aprobados; inspección del cambio y git diff --check correctos. Sin pruebas monetarias/integración nuevas porque no cambian reglas ni persistencia. No se realizó QA de navegador: pendientes revisión visual responsive, teclado, foco al cancelar diálogos y demás temas. Cambios previos conservados; sin migraciones, publicación ni datos reales.

## Eliminar alcancías y devolver dinero libre · 23/11/2026

- Nueva acción «Eliminar alcancía» en cada tarjeta del detalle compartido por privado/demo. Confirmación con nombre, importe y cuenta que recupera el saldo libre; foco inicial en Conservar, bloqueo de controles/cierre durante envío y mensaje tras éxito. El espacio eliminado queda disponible para una nueva alcancía.
- Reutiliza la acción autenticada y transaccional de liberación total existente, con saldo esperado y clave de idempotencia; no añade escrituras ni reglas monetarias nuevas. Elimina la reserva, sin alterar saldo total de cuenta ni crear movimientos. La demo conserva sus cambios solo en memoria. Sin migraciones.
- Validación nueva: npm run build y npm run typecheck posterior aprobados; seis pruebas locales de piggybanks.test.mjs aprobadas. Integración específica con TLS en base exclusiva de pruebas: diez escenarios y contenedor aprobados (11/11), incluido borrar reserva S/ 45.50 con aumento del libre de S/ 54.50 a S/ 100, saldo total intacto, ausencia de movimientos, rechazo de propietario ajeno, reutilización del mismo espacio y repetición de solicitudes sin afectar al reemplazo. Usuarios ficticios limpiados y ausencia comprobada por la suite. Diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni suites generales; pendientes revisión visual responsive, teclado/foco y espera/error de la confirmación. Cambios anteriores conservados, sin publicación ni datos reales.

## Cambiar nombre de alcancías existentes · 23/11/2026

- «Cambiar nombre» en cada alcancía abre un diálogo compartido por privado/demo con el nombre actual seleccionado, campo de hasta 60 caracteres y acciones Cancelar/Guardar nombre. Conserva lo escrito ante error y bloquea controles/cierre durante guardado. La demo actualiza solo memoria.
- Validación de nombre compartida con creación: recorta espacios y rechaza vacío, tipos inválidos y exceso de longitud. Acción privada autenticada por requireUser, bloqueo de propietario/alcancía, consulta parametrizada por user_id y transacción; acepta guardar el mismo nombre y rechaza alcancías ajenas o liberadas. Cambia únicamente el nombre. Sin migraciones ni cambios monetarios.
- Validación nueva: npm run build y npm run typecheck posterior aprobados; seis pruebas locales de piggybanks.test.mjs aprobadas. Integración específica en base exclusiva de pruebas con TLS: nueve escenarios y contenedor aprobados (10/10), incluido cambio de nombre persistido, acentos/espacios, mismo nombre, rechazo de vacío/exceso, aislamiento por propietario y alcancía liberada; saldo, importe, posición y movimientos intactos. Usuarios ficticios limpiados y ausencia comprobada por la suite. Diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni suites generales; pendientes revisión visual responsive y teclado/foco/espera/error del nuevo diálogo. Cambios anteriores conservados, sin publicación ni datos reales.

## Agregar dinero a alcancías existentes · 23/11/2026

- Botón «Agregar dinero» en cada alcancía del detalle compartido por privado/demo. Diálogo con saldo actual, dinero libre de esa cuenta e importe con coma decimal; errores conservan el importe, controles/cierre bloqueados durante guardado y foco en el campo al abrir. Mantiene nombre y espacio de la alcancía. Sin fechas ni movimiento/gasto; saldo total de cuenta intacto.
- Cálculo exacto BigInt, importe positivo y límite DECIMAL(13,2) sobre el saldo resultante. La acción privada toma propietario de requireUser; actualización y comprobación del saldo libre en una transacción con bloqueo del propietario y alcancía, rollback y consultas parametrizadas. Demo solo en memoria.
- Reutilizado piggybank_requests para claves únicas de agregado y liberación, conservadas incluso tras liberar todo. Evita aplicar dos veces un agregado y una liberación antigua aunque un agregado posterior restablezca el mismo saldo. Sin migraciones ni cambios de checksums.
- Validación nueva: npm run build final y npm run typecheck posterior aprobados; cinco pruebas locales de piggybanks.test.mjs aprobadas. Integración específica con TLS en la base exclusiva de pruebas: ocho escenarios y contenedor aprobados (9/9), incluidos agregado PEN/USD, saldo libre/rollback, aislamiento, duplicados concurrentes, reserva simultánea y repetición de liberación tras restablecer el saldo. Usuarios ficticios limpiados y ausencia verificada por la suite. El primer build detectó un import useRef faltante, corregido antes del build final. Diff revisado y git diff --check correcto. Sin suite general ni QA nuevo de navegador; pendientes responsive, teclado, foco y espera/error del nuevo diálogo. Se conservan cambios de entregas anteriores; sin publicación ni datos reales.

## Liberación parcial o total de alcancías · 23/11/2026

- El diálogo compartido por privado/demo permite escribir el importe a liberar o seleccionar «Liberar todo» antes de confirmar. Al liberar una parte conserva nombre, espacio y saldo restante; al liberar todo elimina la alcancía y deja disponible su espacio. Conserva errores/importe y bloquea controles/cierre durante el guardado; admite coma decimal.
- Cálculo exacto con BigInt, importe positivo y no superior a lo reservado. Persistencia transaccional con bloqueo por propietario y alcancía, consultas parametrizadas y filtros user_id. Comparación del saldo mostrado con el saldo bloqueado rechaza envíos repetidos/concurrentes u obsoletos. Se conserva la llamada interna histórica sin importe para liberación total. Sin migraciones, movimientos ni cambios del saldo total de cuenta.
- Validación nueva: npm run build y typecheck posterior aprobados; cuatro pruebas locales de piggybanks.test.mjs aprobadas. Integración específica piggybanks-integration.mjs en base exclusiva de pruebas con TLS: seis escenarios y contenedor aprobados (7/7), incluidos liberación parcial exacta, exceso, aislamiento y dos solicitudes concurrentes con solo una aplicada. Limpieza de usuarios ficticios comprobada por la suite. No se ejecutó integración general ni QA nuevo de navegador; pendientes revisión visual responsive, teclado y espera/error del diálogo. Diff revisado y git diff --check correcto. Cambios previos conservados; sin publicación ni datos reales.

## Alcancías sin día de uso · 23/11/2026

- Retirados el campo opcional de fecha, las fechas visibles y el aviso «Llegó el día» del detalle compartido por privado/demo. Crear requiere nombre e importe; separar y liberar siguen disponibles sin día límite. Eliminados estado y estilos exclusivos de esos avisos.
- Sin cambios de reglas monetarias ni migraciones: el flujo existente admite target_on nulo; las fechas históricas almacenadas ya no se muestran. Se conserva la protección del saldo reservado.
- Validación nueva: npm run build, npm run typecheck posterior, tres pruebas de tests/piggybanks.test.mjs y git diff --check aprobados. Diff revisado. Sin QA nuevo de navegador ni integración remota; pendiente revisión visual del formulario y tarjetas en móvil/escritorio. Se conserva el cambio previo de next-env.d.ts sin edición manual. Sin publicación ni datos reales.

## Detalle de cuentas y alcancías · 19/11/2026

- Cuentas abre detalle al pulsar tarjeta o usar Enter: saldo de cuenta, reservado/libre, cuatro espacios visuales y movimientos solo de esa cuenta (origen y destino). Reutiliza filtros y exportación Excel; transferencias con signo relativo y moneda correcta. Consulta en el detalle y edición/borrado existentes en Movimientos. Se conserva orden al regresar, con revalidación de su acción privada.
- Hasta cuatro alcancías de importe positivo por cuenta de activo, con nombre/fecha opcional. Reserva dinero existente, sin cambiar saldo total ni crear movimientos o gastos. Liberación completa con confirmación, espacio reutilizable y recordatorio «Llegó el día»; la fecha no libera ni gasta automáticamente. PEN/USD por cuenta, sin alcancías en tarjetas. Demo solo en memoria.
- Persistencia y protección de saldo libre: migración 015 aplicada solo a la base exclusiva u519053982_finanzas_test, con TLS y LF comprobados. FK compuesta por propietario/cuenta, posiciones únicas 1–4 y registro de idempotencia conservado tras liberar. Gastos/transferencias, edición/borrado de movimientos, aportes y pagos verifican reservas antes del commit; rollback al faltar saldo libre. Aportes ahora serializa por propietario. Los pagos automáticos sin saldo libre quedan pendientes de reintento. Cuentas sin reservas conservan comportamiento anterior.
- Diseño compartido con frascos SVG, moneda/llenado/entrada breves, reparto visual de saldo y soporte de temas/movimiento reducido. Formularios conservan borrador y errores, normalizan coma decimal y bloquean controles/cierre mientras guardan; gestión de foco al abrir, cancelar y tras éxito, incluso al completar el cuarto espacio.
- Build final y typecheck posterior aprobados (Node 26.13.0); tres pruebas locales nuevas correctas. Suite local 28/31: permanecen tres fallos históricos (fox: deep/accent y aserciones de crédito anteriores a byCurrency/bank_code).
- Integración completa: diez archivos, 21/23 resultados correctos contando contenedores. Un escenario de integration.mjs falla por expectativa antigua sin byCurrency y causa el fallo de su contenedor; los demás pasan. Alcancías: cinco escenarios más contenedor aprobados, incluidos aislamiento, monedas, tarjetas, límite de cuatro concurrente, restricción SQL, idempotencia después de liberar, protección de movimientos/edición/borrado/pagos/aportes y carrera gasto/reserva. Primer intento de la nueva integración falló por faltar línea en la tarjeta ficticia; corregido fixture y repetido con éxito. Usuarios de integración limpiados.
- QA demo: acceso desde tarjeta, cuatro espacios/límite, alta con coma/fecha, error con borrador conservado, Escape/foco, liberación, cuenta vacía, aislamiento entre cuentas y reinicio al recargar. QA privado con identidad ficticia: alta S/ 45.50 en Ahorros, saldo total S/ 100 y libre S/ 54.50, fecha Lima/recordatorio, espera y bloqueo, recarga persistente, error al separar S/ 55, cancelación/liberación con saldo total intacto, historial de transferencia recibida aislado, orden con teclado/Enter/vuelta y logout. Fixture eliminado con su historial y claves de idempotencia.
- Inspección responsive a 320/390/1440 px y medidas sin desbordamiento en escenarios revisados; tema tigre de escritorio inspeccionado y consola capturada sin errores. QA detectó fecha no recogida al enviar y título con color global incorrecto; corregidos y comprobados. Viewport restaurado; demo de revisión disponible. Diff revisado y git diff --check correcto.
- Pendientes de esta entrega: otras paletas, movimiento reducido y accesibilidad exhaustivos, táctil/arrastre y abrir exportación de cuenta en Excel; actualizar expectativas antiguas de pruebas. Pendientes de producción anteriores conservados. Sin publicación, datos reales ni dependencias nuevas; cambios locales ajenos conservados.

## Categorías como sección propia · 19/11/2026

- Categorías sale de Cuentas y aparece debajo de ella en el sidebar compartido, incluido el menú móvil. Privado usa /privado?seccion=categorias; demo navega con estado React. Se reutiliza CategoriesSection sin cambiar sus tarjetas, formulario de alta, editor ni confirmación de eliminación; se mantienen las acciones autenticadas y la revalidación de /privado.
- Separadas las propiedades de categorías de AccountsWorkspace/AccountsDemo. La demo reutiliza el formulario existente extraído a DemoSetupForm y mantiene categorías en el estado superior para compartirlas con movimientos/planificación. Agrupadores del sidebar ligados al identificador de sección, no a índices desplazados.
- Ajuste mínimo de responsive: a 370 px o menos, el encabezado de Categorías permite que el botón pase a la siguiente línea. La revisión a 320 px detectó desbordamiento del encabezado; se corrigió y se volvió a comprobar sin desbordamiento. El resto del diseño se conserva.
- Validación nueva: npm run build y npm run typecheck finales aprobados; seis pruebas locales de category-management/category-icons aprobadas. Demo en navegador: Cuentas sin categorías, nueva sección y alta ficticia en memoria, conservación al volver desde Cuentas, reinicio al recargar, menú móvil que abre Categorías/cierra el diálogo, inspección a 1440/390/320 px y medidas sin desbordamiento tras el ajuste. Consola capturada sin errores; viewport restaurado. Diff revisado y git diff --check correcto.
- No se ejecutaron integración remota ni QA con sesión privada ficticia para esta navegación; siguen pendientes guardado/error/espera privados, edición/borrado en la nueva ubicación, teclado exhaustivo y otras paletas. Sin migraciones, publicación ni datos reales.


## Retirada de frases del pie · 19/11/2026

- Retiradas «Hecho para avanzar a tu ritmo.» y «Tus datos están en tu espacio privado» del panel privado, eliminando su pie vacío. La demo también retira la primera frase y conserva «Vista previa · Datos ficticios».
- npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni integración; pendiente revisión visual. Sin cambios de reglas ni persistencia.


## Sidebar sin Mi espacio personal · 19/11/2026

- Retirado el bloque decorativo «Mi espacio personal» del sidebar compartido de privado/demo, incluido el menú móvil. Eliminados su icono y estilos exclusivos; conservada separación entre marca y navegación.
- npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni integración; pendiente revisión visual responsive. Sin cambios de reglas ni persistencia.


## Meta del Resumen sin frase de importe restante · 19/11/2026

- Retirada la frase dinámica «A S/ … de lograrlo» de la meta del Resumen compartido por privado/demo; ajustado el espacio antes del acceso a la meta y eliminado el import sin uso.
- npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni integración; pendiente revisión visual. Sin cambios de reglas monetarias ni persistencia.


## Visibilidad del saldo en Resumen · 18/11/2026

- Añadido control para ocultar y mostrar el saldo en cuentas en privado y demo. El avatar elegido muestra lentes de sol con animación, respetando movimiento reducido. El estado es temporal y no oculta otras cifras del panel.
- Build y typecheck aprobados. Sin cambios de persistencia ni cálculos; no se ejecutaron pruebas de integración ni QA de navegador. Pendientes revisión visual responsive, teclado y temas.

## Presupuestos sin etiqueta Dentro del límite · 18/11/2026

- Retirada «Dentro del límite» de las tarjetas de presupuesto en privado/demo, sin dejar una etiqueta vacía. Se conservan los avisos de cercanía/exceso del límite.
- npm run build y npm run typecheck aprobados; cambio revisado por inspección y git diff --check correcto. Sin QA nuevo de navegador ni integración; pendiente revisión visual. Sin cambios de reglas monetarias ni persistencia.


## Títulos de presupuestos y metas sin contadores · 18/11/2026

- Retirados los totales junto a «Tus presupuestos» y «Tus metas» de Planificación en privado/demo, además del estilo exclusivo del contador de metas.
- npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni integración; pendiente revisión visual. Sin cambios de reglas ni persistencia.


## Presupuestos sin resumen agregado · 18/11/2026

- Retirado el bloque de porcentaje utilizado, importe por utilizar y total presupuestado de Planificación en privado/demo. Las tarjetas de presupuesto ocupan todo el ancho disponible y conservan sus importes/progreso individuales.
- Eliminados cálculos y estilos exclusivos del resumen. npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni integración; pendiente revisión visual responsive. Sin cambios de reglas ni persistencia.


## Pagos sin botón Ver mis pagos · 18/11/2026

- Retirado «Ver mis pagos» del panorama superior de Pagos futuros en privado/demo y sus estilos exclusivos.
- npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. Sin QA nuevo de navegador ni integración; pendiente revisión visual. Sin cambios de reglas ni persistencia.


## Billetera sin etiqueta Tu dinero · 18/11/2026

- Retirada la frase «Tu dinero» de la cabecera de cuentas dentro de Tu billetera, compartida por privado y demo.
- npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. Sin QA nuevo de navegador; pendiente revisión visual. Sin cambios de reglas ni persistencia.


## Categorías sin contadores · 18/11/2026

- Retirados los tres totales junto a Categorías, Gastos e Ingresos en el componente compartido de privado/demo y sus estilos exclusivos.
- npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. Sin QA de navegador ni pruebas de integración nuevas; pendiente revisión visual. Next regeneró next-env.d.ts con referencias de tipos del build, sin edición manual.


## Campana de notificaciones · 17/11/2026

- Nueva entrada compartida en cabecera con panel de estado futuro, diseño adaptable a temas y movimiento reducido. No existe todavía una fuente de notificaciones ni se presentan avisos inventados.
- `npm run build` y `npm run typecheck` aprobados. No se ejecutaron pruebas de navegador, integración ni suite local para este cambio visual; pendientes revisión responsive, teclado y paletas.
## Cabecera de pagos sin mes · 17/11/2026

- Retirado el indicador mensual junto al título Pagos futuros en privado/demo; Planificación conserva el suyo. Se mantienen las fechas de vencimiento y la navegación mensual propia del calendario.
- Build y typecheck aprobados; cambio revisado por inspección y git diff --check correcto. Sin nuevas pruebas de navegador, unitarias ni integración; pendiente revisión visual de esta cabecera.

## Retirada de filtros de pagos · 17/11/2026

- Eliminada la fila Todos / Próximos 7 días / Vencidos y su estado de filtrado en Pagos futuros, compartido por privado y demo. La agenda y el calendario reciben todos los pagos ordenados por vencimiento; se conservan selector Calendario/Lista, selección de día y contadores del panorama superior. Estados vacíos sin referencias a filtros retirados.
- Build y typecheck aprobados; diff revisado y git diff --check correcto. Cambio de presentación sin reglas ni persistencia nuevas; no se repitieron pruebas unitarias, integración ni QA de navegador. Pendiente revisión visual de la agenda tras esta retirada.

## Pagos futuros desde un modal · 17/11/2026

- «Añadir pago futuro» reemplaza «Sin descontar del saldo» en la cabecera de la agenda, en privado y demo. Se retira su desplegable y se reutiliza el mismo flujo modal que presupuestos: borrador conservado al cerrar/error, bloqueo durante envío, cierre tras éxito y mensajes de resultado.
- Se mantienen campos y opciones manual/automático, cuenta, moneda, fecha y hora de Lima; sin cambios de reglas, acciones, persistencia ni migraciones. Estilos compartidos de la acción/modal renombrados de forma neutral para ambos formularios.
- Verificación nueva: npm run build y npm run typecheck aprobados; inspección del diff y git diff --check correctos. No se repitieron pruebas unitarias, integración ni QA de navegador. Pendientes revisión responsive del modal de pago y flujos privados de guardado/error/espera con fixture. El QA de navegador de la entrada anterior corresponde al modal de presupuesto. Sin publicación ni datos reales.

## Presupuestos desde un modal · 17/11/2026

- «Añadir presupuesto» reemplaza «Este mes · PEN» en la cabecera de Tus presupuestos, tanto en privado como en demo. Abre el formulario «Añadir o ajustar presupuesto» en un diálogo nativo; se retira el desplegable inferior del presupuesto. Los pagos conservan su formulario desplegable.
- Reutilizado el modal existente con título configurable y valor predeterminado intacto para movimientos: Escape/exterior/cierre, foco restaurado, bloqueo de scroll y cierre bloqueado al guardar. El borrador se conserva al cerrar y ante error; éxito limpia el importe y cierra. Mensaje de error dentro del modal y confirmación de éxito junto al botón. Sin cambios de reglas ni persistencia.
- Verificación nueva: build y typecheck aprobados, diff revisado y git diff --check correcto. QA de demo en navegador local: apertura desde cabecera, fondo aislado, cierre Escape con foco devuelto al botón, reapertura con importe 125.50 conservado tras escribir 125,50 e inspección visual del modal. Demo mantiene guardado deshabilitado. No se ejecutaron pruebas unitarias ni integración; pendientes guardado/espera/error privados con fixture y revisión a 320/390 px, escritorio amplio, oscuro y otras paletas. Sin publicación ni datos reales.

## Metas dentro de Planificación y pagos independientes · 17/11/2026

- Planificación reúne presupuestos y metas de ahorro, con sus formularios y aportes existentes. Pagos futuros ocupa el antiguo lugar de Metas y ahorro en el menú compartido, con calendario/lista, filtros, alta y confirmación/cancelación propios. El panorama de próximos pagos acompaña a esta sección independiente.
- Privado y demo comparten la nueva composición; el acceso del Resumen a metas abre Planificación (con ancla a metas en privado). La URL privada antigua seccion=metas sigue abriendo Planificación. No se modifican reglas monetarias, acciones, persistencia ni migraciones.
- Validación nueva: npm run build y npm run typecheck aprobados; diff revisado y git diff --check correcto. El primer build encontró spawn EPERM y se repitió con permisos de ejecución; una condición redundante de demo detectada por TypeScript se corrigió antes del build final. No se ejecutaron pruebas unitarias, integración remota ni QA de navegador; quedan pendientes la revisión visual responsive y los flujos privados con fixture tras esta reorganización. Sin publicación ni datos reales.

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


## Rediseño de planificación y pagos futuros · 16/11/2026

- Sustituidos los dos paneles dominados por formularios por una cabecera con avatar/calendario, próximo compromiso, resumen circular de presupuestos, tarjetas con iconos/progreso/disponible y agenda de vencimientos. Filtros Todos, Próximos 7 días (hoy incluido) y Vencidos; importes exactos y estados vacíos breves. Mismo diseño en privado/demo, con ejemplos fijos de noviembre de 2026 y guardado demo deshabilitado explícitamente.
- Formularios desplegables con borradores conservados, normalización decimal y bloqueo durante envío. Confirmación contextual de pago/cancelación y mensajes controlados en Server Actions; autenticación, transacciones e idempotencia existentes intactas. Foco dirigido a Volver al abrir confirmación y al encabezado de agenda tras éxito. Estos flujos privados se revisaron por código, no por navegador autenticado.
- Nuevos componentes planning-workspace, planning-form y planning-demo; PlanningPanel conecta las acciones existentes. Temas, modo oscuro, entradas animadas y respeto por movimiento reducido; sin dependencias, migraciones ni cambios al motor de planificación. Se conservaron los cambios locales previos en la rama codex/resumen-premium.
- Verificación nueva: npm run build y npm run typecheck finales aprobados. Diff de la entrega revisado y git diff --check correcto. Primer build bloqueado por spawn EPERM; repetido con permisos de ejecución. Corregida una comparación de sección que TypeScript detectó al retirar la cabecera anterior. npm test: 23/26; fallan contraste fox: deep/accent y dos expectativas de crédito por byCurrency/bank_code, ajenas a los archivos de esta entrega. No se reejecutó integración remota.
- QA de demo sobre build local en 127.0.0.1:3001: presupuestos S/ 1,250.00, utilizados S/ 237.00 y disponibles S/ 1,013.00; Todos muestra 2 pagos, Próximos 7 días solo Internet y Vencidos el estado vacío. Despliegue de pago con campos deshabilitados y aviso de demo; tigre aplicado y formulario oscuro inspeccionado a 320 px. Revisión de disposición a 390 px y mediciones de ambos anchos sin desbordamiento horizontal (scrollWidth 375/305 frente a innerWidth 390/320). Consola sin errores capturados y viewport restaurado al terminar.
- Pendiente: QA privado con fixture de alta/ajuste, confirmación/cancelación, fallo/espera y revalidación; teclado exhaustivo, movimiento reducido y restantes paletas. La planificación multimoneda no se resuelve en esta entrega: conserva el modelo PEN anterior y debe revisarse antes de usar cuentas USD en este módulo. No se publicó ni se introdujeron datos financieros reales.

## Cierre tras eliminar movimientos · 16/11/2026

- Corregido el diálogo de eliminación: tras una respuesta exitosa ahora se cierra explícitamente antes de limpiar el movimiento, evitando que el fondo modal deje bloqueada la pantalla.

## Espacio entre banco y cuenta · 16/11/2026

- Aumentado el margen inferior del nombre del banco para separar mejor el encabezado de las tarjetas de cuentas.

## Espaciado de grupos bancarios · 16/11/2026

- Aumentado el espacio entre el nombre del banco y la primera tarjeta de cuenta para mejorar la separación visual.

## Diseño unificado de tarjetas · 16/11/2026

- Ajustado el frente de las tarjetas de crédito para igualarlo visualmente al de las cuentas, manteniendo intactos deuda, línea, progreso y registro de pagos.
- Validación ejecutada: `npm run typecheck`, `npm run build` y `git diff --check` correctos. No se realizó QA de navegador en esta entrega.

## Acceso al alta de categorías · 16/11/2026

- Reubicado el menú existente «Nueva categoría» en la esquina superior derecha de la cabecera; se retiraron los tres iconos decorativos y se conserva el contenido del formulario.
- Ajustado el despliegue: el botón queda junto al título, pero el formulario abierto aparece debajo de la cabecera y antes de Gastos, no al lado de «Categorías».
- Corregido el borde residual del panel cerrado; ya no deja una línea visible cuando el menú no está abierto.
- Añadido más espacio inferior al panel abierto para separarlo visualmente del grupo Gastos.
- Validación ejecutada: `npm run typecheck`, `npm run build` y `git diff --check` correctos. No se realizó QA de navegador en esta entrega.

## Saldo inicial al crear cuentas · 16/11/2026

- Añadido el campo opcional «Saldo inicial» al alta de cuentas privada y demo. El importe se suma directamente al saldo de la cuenta y no aparece como ingreso en Movimientos.
- Nueva migración `012_account_opening_balance.sql`, con cero por defecto para cuentas existentes y validación de importes positivos con hasta dos decimales.
- Validación ejecutada: `npm run typecheck`, `npm run build` y `git diff --check` correctos. `npm run db:migrate` aplicó correctamente `012_account_opening_balance.sql` usando la configuración del proyecto.

## Filtro de moneda en la billetera · 16/11/2026

- El selector PEN/USD de Cuentas filtra las cuentas y tarjetas visibles, sus grupos bancarios y los totales del resumen. La vista USD usa `$` y permite crear una cuenta aunque todavía no existan elementos USD.
- Validación ejecutada: `npm run typecheck`, `npm run build` y `git diff --check` correctos. No se ejecutó QA privado de navegador en esta entrega.

## Etiquetas compactas en billetera · 16/11/2026

- Retiradas las etiquetas «SALDO DISPONIBLE», «Crédito disponible» y «CRÉDITO · PEN» de las tarjetas visuales de cuentas y crédito. El importe permanece sin cambios; el resumen superior conserva el dato con la etiqueta corta «Crédito».
- El lápiz de edición queda alineado en la esquina superior derecha de las tarjetas de cuentas y crédito.
- Validación pendiente de ejecutar en esta entrega.

## Edición del banco de una cuenta · 16/11/2026

- Corregido el diálogo de edición: el estado y la acción ya existentes para `bank_code` ahora se exponen mediante un selector visible, con catálogo agrupado, valor actual precargado y botón «Guardar cambios».
- La demo conecta el selector de banco tanto al alta como a la edición y actualiza la agrupación visual sin tocar saldos ni movimientos.
- Validación ejecutada: `npm run typecheck` y `npm run build` correctos; `git diff --check` correcto. La prueba secuencial de cuentas pasa. La suite local completa queda en 23/26 por tres fallos históricos no relacionados (`fox: deep/accent` y dos aserciones antiguas de crédito/monedas). No se hizo QA privado de navegador ni se modificó la base de datos.

## Agrupación visual por banco · 16/11/2026

- La sección Cuentas ahora divide las tarjetas de cuentas por banco, manteniendo ordenación, altas y acciones dentro de cada bloque. Se conserva el diseño compacto y responsive.
- Validación: `npm run typecheck` y `npm run build` correctos. No se ejecutó QA privado de navegador en esta iteración.

## Banco asociado a cuentas y tarjetas · 16/11/2026

- Añadido catálogo cerrado y selector agrupado por sub-secciones al crear cuentas; el servidor valida el banco y persiste `bank_code`. Las tarjetas aceptan el mismo dato y lo conservan al editar.
- Aplicada `011_account_bank.sql` en la base de pruebas autorizada. Build, typecheck y diff estructural correctos. La creación de tarjeta mantiene compatibilidad con tarjetas antiguas; queda pendiente revisión visual privada del nuevo selector de tarjeta.

## Monedas por cuenta · 16/11/2026

- Implementado selector PEN/USD al crear cuentas en privado y demo, etiqueta de moneda en selectores de movimientos y símbolo dinámico S/ o $. Los movimientos solo permiten la moneda de la cuenta origen; transferencias cruzadas se rechazan con mensaje claro.
- Añadida migración `010_account_currency.sql` compatible con datos existentes (PEN por defecto), lectura de moneda en dashboard y desglose `totals.byCurrency` para no mezclar saldos. No hay conversión automática ni tipo de cambio.
- Validación ejecutada: `npm run build`, `npm run typecheck` y `git diff --check` correctos. No se ejecutó integración remota ni QA privado de navegador en esta entrega.

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

- Cada tarjeta permite editar nombre, ingreso/gasto e icono, con errores conservando datos y bloqueo al guardar. Borrado mediante diálogo nativo con foco inicial en Conservar categoría, Escape/exterior y devolución de foco; estilos responsive y temas existentes.
- Servidor obtiene propietario de requireUser y valida nombre/tipo/icono/duplicados. Categorías usadas admiten nombre/icono; cambio de tipo solo sin movimientos, presupuestos o pagos. Borrado atómico protegido por claves foráneas, sin cascada. Edición y validación de presupuesto comparten bloqueo transaccional de categoría para evitar carreras. Sin migraciones nuevas.
- Demo resuelve nombres del historial y presupuestos ilustrativos mediante IDs estables; edición/borrado en memoria y reinicio al recargar.
- Build final y typecheck correctos. npm test 21/22: tres pruebas nuevas aprobadas y fallo histórico `fox: deep/accent`. Integración específica y general: 10/10 aprobadas juntas en `u519053982_finanzas_test` con TLS, identidades ficticias y limpieza. Cubren propiedad, duplicados, referencias, cambio de tipo, borrado, concurrencia con presupuestos e historial/saldos intactos. Un marcador adicional introducido al adaptar saveBudget causó un primer fallo; corregido y ambas integraciones repetidas completas con éxito. No se reejecutaron los demás archivos de integración.
- QA demo: duplicado/cambio de tipo usado conservan campos con error; Alimentación→Comida actualiza historial sin cambiar importes ni total S/ 3,963.00. Borrado usado bloqueado; categoría sin uso cambia nombre/tipo/icono y se elimina con confirmación y foco a otra tarjeta. Conservar/Escape cierran diálogo; recarga restaura ejemplos. Editor inspeccionado en escritorio claro, 320 px claro y 390 px oscuro; diálogo claro a 320 px. Sin desbordamiento horizontal medido a 320/390 px ni errores de consola capturados; viewport restaurado. Pendientes interfaz privada ficticia, espera/error reales, resto de temas y teclado exhaustivo. Sin publicación ni datos reales.

## Configuración personal · 15/11/2026

- Nueva sección compartida Configuración en privado y demo, accesible desde sidebar y menú de perfil. Cabecera con avatar aplicado, tarjetas de acceso/seguridad, formularios desplegables y bloque visual de futuros métodos de pago/tarjetas marcado como no disponible. Moneda, idioma y zona horaria son informativos. CSS Module con temas, modo oscuro, responsive, foco y movimiento reducido; sin dependencias ni recursos externos nuevos.
- Cambio real de correo/contraseña en privado mediante Server Action autenticada. Requiere contraseña actual; valida correo normalizado, clave de 12–128 caracteres y confirmación. Limita a ocho intentos por usuario en ventana persistente de 15 minutos, comprueba sesión vigente dentro de transacción, bloquea usuario, conserva errores y revoca todas sus sesiones al guardar. Cookie eliminada y acceso posterior por login. El correo cambia inmediatamente, sin servicio de verificación por email; la interfaz lo explica antes de guardar. No implementa recuperación de acceso.
- Demo permite desplegar formularios, con campos/guardado deshabilitados y aviso de vista previa; no recibe credenciales ni llama acciones privadas. Métodos de pago/tarjetas son exclusivamente un espacio futuro, sin altas, cobros ni almacenamiento de tarjetas. Se preservaron los cambios locales anteriores de cuentas/categorías/metas.
- Validación nueva: build y typecheck correctos; dos pruebas locales de configuración aprobadas. Suite local 18/19: persiste el fallo histórico de contraste fox: deep/accent. Integración específica de configuración aprobada en u519053982_finanzas_test con TLS, dos usuarios ficticios y limpieza comprobada: contraseña incorrecta, sesión de otro usuario, correo duplicado con rollback, cambio de correo/clave, revocación de sesiones, rechazo de sesión revocada, aislamiento y límite persistente. Integración añadida al comando general; no se reejecutó toda la integración. El primer intento se detuvo antes de conectar por TEST_DB_NAME ausente; reejecución con destino explícito aprobada.
- QA nuevo de demo: navegación al módulo, apertura/cierre del formulario de clave, enlace desde perfil y aplicación de tigre oscuro; inspección clara/oscura en escritorio y móvil 320/390 px, sin desbordamiento horizontal medido a ambos anchos ni errores de consola capturados. Corregido conflicto global del color del h1. Viewport restaurado. Pendientes QA privado de navegador para guardado/error/espera y vuelta al login, teclado completo, movimiento reducido y restantes paletas. Sin publicación, migraciones ni datos financieros reales.


## Opciones de edición y eliminación de cuentas · 15/11/2026

- Menú nativo discreto en cada tarjeta con editar nombre y eliminar. Diálogos nativos con preview de nombre/saldo, foco, Escape/cierre exterior, errores conservando entrada y controles bloqueados mientras guardan. Confirmación de eliminación enfoca Conservar; eliminar devuelve foco a tarjeta restante o Nueva cuenta. Áreas de opciones no inician arrastre ni propagan flechas de inputs al orden de tarjetas.
- Nuevas Server Actions autenticadas y utilidades `accounts.mjs`: renombrado acotado a usuario con validación/duplicados y eliminación atómica restringida por claves foráneas. Cuenta con movimientos (origen o destino), metas o pagos no se elimina, aunque saldo cero; se informa sin borrar/vaciar relaciones. No hay cambios de esquema, cascadas, ajustes de saldo o registros financieros. Demo actualizada a referencias de cuenta por ID para conservar saldos e historial tras renombrar; cambios/altas/bajas solo en memoria.
- `npm test`: 16/17, incluidas tres nuevas correctas; persiste fallo histórico de contraste `fox: deep/accent`. Integración específica `accounts-integration.mjs` aprobada exclusivamente en base de pruebas con TLS y dos usuarios ficticios limpiados. Comprueba renombrado/no-op/duplicado/dueño ajeno, nombres unidos a movimientos, transferencias de ida/vuelta con saldo cero que impiden borrar, protección de metas/pagos y borrado solo de cuenta vacía. Ningún historial o saldo alterado. TEST_DB_NAME fijado únicamente en proceso tras comprobar nombre/TLS; archivos privados intactos. Se añadió esta integración al comando conjunto, sin reejecución general nueva.
- Build final y typecheck correctos; diff revisado y diff --check correcto. QA demo: duplicado conserva nombre; renombrado Efectivo→Billetera aparece en cuatro filas; cuenta con historial rechaza eliminar. Cancelar conserva Ahorros y confirmarla elimina sin cambiar S/ 3,963.00. Escape restaura foco; borrado deja foco en otra tarjeta y libera scroll. Nueva Caja tras borrado reordena con teclado; edición a Caja chica en móvil y arrastre real posterior correctos.
- Inspección de menú/diálogos en escritorio claro y 320/390 px oscuro; medidas sin desbordamiento horizontal ni errores de consola capturados. Viewport restaurado. Pendientes interfaz privada con fixture aislado, espera/error reales, resto de temas y táctil. Sin migraciones, publicación ni datos reales.

## Tarjetas de cuentas sin control de puntos · 15/11/2026

- Eliminado el control de puntos y su CSS. Arrastre desde toda la tarjeta, cursor de mano grab/grabbing y animación breve de elevación/balanceo al hover. La tarjeta sigue el puntero dentro de la cuadrícula; umbral de movimiento evita tratar un clic como arrastre. Captura en grid estable, cancelación con Escape/pointercancel y guardado/rollback conservados. Ordenación por flechas de teclado en la tarjeta, foco visible, ayuda accesible y movimiento reducido; pan-y permite scroll táctil nativo.
- Build y typecheck correctos; diff revisado y diff --check correcto. Demo: ArrowRight reordena, arrastre real desde centro de Efectivo a Ahorros devuelve el orden y anuncia guardado. Cursor grab y animación readyToMove comprobados mediante DOM; sin botones interiores. Inspección/medición a 320 px sin desbordamiento, sin errores de consola capturados. Viewport restaurado.
- Sin nuevas pruebas unitarias, integración remota, QA privado o publicación. Pendientes táctil real, cancelación, espera/error, movimiento reducido y otros temas.

## Tarjetas de cuentas simplificadas · 15/11/2026

- Eliminadas las flechas visibles de ordenación y las rayitas/ondas a la derecha del chip, junto con su CSS exclusivo. El control de puntos mantiene arrastre y permite reordenar con flechas de teclado; ayuda accesible sin texto visible adicional. Persistencia existente intacta.
- Build y typecheck correctos; diff revisado y diff --check correcto. Demo inspeccionada en escritorio: elementos retirados; orden con ArrowRight y regreso con ArrowLeft comprobados. Sin pruebas unitarias, QA privado, integración remota ni publicación nuevos.

## Rediseño de categorías con iconos · 15/11/2026

- Nueva sección compartida de categorías en Cuentas: tarjetas visuales con 16 iconos SVG originales, fondos suaves y edición al pulsar la tarjeta. Gastos/ingresos separados con cabeceras breves. Formulario de creación con tipo segmentado, nombre, iconos nativos seleccionables por teclado y vista previa. CSS Module con temas, oscuro, móvil y movimiento reducido; se mantienen cuentas y reglas financieras.
- Persistencia nueva: `categories.mjs` crea categorías con icono y permite cambiarlo por propietario. Catálogo cerrado validado en aplicación y CHECK de base; icono nullable para datos anteriores, con sugerencia visual por nombre y fallback seguro. `readDashboard` entrega icono. Ambas Server Actions obtienen propietario con requireUser; no reciben user_id del cliente. Edición atómica solo de icono, sin tocar nombre/tipo/saldo.
- Migración 008 aplicada exclusivamente a la base autorizada de pruebas, confirmando nombre y TLS antes de conectar; ejecutor con checksum/bloqueo. TEST_DB_NAME estaba ausente y se fijó únicamente en el proceso de validación al nombre de la base ya comprobada, sin modificar archivos privados. Integración específica nueva aprobada: dos usuarios ficticios, crear/leer/editar, guardar mismo icono, rechazo de dueño ajeno/valor inválido/duplicado, CHECK en SQL, compatibilidad null y ningún movimiento/saldo alterado. Limpieza comprobada. El script test:integration ahora incluye cuatro archivos; en esta entrega solo se ejecutó la integración de iconos.
- Build final y typecheck correctos en Node 24.21.0 local. npm test 13/14: tres pruebas nuevas aprobadas; persiste fallo histórico de contraste `fox: deep/accent`. Primer intento local del runner bloqueado por EPERM; suite repetida con permisos ampliados. Diff revisado y diff --check correcto. No se cambiaron dependencias ni migraciones anteriores.
- QA nuevo de demo con build local en 3001: creación de Mascotas con huella y de Ingreso extra con Sueldo; duplicado conserva datos; icono existente/editado a Viajes se refleja y permanece al navegar. Recarga reinicia ejemplos. Radios responden a flecha derecha, editor recibe foco y cerrar/aplicar lo devuelve a tarjeta. Inspección clara escritorio/390 px y oscura a 320 px del editor y creador; mediciones a 320/390 px sin desbordamiento, sin errores de consola capturados. Viewport restaurado.
- Pendientes: interfaz privada con fixture ficticio (incluidos espera/error), vacíos, restantes paletas y accesibilidad exhaustiva. Integración funcional no sustituye QA privado de navegador. Sin publicación ni datos reales.

## Formulario de metas menos saturado · 15/11/2026

- Más espacio interior y entre grupos, etiquetas menos pesadas y sugerencias visualmente secundarias, conservando ideas/importes rápidos. Retirados números, título interior redundante y texto adicional de cabecera; etiqueta de vista previa simplificada. Se conserva formulario responsive con avatar 3D, validación y acciones.
- Build y typecheck correctos; diff revisado y diff --check correcto. QA de demo clara en escritorio y 320 px; medidas a 320/390 px sin desbordamiento horizontal. Viaje y S/ 1200 actualizan campos, entrada 875,50 normalizada a 875.50; sin errores de consola capturados. Viewport restaurado.
- Sin pruebas unitarias, QA privado, integración remota, migraciones o publicación nuevos; pendientes resto de temas y accesibilidad completa.

## Indicadores y frase retirados de Nueva meta · 15/11/2026

- Eliminados «Nombre · Objetivo · Cuenta» y el texto inferior «Una idea hoy. Un logro mañana.» junto con su variante de formulario preparado. Se retiran cálculos y CSS exclusivos, conservando el contenido principal de la vista previa y los campos reales.
- Build y typecheck correctos; diff revisado y diff --check correcto. Demo inspeccionada en escritorio: sin indicadores ni frase en la vista previa. Sin QA privado, pruebas unitarias, integración o publicación nuevos.

## Tarjetas de metas con avatar 3D · 15/11/2026

- Cabecera de cada tarjeta compartida usa VacationAvatar en lugar de la cumbre, siguiendo selección aplicada sin afectar progreso, importes ni acciones. Se conservan los recursos existentes; sizes configurable distingue tarjetas (138 px) y vista previa del formulario. El vacío conserva su cumbre SVG.
- Build y typecheck correctos; diff revisado y diff --check correcto. QA nuevo de demo: koala inicial visible; probar zorro sin aplicar no cambia la tarjeta; aplicar zorro, gato, conejo, oso y tigre carga la imagen correcta, con carga completa y ancho natural optimizado de 138 px. Tigre oscuro inspeccionado a 320 px; mediciones a 320/390 px sin desbordamiento horizontal, sin errores de consola capturados. Viewport restaurado.
- Sin QA privado, pruebas unitarias, integración, migraciones ni publicación nuevos. Pendientes estados alcanzados, varias tarjetas y revisión completa de accesibilidad.

## Ilustración de vacaciones sincronizada con perfil · 15/11/2026

- Añadidas cinco imágenes transparentes 3D con el mismo escenario del koala: zorro, gato, tigre blanco, conejo y oso. Generación integrada imagegen, una llamada por variante con koala como referencia; prompts y rutas finales documentados en `docs/GOAL_VACATION_ASSET.md`. Archivos conservados en `public/images/` dentro del repositorio.
- `VacationAvatar` reutiliza AvatarContext y el catálogo de perfil para escoger importación estática y texto alternativo. Actualiza la ilustración al aplicar perfil sin recrear el formulario ni perder borrador. Vista previa del menú sin confirmar no afecta al personaje; fallback al koala para contexto ajeno al catálogo. Sin nuevas preferencias, reglas, acciones de servidor, dependencias o generación remota en la app.
- Build y typecheck correctos; diff revisado y diff --check correcto. QA nuevo de demo con build local: koala inicial, probar zorro sin aplicar mantiene koala, aplicar zorro y luego gato/tigre/conejo/oso/koala carga el recurso esperado. Los cinco últimos informan carga completa y ancho natural optimizado de 205 px; zorro inspeccionado visualmente. Nombre «Mi próximo viaje» e importe 875.50 conservados durante los cambios. Tigre oscuro inspeccionado a 320 px y gato medido a 390 px, sin desbordamiento horizontal medido; sin errores de consola capturados. Viewport restaurado.
- Pendientes: QA privado ficticio para cargar avatar guardado y confirmar persistencia tras recarga, y accesibilidad completa. No se ejecutaron pruebas unitarias, integración remota ni migraciones; sin publicación o datos reales nuevos.

## Ilustración 3D de vacaciones en Nueva meta · 15/11/2026

- Generado e integrado un koala original 3D en tumbona bajo sombrilla, con fondo transparente. Sustituye el SVG del lado derecho del formulario compartido; en móvil ocupa la imagen lateral de la tarjeta compacta. Se usa un recurso fijo de koala, independiente de la preferencia de perfil. Seleccionar ideas sigue rellenando el nombre; los datos de la tarjeta siguen siendo interactivos.
- Recurso persistido en `public/images/koala-vacation-3d.png`; prompt exacto y modo integrado documentados en `docs/GOAL_VACATION_ASSET.md`. Importación estática/optimización con `next/image`, sin servicio de generación para usuarios ni nuevas dependencias. Retirados SVG y animaciones exclusivos de la ilustración anterior; acciones privadas intactas.
- Build y typecheck correctos, diff revisado y diff --check correcto. QA de demo con build local: imagen cargada/renderizada a 205 px en escritorio, Viaje/S/ 1200 actualizan la tarjeta; a 320 px se conserva presentación compacta, sin desbordamiento horizontal medido. Transparencia revisada sobre tema claro y oscuro de tigre a 320 px; sin errores de consola capturados. Viewport restaurado. Sin sesión privada, pruebas unitarias, integración, migraciones, publicación o datos reales nuevos.

## Bloque hero de metas retirado · 15/11/2026

- Eliminado el bloque `hero` de la vista compartida, sus cálculos de acumulado/conteos y CSS exclusivo, incluidos adornos y animación. «Tus metas», formulario y tarjetas permanecen en demo/privado.
- Build y typecheck correctos, diff revisado y diff --check correcto. Demo inspeccionada en escritorio con build local actualizado: bloque ausente y formulario/tarjeta visibles. Sin QA privado, integración remota, pruebas unitarias o publicación nuevos.

## Compactación del formulario de metas · 15/11/2026

- Se mantiene el estilo interactivo aprobado con menos altura: cabecera y espaciados reducidos, ilustración más pequeña, cuenta/fecha en dos columnas cuando hay espacio y vista previa horizontal en móvil. Textos de campos más breves. Se corrige el doble contorno de foco del importe conservando el del contenedor. Sin cambios de persistencia o validación.
- Build y typecheck finales correctos; diff revisado y diff --check correcto. QA nuevo en demo clara: escritorio inicial, 320 y 390 px, selección de Viaje/S/ 1200 y normalización de 875,50; mediciones a 320/390 px sin desbordamiento. Ajuste final de foco verificado con el build final en navegador (contenedor con contorno, input sin contorno duplicado), sin errores de consola capturados. Viewport restaurado y preview local disponible en 3001.
- Sin pruebas unitarias, integración remota ni sesión privada nuevas. Pendientes revisión privada ficticia de guardado/espera/error, otros temas y accesibilidad completa. Sin publicación ni uso de datos reales.

## Formulario dinámico para crear metas · 15/11/2026

- Nuevo componente compartido `GoalCreateForm`: editor numerado sin pasos bloqueantes y tarjeta que cambia con el nombre, importe y cuenta. Ideas opcionales con avión de papel, paraguas y portátil; cohete para nombre libre. Importes rápidos, cantidad protagonista, marcas de campos preparados y animaciones con alternativa de movimiento reducido. Estilos encapsulados, móviles y temas de avatar conservados.
- Privado conectado a `addGoal` sin cambios de servidor/persistencia. Conserva validaciones, campos ante error y bloqueo de controles/desplegable al guardar. La demo ofrece explorar la vista previa con creación deshabilitada; no crea metas, movimientos ni registros de base.
- Validación nueva: `npm run build` con permisos ampliados y posteriormente `npm run typecheck` correctos; diff revisado y `git diff --check` correcto. QA con build local servido en 3001: elegir las tres ideas, seleccionar importe rápido, escribir 875,50 y comprobar 875.50/S/ 875.50, elegir Ahorros, cerrar/reabrir conservando borrador y usar Enter sobre importe rápido. Inspección clara en escritorio inicial y 320/390 px; oscura a 320/1440 px. Sin desbordamiento horizontal medido en 320/390/1440 px ni errores de consola capturados. Viewport restaurado.
- Pendientes: QA privado ficticio de creación/espera/error, estado sin cuentas, otras paletas y teclado/movimiento reducido completos. No se ejecutaron pruebas unitarias, integración remota ni migraciones; sin publicación ni datos reales.

## Rediseño de Metas y ahorro · 15/11/2026

- Cabecera visual con ahorro acumulado de los aportes y conteos de metas; tarjetas con ilustración SVG original, porcentaje protagonista, barra, importe ahorrado, objetivo y restante. Cuenta/fecha quedan como información secundaria. Se retiran las introducciones redundantes y se compacta el aviso de demo.
- Composición compartida por demo y privado, con CSS Module, paletas de avatar, modo oscuro, responsive y animaciones desactivadas con movimiento reducido. «Nueva meta» y «Aportar» despliegan sus formularios en privado. Conservan acciones existentes y añaden coma decimal normalizada, campos controlados ante errores y bloqueo de controles/desplegable mientras se guarda. request_id se conserva ante error y se renueva después de éxito. Demo conserva una meta ilustrativa al 40%, sin persistencia ni nuevas acciones.
- `npm run build` y después `npm run typecheck`: correctos. Primer build y arranque dev bloqueados por `spawn EPERM` del sandbox; build repetido con permisos ampliados. El primer build con permisos detectó tipos corregidos antes de la compilación final. QA realizado con el build de producción local servido en puerto 3001, sin publicación.
- QA nuevo en demo: inspección koala a 320/390 px y escritorio inicial; aplicar tigre desde perfil e inspeccionar oscuro a 320 y 1440 px. Mediciones DOM a 320, 390 y 1440 px sin desbordamiento horizontal; sin errores de consola capturados. Se restauró el viewport al finalizar. Diff revisado y `git diff --check` correcto.
- No se ejecutaron pruebas unitarias ni integración remota, ni se accedió a una sesión privada. Pendiente verificar creación/aportes con fixture ficticio, espera/errores, vacío/meta alcanzada, teclado completo, movimiento reducido y las otras paletas. Sin migraciones, publicación ni datos reales.

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

## Check de selección y total de cuentas · 17/11/2026

- Quitada la franja de resumen. Los checks empiezan activos y solo alteran el total de «En tus cuentas» de la moneda visible; deuda y crédito no cambian. Nuevas cuentas también empiezan marcadas.
- Migración nueva 014: DEFAULT TRUE y selección inicial de todas las cuentas ya existentes; 013 intacta para conservar el checksum aplicado. La preferencia privada sigue por usuario y demo en memoria.
- Build aprobado. npm test previo 25/28 con fallos históricos en contraste fox y aserciones antiguas de crédito. Build final aprobado. Se corrigió el check con actualización optimista del total y reversión ante error. Las migraciones 013/014 están aplicadas en la base de pruebas. QA visual no completado: CUA detuvo la inspección al no poder determinar con seguridad la URL del navegador.
- git diff --check ejecutado.
# Dinero libre en tarjetas de Cuentas · 19/11/2026

- Cambio de presentación: las tarjetas de Cuentas muestran «Dinero libre» y calculan saldo menos alcancías mediante `accountAllocation`; el saldo total continúa disponible en el detalle y en las acciones de cuenta.
- Alcance compartido por privado/demo, sin cambios de base de datos ni reglas de persistencia. `npm run build`, `npm run typecheck` y `git diff --check` aprobados en esta entrega; no se ejecutaron pruebas de integración ni QA de navegador.

## Tarjetas de Cuentas sin etiqueta de importe · 19/11/2026

- Retirada la etiqueta visible «Dinero libre» de las tarjetas de Cuentas en «Tu billetera»; se conserva el número calculado como saldo menos alcancías. Sin cambios de datos ni reglas.

## Gráficos de gastos con fondos de categoría · 24/11/2026

- Se aplicó a los gráficos del Resumen y del tablero de Categorías la mezcla de color del fondo del icono correspondiente. El avatar tigre blanco mantiene los tonos anteriores y las agrupaciones neutrales no cambian. Demo y privado comparten la implementación.
- Validación nueva: `npm run build`, `npm run typecheck` posterior y `node --test tests/category-insights.test.mjs` aprobados (3 pruebas). Sin QA visual nuevo ni cambios en persistencia; pendiente revisar contraste y diferenciación de segmentos y barras en navegador, temas y tamaños.

## Intensidad de gráficos de categorías · 24/11/2026

- A partir de la captura proporcionada se aumentó la intensidad de los gráficos de 11 % a 24 % del color de categoría; se mantienen los tonos suaves y la excepción del tigre blanco. El ajuste afecta Resumen y Categorías en demo y privado, sin modificar el fondo de los iconos.
- Validación nueva: `npm run build` y `npm run typecheck` posterior aprobados. Sin revisión nueva en navegador; sigue pendiente comprobar visualmente la diferenciación de colores en otros temas y tamaños.

## Más intensidad en gráficos · 24/11/2026

- Aumentada de 24 % a 34 % la proporción de color en los gráficos de gastos compartidos por demo y privado. El tema tigre blanco conserva sus colores. `npm run build` y `npm run typecheck` posterior aprobados; sin nueva revisión visual en navegador.

## Métricas retiradas del tablero de categorías · 24/11/2026

- Retirado el bloque de tres métricas de gastos por categoría y sus estilos y cálculos exclusivos. Los gráficos, filtros y estado vacío se conservan en demo y privado. `npm run build` y `npm run typecheck` posterior aprobados; sin revisión visual nueva en navegador.

## Superficies blancas por avatar · 24/11/2026

- Cambiada a #ffffff la superficie de zorro, conejo y oso; gato ya usaba ese valor. Koala y tigre blanco conservan sus superficies. Afecta las áreas que usan `--theme-surface` en demo y privado.
- Validación: build, typecheck y comprobación puntual de los seis valores aprobados. La prueba de contraste de avatares vuelve a fallar por la combinación previa zorro deep/accent, ajena a la superficie; la prueba del tigre pasa. Sin QA nuevo en navegador.

## Gráfico de distribución sin texto central · 24/11/2026

- Retirados el contador y la etiqueta de categorías superpuestos al gráfico de distribución. La leyenda, los porcentajes y el ranking siguen disponibles en demo y privado. `npm run build` y `npm run typecheck` posterior aprobados; sin revisión nueva en navegador.

## Orden de bancos en la billetera · 24/11/2026

- En modo Ordenar, flechas suben o bajan los grupos de banco conservando el orden de sus cuentas y agrupando también sus cuentas de la otra moneda. El orden se guarda con el mecanismo existente y revierte ante error. El orden de tarjetas envía todas las cuentas al servidor, corrigiendo el envío parcial por grupo; demo conserva el orden en memoria.
- Validación nueva: `npm run build`, `npm run typecheck` posterior y cuatro pruebas locales de `wallet-order.test.mjs` y `account-order.test.mjs` aprobados, incluidos múltiples bancos/monedas y aislamiento del propietario con conexión simulada. Sin migración, integración remota ni QA interactivo nuevo; pendiente verificar recarga privada con fixture, errores/espera, teclado y responsive.
