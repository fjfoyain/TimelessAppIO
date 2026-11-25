# Piloto Quito — plan a partir de los documentos de Alex

Fuentes: «Lo que se implementa ahora» (oct 2026) y «Revisión de la app» (13 nov 2026).
Estado: Lote 0 hecho; Lote 1 escrito sin desplegar; Lotes 2–3 propuestos — 2026-11-24.

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

## Lote 1 — Cerrar agujeros y quitar datos falsos — código listo en `piloto/lote-1`, sin desplegar

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

Para desplegar el Lote 1 (en este orden, todo junto):
- [ ] D1. `node scripts/migrate-verified-wallets.js --apply` — simulacro del 2026-11-24: lista 7 talentos, oculta «dfsdf»,
      devuelve a revisión 1 depósito en efectivo de $1 y deja el saldo de la demo en $0 (eran $30 sin verificar).
      Va primero: sin el campo `isApproved` el marketplace nuevo saldría vacío.
- [ ] D2. `npm run deploy:rules`.
- [ ] D3. Merge a `main` (Vercel despliega la app).

## Lote 2 — Contratación (lo que el piloto necesita probar)

Se diseña aparte antes de escribir código. Alcance:
- [ ] K1. Colecciones Contratación / Transición / Movimiento con sus reglas y tests.
- [ ] K2. Estados: Solicitada → En negociación → Aceptada → Confirmada → Realizada → Liquidada, más Cancelada y Expirada.
- [ ] K3. Solicitud con fecha, tipo y tamaño del evento (dos selecciones rápidas).
- [ ] K4. Desglose visible antes de aceptar: precio, comisión 15%, lo que recibe el DJ.
      Sustituye el «Escrow fee 5%» actual, que se suma encima del precio.
- [ ] K5. Anticipo 25%: comisión a Timeless y el resto retenido hasta Realizada.
- [ ] K6. Confirmada = anticipo verificado por un admin (misma pantalla que W4).
- [ ] K7. Realizada la confirma el cliente; liquidación automática a los 7 días sin disputa.
- [ ] K8. Tabla de cancelaciones (más de 7 días / 7 días o menos / cancela el DJ).
- [ ] K9. Precio de lista y precio acordado guardados en cada contratación (propuesta 3.1).
- [ ] K10. Plazos según tamaño (propuesta 3.2), evaluados al leer mientras no haya servidor.
- [ ] K11. El «Project Manager» refleja el estado de las contrataciones; deja de moverse a mano.
- [ ] K12. Notificaciones a la contraparte en cada transición.

## Lote 3 — Lanzamiento por nicho

- [ ] N1. Configuración de lanzamiento: solo DJs, solo Quito.
- [ ] N2. Footer: «Event Types» y «Providers» bajo un solo título.
- [ ] N3. Textos que prometen lo que no existe («sign the contract» en la portada).
- [ ] N4. «Talent» vs «Artist»: solo Talent aparece en el marketplace; decidir si se unifican.

## Fuera de alcance: Studio es una página aparte que no gestionamos

- Tipo de reserva en el calendario (no existe en el modelo, solo en la leyenda).
- «View Calendar» de Community Events apunta a `/search`.
- «Free cancellation», «Instant confirmation», «24/7» en `/studio`.

## Arrastrado del plan anterior

- [ ] CSP con nonce · desglose WCAG AA de la agencia · reseñas sin transacción verificada
