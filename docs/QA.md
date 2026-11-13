# Verificación y pendientes de QA

Documento reconciliado al **13/11/2026** con AGENTS.md, código, scripts y [STATUS.md](STATUS.md). Los resultados siguientes proceden de las entregas indicadas; esta actualización documental no repite las pruebas de navegador, integración remota ni compilación. La aplicación sigue sin publicar y sin autorización para datos financieros reales.

## Evidencia disponible

| Área | Pruebas realizadas y documentadas | Límite / pendiente |
| --- | --- | --- |
| Build y tipos | Build y typecheck correctos en entregas de código, incluido perfil del 13/11; historial local con Node 26.13.0. | No ejecutados de nuevo para esta edición documental. Node 24 y Hostinger pendientes. |
| Pruebas locales | Siete aprobadas en la auditoría documental del 13/11: dinero, transferencias, fechas, contraseñas, catálogo/perfil y contraste de paletas. | No prueban navegador ni base real. No se repitieron en esta continuación documental. |
| Acceso privado inicial | Login/logout HTTP, redirección anónima, persistencia y escenario monetario en navegador, finalizado el 11/11 con usuario ficticio. | No valida logout/perfil después de los rediseños recientes. |
| Integración general | Historial aprobado en MariaDB 11.8.9 de Hostinger: propiedad, precisión, transferencias, duplicados, restricciones, sesiones/límites, planificación, metas y hábitos. Fixtures limpiados. | No consta reejecución conjunta de toda la suite tras añadir perfil. No equivale a auditoría exhaustiva de seguridad. |
| Perfil persistente | Integración específica aprobada el 13/11: dos propietarios, lectura/actualización independiente, valores inválidos, propietario inexistente y cascada. Fixtures limpiados. | Interacción y guardado visual con sesión privada pendientes. |
| Módulos privados iniciales | QA histórico de creación de cuentas/categorías, resumen mensual, presupuestos/pagos, metas/aportes y hábitos/canjes. | Revisión autenticada de los formularios y vistas rediseñados pendiente. |
| Demo y rediseños | QA del 11–13/11 de resumen, movimientos, cuentas, hábitos, navegación, modal y seis temas; 320/390 px y escritorio según entrega, sin desbordamiento de página. | Evidencia de demo; no sustituye pruebas autenticadas. Sidebar con zoom elevado pendiente. |
| CSV | Archivo descargado inspeccionado con filtros: transferencia, fecha, importe y cuentas correctos; búsqueda vacía y exportación deshabilitada comprobadas. | Apertura y comportamiento en Excel pendientes. |
| Producción | TLS remoto de la base de pruebas documentado y migraciones 001–006 registradas como aplicadas. | Sin despliegue; faltan restauración, recuperación de acceso, entorno Node y HTTPS/cookies de producción. |

Los antiguos recuentos de cuatro pruebas locales y cinco escenarios remotos describían la primera entrega. La suite actual se detalla abajo; su existencia no implica una ejecución nueva.

## Comandos y cobertura automatizada actual

Tras cambios de código, ejecutar build antes de typecheck para disponer de tipos generados:

```sh
npm run build
npm run typecheck
npm test
git diff --check
```

`npm test` ejecuta `tests/*.test.mjs`, sin base de datos:

| Archivo | Cobertura | Pruebas |
| --- | --- | --- |
| money.test.mjs | Precisión y límite DECIMAL(13,2); conservación de saldo en transferencias; validación de importes/fechas/cuentas iguales. | 3 |
| password.test.mjs | Sales distintas y verificación de contraseña. | 1 |
| profile.test.mjs | Catálogo, validación, consultas por propietario y compatibilidad del tigre con preferencias antiguas. | 3 |
| avatar-theme.test.mjs | Contraste de las seis paletas y superficies/mensajes semánticos del modo oscuro. | 2 |

`npm run test:integration` ejecuta **dos archivos**: `tests/integration.mjs` (una prueba contenedora con ocho subpruebas) y `tests/profile-integration.mjs` (una prueba de perfil). No confundir pruebas contenedoras con escenarios independientes al informar recuentos.

El archivo general cubre límites persistentes de acceso; transferencias y céntimos; aislamiento de referencias; duplicados/restricciones; presupuestos/pagos y doble confirmación; metas/aportes sin inflar gastos; hábitos/canjes; contraseñas/sesiones/expiración/revocación. Perfil comprueba persistencia y aislamiento de avatar, validación en aplicación/base y limpieza por cascada.

Antes de integración, confirmar en configuración privada `TEST_DB_NAME` idéntico a `DB_NAME`, correspondiente exclusivamente a `u519053982_finanzas_test`, y conexión TLS. Los scripts rechazan una discrepancia de nombres, pero no sustituyen comprobar el destino. No ejecutar contra producción ni bases de otros sitios. Crean usuarios aleatorios y limpian sus datos al terminar; si una ejecución falla, revisar su limpieza antes de repetir.

