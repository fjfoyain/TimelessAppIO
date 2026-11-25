# Piloto Quito — plan a partir de los documentos de Alex

Fuentes: «Lo que se implementa ahora» (oct 2026) y «Revisión de la app» (13 nov 2026).
Estado: Lotes 0 y 1 en producción; Lotes 2 y 3 commiteados en `piloto/lote-2`, sin desplegar — 2026-11-24.

Contexto que condiciona todo: lo desplegado es el código de agosto. Nada de lo
acordado el 8 de octubre está construido todavía.

## Lote 0 — Operativo, urgente — hecho en producción 2026-11-24

- [x] O1. `demo@timeless.io` pasa a cliente sin privilegios, contraseña rotada, sesiones revocadas.
- [x] O2. Admin real: `isSuperUser` en la cuenta de Francisco. Es el único admin.
- [x] O3. Cuentas demo sin privilegios: cliente (`demo@`) y DJ (`talent.luna@`). Credenciales en `.env.demo.local` (gitignored).
- [x] O4. «dfsdf» (correo desechable, creada 2026-10-20): suspendida, login deshabilitado, solicitud rechazada.
      Su ficha sigue visible en el marketplace hasta M1.
- [x] O5. Contraseñas fuera de los scripts y del README; `create-demo-user.js` → `create-admin.js`.
      Rotadas también las otras 6 cuentas de muestra, que compartían la contraseña publicada.
- [ ] O6. Decidir si David también es admin.

## Lote S — Dependencias y plataforma

- [x] S1d. `npm audit fix` (sin cambios incompatibles): 59 → 24 avisos. Tests, lint y build en verde.
- [ ] S2d. **Next 14 → 16** (con React 19). Es lo único crítico que queda: la rama 14 ya no recibe parches
      y el arreglo solo existe en la 16. Cambio mayor, va en rama propia con prueba completa.
- [ ] S3d. Fijar la versión de Node en `package.json` (`engines`) y comprobar la que usa Vercel.
- [ ] S4d. `firebase-admin` 13 → 14 (solo scripts locales; arrastra los avisos de `@grpc/grpc-js` y `uuid`).
- [ ] S5d. Cloudflare: los registros hacia Vercel están con proxy activo; HANDOVER.md pide «DNS only».
- [ ] S6d. Rotar la clave de servicio de Firebase (`scripts/serviceAccountKey.json`) si se compartió alguna vez.

## Lote 1 — Cerrar agujeros y quitar datos falsos — en producción desde 2026-11-24

Billetera (cierra S1 solo con reglas, sin Cloud Functions):
- [x] W1. Reglas: el usuario solo crea solicitudes en `processing`; `wallets.balance` solo lo escribe un admin.
- [x] W2. Depósito en efectivo deja de nacer `completed`.
- [x] W3. El saldo solo cambia cuando un admin verifica (`resolveTransaction`).
- [x] W4. Pantalla `/admin/payments` «Payments to verify» (entrantes / salientes, verificar o rechazar).
- [x] W5. Retiro exige método de cobro guardado (en la UI y en las reglas).
- [x] W6. «Processing» separado en depósitos y retiros en revisión; el saldo mostrado es el disponible.
- [x] W7. 15 tests de reglas nuevos (66 en total).
- [x] W8. Retirado el cobro simulado de Skrill: escribía pagos `completed` desde el cliente.

Marketplace y admin:
- [x] M1. `talents.isApproved`, escrito solo por admin; filtra marketplace, sitemap y ficha. `isVerified` queda igual de protegido.
- [x] M2. Auditoría en el mismo batch que la acción: aprobar/suspender cuentas, solicitudes, verificar pagos, acreditar saldo.
      Categorías no se auditan todavía.
- [x] M3. El panel cuenta cuentas pendientes desde `users`, igual que Accounts. Tarjeta nueva de pagos por verificar.
- [x] M4. Analytics y logs: errores manejados, el spinner ya no se queda colgado.
- [x] M6. `users.status` ya no lo puede escribir el dueño: antes cualquiera podía aprobarse a sí mismo.
- [x] M5. Fuera «jobs completed» y «response rate» de fichas, tarjetas, dashboard y seed.

Chat y eventos:
- [x] C1. Oferta entre 50% y 200% del precio del plan. **Los límites son un valor por defecto: confirmarlos con David y Alex.**
      Es una validación de interfaz, no una barrera: las reglas de `conversations` aún dejan a un participante
      escribir la oferta directamente. La barrera real llega con las contrataciones del Lote 2.
- [x] C2. El contrato toma el precio de la negociación aceptada, nunca de la URL.
- [x] C3. El mensaje inicial se envía una vez por plan; doble clic bloqueado.
- [x] C4. El panel del chat muestra el contrato de esa conversación, no reservas del estudio.
- [x] C5. Notificaciones propias (depósito, retiro) y del admin al verificar. A la contraparte: Lote 2.
- [x] E1. Portada y `/events` solo muestran eventos de hoy en adelante.
- [x] E2. Dashboard: estados vacíos explícitos; un evento de hoy ya no cae en «Past».
- [ ] E3. Páginas de evento en blanco: sin causa en el código, hay que reproducirlo en producción.

Desplegado el 2026-11-24: migración aplicada (7 talentos listados, «dfsdf» oculto, 1 depósito en efectivo
devuelto a revisión, saldo de la demo de $30 a $0), reglas publicadas y `main` empujado.

## Lote 2 — Contratación — escrito y probado, SIN desplegar

