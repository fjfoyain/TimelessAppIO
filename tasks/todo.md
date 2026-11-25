# Piloto Quito — pendientes

Actualizado: 2026-11-24. Todo lo construido hasta hoy está en producción:
seguridad y cuentas, billetera verificada por admin, flujo de contratación,
lanzamiento solo DJs en Quito, ajustes del piloto y Next 16. El detalle de lo
hecho está en `ACTION_PLAN.md` y en el historial de git.

Aquí queda solo lo que falta.

## 1. Bloquea el piloto

- [ ] **Cuenta bancaria para el anticipo.** La app dice «envía el anticipo a Timeless» y no muestra ninguna cuenta.
      Falta el dato (pregunta 1 del PDF); mostrarlo es un cambio corto.
- [ ] **DJ reales contratables.** Hoy el marketplace solo lista a la DJ de muestra. Cada DJ debe ser «Talent»,
      con categoría DJ, ciudad Quito y al menos un plan. Quien ya es talento lo corrige en «My Listing & Plans»;
      quien se registró como «Artist» (DJ Pancho, Nebulossa, LYVAR, Dj Chavezura) necesita la decisión de la pregunta 8.
- [ ] **Revisar pantallas y funcionalidad.** Recorrer la app con las cuentas demo (cliente, DJ y admin), también
      tras la actualización a Next 16. La lista de pasos está en el PDF, sección 9.

## 2. Esperan respuesta de David y Alex (PDF, sección 7)

- [ ] 1. Cuenta a la que se transfiere el anticipo.
- [ ] 2. Quién revisa la cola del admin y cada cuánto.
- [ ] 3. Lo retenido y los reembolsos: ¿al saldo de Timeless o transferencia directa?
- [ ] 4. ¿Penalización al DJ que cancela?
- [ ] 5. ¿Requisito para abrir una disputa? Hoy es gratis y congela el cobro del DJ.
- [ ] 6. Límites de oferta (50%–200%, dólares enteros).
- [ ] 7. Corte chico/grande (100 personas, 100 tickets, 150 m²).
- [ ] 8. ¿Se unifican «Talent» y «Artist»?
- [ ] 9. Cuentas repetidas: LYVAR ×2, Dj Chavezura ×2 (más la de David). Cuál se conserva.
- [ ] 10. Idioma del piloto: inglés o español.
- [ ] 11. ¿Bloquear en reglas contratar fuera de «DJs en Quito», o basta con no listarlo?
- [ ] 12. Para qué queremos «Upcoming events».

## 3. Podemos hacerlo ya

- [ ] Quitar «+2k Verified talents joined» del registro de talento: cifra sin respaldo.
- [ ] La tarjeta del marketplace nunca muestra la calificación real: lee un campo antiguo que siempre está vacío.
      Las reseñas nuevas solo se ven dentro del perfil.
- [ ] El DJ no ve «Your move» correcto en el tablero cuando el anticipo del cliente está en verificación
      (dentro de la contratación sí se ve bien).
- [ ] Una negociación con más de ~55 contraofertas agota la secuencia y ya no se podría confirmar. Poner un tope
      de contraofertas mucho antes.
- [ ] Cualquiera puede abrir una conversación con cualquier usuario. Ya era así; valorar limitarlo.
- [ ] Auditar también los cambios de categorías en el panel de admin.
- [ ] Retirar el código del tablero manual de proyectos, que ya no tiene pantalla (queda 1 proyecto en producción).
- [ ] 23 avisos del linter por la regla nueva de React 19 sobre efectos: rehacer los hooks de carga de datos.
- [ ] `firebase` 12 → 13 (SDK de cliente): es lo que arrastra los avisos de dependencias que quedan (ninguno crítico).

## 4. Diseño que conviene revisar, sin urgencia

- [ ] Sin servidor, los plazos no se disparan solos: una contratación vencida se cierra cuando alguien la abre
      o el admin revisa «Overdue». Lo mismo con anticipos, disputas y liquidaciones: esperan a un admin.
      Con Cloud Functions (plan de pago de Firebase) serían automáticos.
- [ ] Liquidar hace muchas lecturas de reglas en una sola operación. Pasa en el emulador; confirmar con la primera
      liquidación real que producción no la rechaza por límite.
- [ ] CSP con nonce (hoy permite `unsafe-inline` / `unsafe-eval`).
- [ ] Contraste WCAG AA: bloqueado hasta que la agencia entregue el desglose.

## 5. Solo Francisco (fuera del código)

- [ ] IP nueva de Hostinger: revisar en Cloudflare si algún registro apunta a la IP vieja. La raíz y `www` no.
- [ ] Cloudflare: los registros hacia Vercel están con proxy activo; HANDOVER.md pide «DNS only».
- [ ] Vercel: confirmar qué versión de Node usa el proyecto (`package.json` pide 22 o superior).
- [ ] Rotar la clave de servicio de Firebase si alguna vez se compartió.
- [ ] Pasar a David y Alex las credenciales de las cuentas demo (`.env.demo.local`).

## En observación

- Páginas de evento en blanco: cargan bien en producción y no se encontró la causa.

## Fuera de alcance

Studio (`/studio`, `/booking`) es una página aparte que no gestionamos: tipo de reserva, «View Calendar»,
«Free cancellation», «Instant confirmation», «24/7».