No hay script lint ni suite automatizada de navegador configurados. El contraste automatizado no equivale a una auditoría completa de accesibilidad.

## Escenario privado inicial aprobado · 11/11/2026

Entorno histórico: aplicación local, base exclusiva de pruebas en Hostinger mediante TLS, usuario ficticio separado del propietario y sin movimientos iniciales. Se completó la limpieza posterior. Este resultado corresponde a la interfaz de entonces.

1. Iniciar sesión con el usuario ficticio.
2. Registrar ingreso de S/ 100 en Efectivo y gasto de S/ 10,25 en Alimentación. Saldo esperado: S/ 89,75.
3. Intentar transferencia con origen y destino iguales: error sin borrar descripción/importe ni cambiar tipo; no se guarda.
4. Corregir origen Efectivo, destino Ahorros e importe S/ 25. Tras guardar, limpiar descripción/importe, conservar selecciones y habilitar controles.
5. Comprobar ingresos S/ 100, gastos S/ 10,25 y saldo S/ 89,75; Efectivo S/ 64,75 y Ahorros S/ 25.
6. Recargar: persisten los tres movimientos. También se comprobó persistencia de ingreso/gasto tras reiniciar el servidor local.
7. Revisar a 390 × 844 y 1440 × 1000: página sin desbordamiento horizontal móvil; tabla con scroll propio.
8. Cerrar sesión y comprobar regreso a `/login`.

Resultado histórico: aprobado; la corrección de preservación del formulario quedó en `85983ec`. Los nuevos modal, perfil y vistas compartidas requieren la repetición autenticada indicada abajo.

## Reproducir QA privado sin tocar al propietario

1. Confirmar base exclusiva, migraciones requeridas y `DB_SSL=true`; configurar `TEST_DB_NAME` con el mismo nombre de base que `DB_NAME`. Definir `UI_TEST_PASSWORD` temporal en el entorno privado, sin imprimirla ni versionarla.
2. Iniciar la aplicación local con `npm run dev` y ejecutar `node tests/ui-fixture.mjs create`. Devuelve un correo ficticio y conserva su identidad en `.local-db/ui-fixture.json`, excluido de Git. Esa carpeta no requiere reactivar la antigua instancia local de MariaDB.
3. Entrar con esa identidad y su contraseña temporal. Repetir primero el escenario inicial; usar fixtures independientes o registrar el saldo de partida para los escenarios siguientes.
4. Al finalizar, cerrar sesión y ejecutar `node tests/ui-fixture.mjs cleanup`. Elimina únicamente esa identidad y sus datos relacionados; las preferencias se eliminan por cascada. Verificar que la limpieza terminó y retirar la contraseña temporal del entorno.

No usar credenciales del propietario para pruebas de creación/borrado. No borrar el identificador del fixture antes de limpiar: el script lo necesita y evita sobrescribirlo al crear otro. Una nueva ejecución debe registrar su propio resultado y limpieza; la limpieza histórica no acredita una ejecución futura.

`node scripts/check-access.mjs` es una comprobación HTTP adicional de login/logout con servidor en `127.0.0.1:3000`; requiere las variables `INITIAL_USER_EMAIL`/`INITIAL_USER_PASSWORD` temporalmente presentes y credenciales autorizadas para esa prueba. Revisar el script antes de usarlo, no imprimir secretos y retirar la contraseña después. No sustituye la revisión visual ni la cookie de producción bajo HTTPS.

**Limitación detectada por inspección:** el script aún exige los textos antiguos «Tus cuentas» y «Movimientos guardados» en el resumen privado. Actualizar esas aserciones a la interfaz vigente antes de reutilizarlo; un fallo en esa comprobación no demostraría por sí solo un fallo de autenticación. Esta entrega no cambia ni ejecuta el script.

## Revisión autenticada pendiente de los rediseños

La lista es un **plan de pruebas**, no un resultado aprobado. Ejecutar con identidad ficticia autorizada y documentar fecha, entorno, pasos, resultado y limpieza.

