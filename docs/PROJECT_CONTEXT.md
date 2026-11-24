## Iconos de categoría en el historial · 23/11/2026

- El historial general y el de cada cuenta muestran el icono y tono vigentes junto al nombre de la categoría. El modo automático utiliza el tono del icono. Las transferencias muestran su destino. La lectura privada usa la unión existente por categoría y propietario.
- Build y typecheck aprobados. En Chrome se cambió el icono y el color de Alimentación en demo y se verificó la coincidencia en ambos historiales. Sin migración ni comprobación privada nueva.

## Color del icono de categoría · 23/11/2026

- Las categorías admiten ámbar, verde, azul, violeta, rosa y arena. «Automático» utiliza el tono del icono elegido, también para categorías anteriores. El selector de alta y edición ofrece vista previa y admite teclado. Las superficies del icono en Categorías, confirmación de eliminación y presupuestos reutilizan la misma paleta con tonos para el tema oscuro.
- La migración 020 añade el identificador opcional de color con una restricción de catálogo. La configuración se guarda por categoría del propietario y la demo la conserva en memoria. Build, typecheck, pruebas de categorías, integración y QA de alta/edición con recarga privada aprobados. Se mantiene el fallo histórico de contraste del avatar zorro en la suite general.

## Alta de cuentas desde el encabezado · 23/11/2026

- «Nueva cuenta» es una acción general de Cuentas, disponible antes de los grupos de bancos y también con la lista vacía. El usuario elige el banco en el formulario. Demo y privado comparten el encabezado, y la demo abre el formulario con el banco por seleccionar y lo cierra al crear la cuenta.
- Build, typecheck posterior y QA de demo en escritorio y móvil aprobados. Pendiente repetición en sesión privada.

## Identidad visual de cuentas por banco · 23/11/2026

- Las cuentas de efectivo y ahorro en la billetera derivan su apariencia del banco guardado. Las diez entidades del selector tienen una paleta y una trama propias. El encabezado del grupo, la tarjeta y el detalle comparten esos colores. El nombre del banco sigue visible y las cuentas sin entidad asignada usan «Sin banco» y gris pizarra.
- La cuenta ficticia Ahorros de la demo usa BCP. Efectivo ilustra el estado sin banco. La identidad se calcula al mostrar la cuenta, también después de editarla. Los datos privados y su esquema permanecen intactos.
- Se verificaron build, typecheck, seis pruebas locales de cuentas y la interacción en Chrome con las diez entidades; el detalle de la revisión responsive y del tema oscuro figura en STATUS.

## Etiqueta del filtro de mes · 23/11/2026

- Retirada la etiqueta visible «Mes» del filtro de gastos por categoría; el selector conserva su nombre accesible. Cambio compartido por demo y privado. Build y typecheck aprobados; sin revisión nueva en navegador.

## Textos bajo barras del ranking · 23/11/2026

- Retirados los porcentajes y recuentos bajo las barras del ranking de gastos por categoría en demo y privado. Se conservan categorías, importes y barras. Build y typecheck aprobados; sin revisión nueva en navegador.

## Textos secundarios de gastos por categoría · 23/11/2026

- Retirados los tres textos small debajo de las cifras principales del tablero de gastos por categoría, compartido por demo y privado. Se conservan cifras, ranking y cálculos. Build y typecheck aprobados; sin revisión nueva en navegador.

## Catálogo peruano de tarjetas de crédito · 23/11/2026