- [x] K1. `contrataciones/{id}` + `transiciones/{seq}`; el dinero va en `transactions` con `contratacionId`.
- [x] K2. Los seis estados más Cancelada y Expirada. Las reglas de Firestore son la máquina de estados.
- [x] K3. Solicitud con fecha, hora, tipo y tamaño del evento (personas, tickets o m²).
- [x] K4. Desglose visible antes de enviar y antes de aceptar. Retirado el «Escrow fee 5%».
- [x] K5. Anticipo 25% = comisión 15% + parte retenida. Todo en centavos enteros, sin redondeos.
- [x] K6. Confirmada = un admin verificó el anticipo, desde la cola de `/admin/payments`.
- [x] K7. Realizada la confirma el cliente; a los 7 días del evento sin disputa, cualquiera de las partes.
      Liquidada la ejecuta un admin, porque solo un admin escribe saldos.
- [x] K8. Cancelaciones con el reparto acordado; el movimiento pendiente nace con la cancelación.
- [x] K9. Precio de lista y precio acordado guardados en cada contratación.
- [x] K10. Plazos por tamaño, comprobados contra la hora del servidor al actuar.
- [x] K11. `/dashboard/projects` es ahora el tablero de contrataciones; ya no se mueve a mano.
- [x] K12. Notificación a la contraparte en cada paso, con id fijo para que no sirva de spam.
- [x] K13. Disputas: una parte la abre hasta 7 días después del evento; un admin la resuelve.
- [x] K14. Editor de planes del DJ (`/dashboard/plans`). Sin esto ningún DJ real era contratable.
- [x] K15. Reseñas atadas a una contratación realizada: una por contratación.
- [x] K16. Las ofertas salen del chat; el contrato de doble firma queda en solo lectura.

Verificación: 75 pruebas unitarias · 150 de reglas (incluye el flujo completo ejecutando el código real de la
app contra las reglas) · lint · build.

## Lote 3 — Lanzamiento por nicho — escrito, SIN desplegar

- [x] N1. `LAUNCH_SCOPE` (DJ / Producer, Quito) limita marketplace, sitemap, portada, búsqueda y registro.
      Ponerlo en `null` reabre todas las categorías y ciudades.
- [x] N2. Pie de página: una sola columna «Discover our talent».
- [x] N3. Portada: fuera «sign the contract»; ahora describe precio, desglose y anticipo.
- [x] N4. El registro dice qué rol se lista y se contrata (Talent) y cuál no (Artist). Unificarlos sigue pendiente de decisión.
- [x] N5. El registro de talento ofrece la categoría DJ (antes no existía) y pide ciudad.

Para desplegar los Lotes 2 y 3 (no hace falta migrar datos):
- [ ] D4. `npm run deploy:rules`.
- [ ] D5. Merge de `piloto/lote-2` a `main` y push.

## Por revisar antes de dar el piloto por listo

Decisiones de producto que tomé por defecto (confirmar con David y Alex):
- [ ] R1. Lo retenido del DJ y los reembolsos se acreditan al saldo de Timeless; el cliente necesita método de cobro para retirar.
- [ ] R2. Precios y ofertas en dólares enteros; oferta entre 50% y 200% del precio de lista.
- [ ] R3. Tamaño por rangos; corte chico/grande en 100 personas, 100 tickets y 150 m².
- [ ] R4. Se pide hora de inicio (20:00 por defecto); los 7 días se miden desde esa hora.
- [ ] R5. El DJ puede cancelar hasta la hora del evento sin penalización; el cliente recupera todo el anticipo.
- [ ] R6. Reportar el anticipo detiene el reloj de Aceptada hasta que un admin lo resuelva.
- [ ] R7. Disputa: ventana de 7 días tras el evento, una por contratación; el admin elige descartar, pagar al DJ o reembolsar al cliente.
- [ ] R8. Textos de la app en inglés, como el resto. ¿El piloto en Quito los necesita en español?

Datos de producción:
- [ ] R9. Con el alcance activo el marketplace solo muestra a «Luna Vega» (demo). Felipe Ponce, David Chávez y
      Pancho están como Event Promoter / Videographer y sin ciudad: quedan fuera hasta corregir categoría y ciudad.
- [ ] R10. DJ Pancho, Nebulossa, LYVAR y Dj Chavezura se registraron como Artist: no aparecen ni son contratables.
- [ ] R11. Ningún DJ real tiene planes; cada uno debe crearlos en «My Plans».
- [ ] R12. 4 conversaciones con ofertas de prueba antiguas (una de $2000): se ignoran, no se migran. 1 proyecto del tablero manual queda sin pantalla.
- [ ] R13. Cuentas repetidas de un mismo artista (LYVAR ×2, Dj Chavezura ×2): decidir cuál se conserva.

Verificación pendiente:
- [ ] R14. Ninguna pantalla nueva se ha visto en un navegador con sesión: contratación, tablero, planes, cola de admin, billetera.
- [ ] R15. Recorrido manual completo con las cuentas demo de cliente y DJ más el admin.
- [ ] R16. Resultado de la revisión adversarial de las reglas del Lote 2 (en curso al escribir esto).
- [ ] R17. Páginas de evento en blanco (E3): hoy renderizan bien en producción; no se encontró la causa.
- [ ] R18. Sin servidor, los plazos no se disparan solos: alguien tiene que abrir la contratación o el admin barrer «Overdue».

## Fuera de alcance: Studio es una página aparte que no gestionamos

- Tipo de reserva en el calendario (no existe en el modelo, solo en la leyenda).
- «View Calendar» de Community Events apunta a `/search`.
- «Free cancellation», «Instant confirmation», «24/7» en `/studio`.

## Arrastrado del plan anterior

- [ ] CSP con nonce · desglose WCAG AA de la agencia · reseñas sin transacción verificada