| Área | Escenario y resultado esperado |
| --- | --- |
| Resumen | Cambiar a mes vacío y volver: saldo total acumulado intacto, métricas/actividad mensuales y avance futuro bloqueado. Revisar categorías y estados vacíos. |
| Modal | Abrir desde Resumen sin navegar; gasto con coma decimal actualiza resumen al guardar. Error conserva datos; cierre manual conserva borrador; éxito cierra y limpia descripción/importe manteniendo selecciones. Durante guardado, controles/cierre bloqueados. Escape/cierre exterior devuelven foco y liberan scroll cuando no se está guardando. |
| Movimientos | Registrar tipos y combinar filtros; transferencia no cambia ingresos/gastos; error conserva valores, éxito limpia solo descripción/importe. CSV refleja filtros y balance de selección excluye transferencias. |
| Cuentas/categorías | Crear cuenta con cero, duplicado con mensaje y nombre conservado, categorías por tipo y uso al registrar. Tras transferencia cambian saldos individuales y se conserva total; comprobar persistencia tras recargar. |
| Planificación | Desde fixture limpio: presupuesto S/ 120 y pago futuro S/ 25,75 no alteran saldo hasta confirmar. Confirmar genera un solo gasto y deja S/ 94,25 de presupuesto; segundo intento no duplica. Cancelar otro pago no crea gasto. |
| Metas | Meta S/ 500 y aporte S/ 25,50 entre cuentas distintas: avance 5%, transferencia visible e ingresos/gastos intactos. Reenvío duplicado rechazado; barra limitada al 100% al alcanzar objetivo. |
| Hábitos | Marca suma 10 una vez por día; hoy y seis días anteriores admitidos, fuera del intervalo rechazado. Crear hábito/premio, comprobar saldo insuficiente y un canje por semana ISO; puntos e historial persisten. |
| Perfil y temas | Seis avatares: vista previa sin aplicar no cambia tema; aplicar persiste al navegar/recargar. Otra identidad conserva elección independiente. Comprobar espera/error, teclado, movimiento reducido y logout desde el menú. |
| Acceso | Anónimo redirige; logout revoca acceso y volver a privado exige login. No confundir esta repetición tras rediseños con el resultado inicial aprobado. |

Revisar 320 × 568, 390 × 844 y escritorio, nombres/correos largos, foco visible, diálogo con scroll interior, contraste semántico y ausencia de desbordamiento de página. Probar sidebar con zoom elevado y menú móvil con Escape, devolución de foco y bloqueo del fondo.

## Referencias de QA de demo ya realizadas

Estos escenarios constan aprobados en STATUS del 11–13/11; no se reejecutaron en esta actualización:

- Saldo inicial S/ 3.963,00; gasto S/ 10,25 deja S/ 3.952,75 y gastos S/ 247,25. Transferencia válida S/ 25,50 conserva esos totales; destino igual muestra error conservando datos.
- Modal del Resumen: tras el gasto y una transferencia, ingreso S/ 50 deja S/ 4.002,75. Recarga devuelve saldo inicial; Escape devuelve foco.
- Cuentas: nueva cuenta a cero y categorías disponibles al registrar; transferencia S/ 25,50 conserva total. Gasto posterior S/ 30,75 desde esa cuenta deja saldo individual -S/ 5,25 y total S/ 3.932,25.
- Hábitos: completar los cinco pasa de 80 a 110 puntos; canjear premio de 60 deja 50 y bloquea otro canje semanal. Crear sexto hábito recalcula progreso; cambiar de día muestra su actividad.
- Seis temas aplicables y conservados al navegar, modal adopta paleta, cierre sin confirmar conserva tema anterior y recarga restaura koala. Menú revisado a 1440 × 1000, 390 × 844 y 320 × 568, sin errores de consola registrados.
- Navegación móvil, teclado/Escape y retorno de foco; vistas de resumen/cuentas simplificadas sin desbordamiento. CSV de transferencia descargado e inspeccionado con sus filtros.

La demo no prueba persistencia privada. Planificación y metas son ilustrativas; hábitos se reinicia al salir de sección y todos los datos demo al recargar. No introducir información real.

## Pendientes externos y de producción

- Abrir CSV en Excel y comprobar codificación, columnas, decimales y tratamiento de celdas con prefijos de fórmula; conservar BOM, separador punto y coma y protección implementada.
- Ejecutar en Node 24 y comprobar compatibilidad del entorno objetivo Hostinger; no asumirla a partir de Node 26 local.
- Diseñar respaldo y demostrar restauración MySQL en un destino aislado; Git no respalda datos.
- Definir/probar recuperación de acceso; no existe recuperación automática de contraseña.
- Verificar bajo HTTPS del futuro despliegue cookies Secure/HttpOnly/SameSite, prefijo `__Host-`, permisos por usuario y aislamiento antes de producción o datos reales.

Registrar resultados nuevos en STATUS y actualizar esta matriz al completarlos; no marcar aprobación global basándose solo en demo, pruebas locales o resultados históricos.

## Verificación adicional: tigre y modo oscuro · 13/11/2026

Nueve pruebas locales, build y typecheck aprobados. Integración específica de perfil reejecutada con tigre, aislamiento y limpieza en la base exclusiva de pruebas; no se reejecutó la suite general. QA de demo: vista previa/confirmación, seis secciones, colores del modal, cambio a koala claro y móvil 320/390 px sin desbordamiento horizontal medido ni errores de consola registrados. QA autenticado y teclado/movimiento reducido exhaustivos siguen pendientes. Detalles de compatibilidad del valor histórico panda en STATUS y PROJECT_CONTEXT.
