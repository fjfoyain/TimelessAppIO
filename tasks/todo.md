# Saneado + Handover — completado 2026-08-05

Objetivo: dejar el activo en condición de venta "saneado + handover".
Cierra los hallazgos de la auditoría de reglas y entrega documentación de traspaso.

## Fase 1 — Reglas de Firestore (crítico)

- [x] F1. `users`: `role` / `isSuperUser` inmutables salvo admin (CRÍTICO 1 — escalada)
- [x] F2. `contracts`: `update` acotado a marcadores de firma/pago/payout, cada parte su lado (ALTO 3)
- [x] F3. Binding de propietario en `events`, `services`, `tickets`, `bookings`, `approvals` (ALTO 4)
- [x] F4. `venues`: doc keyeado por uid → `venueId == request.auth.uid` + `userId` coherente
- [x] F5. `conversations`: creador debe estar en `participants`; lista congelada tras crear
- [x] F6. `approvals`: `status == 'pending'` forzado en create
- [x] ~~F7. `bookings`: lectura a la contraparte~~ — **no aplica**: `bookings` resultó ser
      agenda personal (`userId, title, day, hour, duration, color`), sin contraparte.
      En su lugar se congeló `userId` en update y se acotó delete.
- [x] F8. `reviews`: sin auto-reseña, `rating` acotado a 1–5
- [x] F9. `isAdmin()`: helper `callerDoc()` + guarda `exists()`, con nota de coste

## Fase 2 — Reglas de Storage (alto)

- [x] S1. `services/`: reorganizado a `services/{uid}/` — la imagen se sube **antes**
      de que exista el doc, así que no había contra qué verificar propiedad.
      Requirió tocar `src/lib/storage.ts` y `src/app/services/new/page.tsx`.
- [x] S2. `artists/{uid}/portfolio`: restringido a image/audio/mp4
- [x] S3. `isCallerAdmin()` con `.get(key, default)` — eliminaba un `EvaluationException`
      que denegaba por error en vez de por regla

## Fase 3 — Verificación

- [x] V1. `@firebase/rules-unit-testing` + `firebase-tools` instalados
- [x] V2. 51 tests contra emulador (`npm run test:rules`), uno por hallazgo + camino feliz
- [x] V3. lint limpio · 40 unit tests · 51 rule tests · build OK
- [x] V4. **Diferencial**: los 3 ataques principales se ejecutaron contra las reglas
      anteriores (`git show HEAD:firestore.rules`) y **tuvieron éxito**. Los tests no
      pasan en vacío.
- [x] V5. Smoke test de cabeceras servidas contra `npm start`

## Fase 4 — Riesgo legal previo a venta

- [x] L1. Retirado "Trusted by 500+ artists" y las 5 estrellas de `/studio`
- [x] L2. CSP + X-Frame-Options + nosniff + Referrer-Policy + Permissions-Policy + HSTS

## Fase 5 — Handover

- [x] H1. `HANDOVER.md`
- [x] H2. Inventario y checklist de traspaso (incl. orden de migración y datos personales)
- [x] H3. `ACTION_PLAN.md` actualizado · puntero en `README.md` · `.gitignore` de artefactos

## Pendiente — requiere acción humana

- [ ] **`npm run deploy:rules`** — nada de esto está activo hasta ejecutarlo
- [ ] Pedir a la agencia el desglose de la infracción WCAG AA (criterio + elemento)
- [ ] Acuerdo por escrito con el otro socio antes de negociar la venta

## Fuera de alcance (declarado al comprador, no oculto)

- **S1 wallet** — saldo calculado en cliente. Arreglo real = Cloud Functions +
  procesador de pagos. Documentado en `HANDOVER.md` §6.
- CSP con `unsafe-inline`/`unsafe-eval` — lo exige el runtime del App Router.
  Endurecerlo = CSP con nonce desde middleware.