- En Cuentas y Configuración, «Nueva tarjeta» solicita banco, red y modelo en ese orden. «Otros» permite registrar un banco o modelo a mano y «Otra red» admite el nombre de una red adicional. La vista previa y la billetera comparten ilustraciones locales inspiradas en el emisor y el acabado del modelo.
- La selección de noviembre reúne 64 combinaciones. Se contrastaron las listas públicas de [BCP](https://www.viabcp.com/tarjetas/tarjetas-credito), [BBVA](https://www.bbva.pe/personas/productos/tarjetas/credito.html), [Interbank](https://interbank.pe/tarjetas/tarjetas-credito), [Scotiabank](https://www.scotiabank.com.pe/Personas/tarjetas/credito), [Banco Falabella](https://www.bancofalabella.pe/tarjetas-credito-cmr/comparador) y [Banco Ripley](https://www.bancoripley.com.pe/tarjetas/tarjeta-mastercard-ripley.html). El catálogo es una selección local fechada. Las futuras revisiones de oferta o diseño requieren actualizarlo.
- En privado la migración 019 incorpora red y modelo opcionales al registro existente de la tarjeta. Las tarjetas antiguas conservan su nombre y pueden asociarse a un modelo desde «Editar tarjeta». El alias se puede cambiar independientemente del diseño. La demo conserva los cambios en memoria.
- Se verificaron compilación, tipos, integración de crédito en la base exclusiva de pruebas, el selector en demo a tres anchos y el cambio de modelo y alias tras recargar una sesión privada ficticia. La suite local conserva un fallo previo de contraste del tema zorro. Resultados en STATUS.

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

# Contexto y decisiones

## Registro desde el login · 23/11/2026

- Por solicitud del usuario se habilita el alta desde login, sustituyendo el acuerdo anterior de registro cerrado. Correo normalizado, contraseña de 12–128 caracteres y confirmación; cuenta sin privilegios administrativos, sin cuentas financieras y con siete categorías propias. La instalación debe tener primero un administrador inicial. El usuario inicia sesión después del alta; respuesta genérica ante correo existente sin modificarlo.
- Alta transaccional con scrypt existente y límites persistentes separados (global y por correo) de 15 minutos. No se verifica la titularidad del correo, no se envía correo y no existe recuperación automática; estas capacidades y los controles de producción siguen pendientes antes de publicar o usar datos reales. Sin migración ni despliegue.
- Validación: build y typecheck aprobados, prueba local de validación e integración específica en base exclusiva TLS aprobadas: alta concurrente única, hash, ausencia de rol administrador, datos iniciales aislados, login/logout, duplicado sin cambiar contraseña y límite por correo. Identidad ficticia y sus buckets individuales eliminados; el contador global de registro de pruebas permanece sujeto a su ventana normal. El primer intento de integración se detuvo antes de conectarse por faltar TEST_DB_NAME; repetido con nombre confirmado. Pendiente QA de navegador, accesibilidad y responsive.

## Tarjetas de cuenta con banco y nombre · 23/11/2026

- Título compartido de las tarjetas cambiado a Banco - nombre de cuenta, retirando la moneda del título. Sin banco configurado muestra Sin banco. Importe conserva su símbolo monetario; sin cambios de datos, selección ni orden.
- npm run build y typecheck posterior aprobados; cambio revisado y git diff --check correcto. Sin nuevas pruebas de reglas ni QA de navegador; pendiente revisión visual responsive. Cambios locales previos conservados.

## Textos del tablero de categorías · 23/11/2026

- Simplificado el tablero compartido: títulos directos, estado vacío breve y menos texto repetido. Se conservan filtros, cifras, porcentajes y contexto de la comparación. Sin cambios de cálculos o datos.
- Validación: build y typecheck aprobados y diff comprobado. Sin QA nuevo de navegador; siguen pendientes las revisiones visuales y de interacción documentadas para el tablero.

## Tablero de gastos por categoría · 23/11/2026

- Bajo Categorías, privado y demo muestran análisis por mes civil y moneda PEN/USD: total, categoría principal, variación absoluta frente al mes anterior, distribución y ranking completo con recuentos. Gastos de cuentas y tarjetas cuentan; ingresos y transferencias no. La demo usa sus movimientos en memoria y noviembre de 2026 como mes inicial. Sin conversión ni mezcla de monedas.
- Agregación en céntimos BigInt con datos de movimientos ya filtrados por usuario en el servidor; no se añadieron consultas ni persistencia. Gráficos acompañados de valores textuales, estado vacío y adaptación a movimiento reducido.
- Validación: prueba local específica de agregación aprobada, build y typecheck aprobados. La revisión de navegador no pudo iniciarse por error del entorno (CreateProcessWithLogonW 1920); quedan pendientes QA visual y funcional en 320/390 px y escritorio, teclado, temas, filtros y datos privados ficticios. Sin integración remota ni publicación.

## Apertura y orden de cuentas · 23/11/2026

- La tarjeta abre el detalle de movimientos y alcancías al pulsarla o usar Enter/Espacio; se retiró el enlace visible. Selección del total y edición siguen siendo controles independientes. «Ordenar» activa las manos y el movimiento de las tarjetas; «Listo» vuelve a la apertura. Se conserva el orden por banco, arrastre y flechas, y se respeta movimiento reducido.
- Validación nueva: build y typecheck posteriores aprobados; diff revisado. Sin QA interactivo nuevo: quedan por comprobar la animación, arrastre táctil, teclado y tamaños 320/390 px y escritorio en demo y privado. Sin cambios de reglas o persistencia ni pruebas de integración nuevas.

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

## Detalle de cuenta y cuatro alcancías · 19/11/2026

- Pulsar una cuenta abre su detalle dentro de Cuentas, compartido por privado/demo. Muestra saldo total, reservado y libre, y únicamente movimientos con esa cuenta como origen o destino; conserva filtros y exportación Excel. Las transferencias recibidas/salientes llevan signo relativo a la cuenta. El historial del detalle es de consulta; la gestión existente continúa en Movimientos.
- Hasta cuatro alcancías por cuenta de activo, con nombre, importe y fecha civil de Lima opcional. Separa dinero ya existente, sin generar movimiento, ingreso, gasto ni aporte de meta. Liberar requiere confirmación, devuelve todo el importe a libre y permite reutilizar el espacio. Puede liberarse antes de la fecha; «Llegó el día» es un recordatorio, sin desbloqueo ni gasto automáticos. Las alcancías heredan la moneda de su cuenta (PEN/USD); las tarjetas no tienen alcancías.
- Protección nueva: crear reservas exige saldo libre suficiente. Altas/ediciones/borrados de movimientos, transferencias, aportes y confirmaciones de pagos respetan las reservas dentro de su transacción. Los pagos automáticos sin saldo libre siguen programados para reintento, hasta liberar dinero o tener saldo suficiente. Se conserva el comportamiento anterior de cuentas sin reservas. Todas estas escrituras se serializan por propietario; aportes ahora también bloquea su fila de usuario.
- Migración nueva 015_account_piggybanks.sql, aplicada exclusivamente en u519053982_finanzas_test con TLS: tabla por propietario/cuenta, FK compuesta, cuatro posiciones únicas con CHECK 1–4 e importe positivo. piggybank_requests conserva claves de alta incluso tras liberar, para impedir reservas duplicadas por reenvíos tardíos. No se modificaron migraciones aplicadas; archivo nuevo con LF comprobado.
- Ilustraciones SVG originales de frascos, entrada/moneda/llenado breves, barra de distribución, temas claro/oscuro y movimiento reducido. Modal compartido con borrador, coma decimal, bloqueo al guardar, Escape/exterior y foco restaurado; confirmación enfoca Conservar. Revalidación del orden de cuentas para conservarlo al volver del detalle. Demo completamente en memoria, reiniciada al recargar.
- Validación nueva: build final y typecheck posterior aprobados en Node 26.13.0; tres pruebas locales nuevas aprobadas. npm test: 28/31, con los tres fallos históricos de contraste fox y expectativas antiguas de crédito (byCurrency/bank_code). Integración completa de diez archivos: 21/23 contando contenedores; falla la aserción antigua de totales sin byCurrency en integration.mjs y, por propagación, su contenedor. Cinco escenarios de alcancías y su contenedor aprobados: propiedad, rechazo de tarjetas/saldo, PEN/USD, idempotencia tras liberación, límite simultáneo, CHECK SQL, mutaciones/pagos/aportes con rollback y gasto contra reserva concurrente. Fixtures limpiados.
- QA nuevo de navegador: demo con cuatro espacios, guardado/fecha/coma/error/borrador/Escape/foco/liberación, cuenta vacía e independencia; privado con identidad ficticia aislada, transferencia recibida como único movimiento de Ahorros, alta S/ 45.50 con fecha Lima, espera/controles bloqueados, recarga persistente, rechazo de S/ 55 sobre S/ 54.50 libres, cancelar/liberar y logout. Orden por teclado, entrar con Enter y volver conservando orden comprobados. Identidad y datos ficticios eliminados. Inspección 320/390/1440 px, sin desbordamiento medido en escenarios revisados, tema tigre de escritorio y consola capturada sin errores. Corregidos durante QA fecha del formulario, contraste del título y foco tras éxito/eliminación del disparador.
- Pendientes: prueba táctil de arrastre, movimiento reducido y accesibilidad exhaustivos, demás paletas, exportación filtrada de cuenta abierta en Excel, y corregir las aserciones antiguas indicadas. Se conservan cambios locales previos. Sin nuevas dependencias, publicación ni datos reales.

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

- El saldo en cuentas de Resumen puede ocultarse y mostrarse en privado y demo; el avatar seleccionado lleva lentes animados mientras está oculto. El estado vive en memoria y afecta únicamente a ese importe, no a otras cifras del panel.
- Build y typecheck aprobados; cambio sin persistencia ni reglas monetarias. Pendiente revisión visual y de teclado en navegador, incluidos móvil, movimiento reducido y temas.

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

- Se incorpora a la cabecera compartida de demo y privado una campana con panel visual adaptable al tema, cierre por botón, Escape o exterior y animación respetuosa con movimiento reducido. La aplicación aún no genera notificaciones: el panel lo indica como «Próximamente», sin avisos ni contadores ficticios.
- Build y typecheck aprobados. Sin cambios de persistencia ni QA visual de navegador; quedan pendientes comprobaciones de móvil, teclado y temas.
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

## Check de selección y total de cuentas · 17/11/2026

- Las tarjetas de cuentas empiezan incluidas. La migración 013 conserva su checksum ya aplicado y la nueva 014 establece el valor por defecto y marca las cuentas existentes. Las futuras nacen seleccionadas; privado persiste la preferencia y demo la conserva solo en memoria. El check actualiza el total superior de forma optimista y revierte si falla la acción.
- Retirada la franja duplicada de selección. El check ajusta únicamente «En tus cuentas» para la moneda activa; deuda y crédito permanecen igual. El total usa céntimos BigInt.
- Build y typecheck aprobados; npm test conserva 25/28 con tres fallos históricos ajenos. Las migraciones 013/014 quedaron aplicadas en la base exclusiva de pruebas.

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
# Dinero libre en tarjetas de Cuentas · 19/11/2026

- Las tarjetas de cuentas muestran ahora el importe disponible para gastar como «Dinero libre»: saldo acumulado menos el importe reservado en sus alcancías. El saldo total se conserva para el detalle y las acciones de gestión.
- El cálculo usa `accountAllocation` y se aplica igual en privado y demo, incluyendo cuentas sin alcancías y cuentas PEN/USD. Sin cambios de persistencia, reglas monetarias ni migraciones.

## Tarjetas de Cuentas sin etiqueta de importe · 19/11/2026

- En «Tu billetera», las tarjetas de cuentas muestran únicamente el número de dinero libre, sin la etiqueta visible «Dinero libre». El cálculo y el detalle de cuenta no cambian.

## Colores claros en gráficos de categorías · 24/11/2026

- Los gráficos de gastos del Resumen y Categorías usan la misma mezcla clara del fondo de cada icono, incluido el color elegido o automático. El tema tigre blanco conserva sus colores anteriores; las agrupaciones sin categoría conservan su color neutral. Compartido por demo y privado, sin cambios de cálculos ni persistencia.
- Build, typecheck posterior y tres pruebas locales de categorías aprobados. Sin revisión visual nueva en navegador; queda pendiente comprobar la distinción de segmentos y barras en los temas y tamaños disponibles.

## Intensidad de gráficos de categorías · 24/11/2026

- Tras revisar la imagen aportada por el usuario, la mezcla de los gráficos sube de 11 % a 24 % del color de categoría para mejorar su visibilidad manteniendo tonos suaves. Sustituye la coincidencia exacta con el fondo del icono indicada arriba; el tigre blanco conserva sus colores anteriores. Build y typecheck posteriores aprobados; sin nueva revisión en navegador.

## Más intensidad en gráficos · 24/11/2026

- La mezcla de color de los gráficos aumenta de 24 % a 34 % por solicitud del usuario; el tigre blanco mantiene su paleta anterior. Build y typecheck aprobados; sin revisión visual nueva en navegador.

## Métricas retiradas del tablero de categorías · 24/11/2026

- Se retiraron las tarjetas de gasto total, mayor gasto y comparación mensual del tablero de gastos por categoría. Se conservan filtros, distribución, ranking y estado vacío en demo y privado. Build y typecheck aprobados; sin revisión visual nueva en navegador.

## Superficies blancas por avatar · 24/11/2026

- La superficie de zorro, gato, conejo y oso es blanca (#ffffff); koala y tigre blanco conservan sus valores. El gato ya era blanco. Build, typecheck y comprobación de las seis superficies aprobados. La prueba de contraste reproduce el fallo previo zorro deep/accent; sin revisión visual nueva en navegador.

## Gráfico de distribución sin texto central · 24/11/2026

- Retirados el contador y la etiqueta de categorías dentro del gráfico de distribución; se conservan su leyenda y ranking en demo y privado. Build y typecheck aprobados; sin revisión visual nueva en navegador.

## Orden de bancos en la billetera · 24/11/2026

- En «Ordenar», los botones de cada banco permiten subirlo o bajarlo; se conserva el orden interno de sus cuentas y el cambio abarca las cuentas de ambas monedas del banco. El orden privado reutiliza `sort_order` y el guardado transaccional existente; demo lo conserva en memoria. El guardado de tarjetas envía ahora la lista completa de cuentas, incluidas las de otros bancos y monedas.
- Build, typecheck y cuatro pruebas locales de orden aprobados. Sin integración remota ni QA nuevo de navegador; quedan pendientes revisión de teclado, responsive, espera/error y recarga privada ficticia.

## Total de pagos futuros · 24/11/2026

- Al final de los pagos visibles se muestra el total pendiente, o el total del día al filtrar el calendario. Soles y dólares se suman por separado en céntimos exactos; sin pagos visibles no se muestra total. Compartido por demo y privado, sin modificar persistencia.
- Build, typecheck y prueba local de suma y separación de monedas aprobados. Sin QA nuevo en navegador ni integración remota; pendientes revisión visual responsive y comprobación privada con fixture.

## Pagos futuros con tarjetas y selección de moneda · 24/11/2026

- Los pagos futuros admiten cuentas y tarjetas propias; se elige PEN o USD entre las cuentas disponibles y la moneda del gasto se deriva del origen. Al confirmar, se comprueba la línea de crédito en la misma transacción y se revierte si se supera. La edición también permite elegir tarjeta. No se descuenta ni reserva al programar. La demo permite seleccionar y editar las opciones existentes, pero la creación sigue siendo vista previa.
- Pendiente solicitado: una misma tarjeta con líneas independientes en PEN y USD. El modelo actual solo tiene una línea y moneda por tarjeta; las tarjetas existentes se mantienen en PEN. No se mezclan ni convierten monedas. Requiere diseñar e implementar saldos, límites, pago de deuda y migración por moneda antes de admitir dólares en la misma tarjeta.
- Build, typecheck e integración específica de pagos aprobados (cuatro pruebas incluidos contenedor y subpruebas), con usuarios ficticios limpiados en la base exclusiva. Verificados límite, rollback, idempotencia, moneda y aislamiento. Sin QA nuevo en navegador; pendientes flujo automático con tarjeta, responsive y sesión privada ficticia.

## Ingresos por categoría · 24/11/2026

- Debajo de gastos por categoría, demo y privado muestran distribución y ranking de ingresos con filtros independientes de mes y moneda y los colores de sus categorías. El cálculo usa céntimos exactos y excluye gastos y transferencias; sin ingresos se muestra estado vacío. Sin cambios de persistencia.
- Build, typecheck y cuatro pruebas locales de categorías aprobados. Sin QA nuevo de navegador; pendientes revisión visual, teclado, filtros y responsive en demo y sesión privada ficticia.
