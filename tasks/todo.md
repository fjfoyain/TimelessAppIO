# SEO, accesibilidad e higiene — completado 2026-08-05

S1 (wallet) en espera por decisión del product owner.

## Fase 1 — Higiene

- [x] R1. Borrado `src/data/mockTalents.ts` (893 líneas, cero referencias)

## Fase 2 — Infraestructura SEO

- [x] E1. `metadataBase` + template de título `%s | Timeless`
- [x] E2. `src/app/robots.ts` — 15 rutas privadas en Disallow + sitemap
- [x] E3. `src/app/sitemap.ts` — 34 URLs con datos reales de producción
- [x] E4. `src/lib/publicData.ts` — REST de Firestore server-side, sin credenciales
- [x] E5. `src/lib/site.ts` — origen canónico y lista de rutas privadas

## Fase 3 — Metadata

- [x] M1. Públicas: `/events`, `/venues`, `/cookies`
- [x] M2. `noindex, nofollow` en 11 rutas autenticadas
- [x] M3. `generateMetadata` por ítem en `/venues/[id]`, `/events/[id]`,
      `/marketplace/[id]`; `/blog/[slug]` ya lo tenía (ajustado para no duplicar marca)
- [x] M4. **Bug encontrado y corregido**: un layout intermedio con `title` string
      consume el template del raíz y deja a sus hijos sin marca. `venues`, `events`
      y `marketplace` lo re-declaran como `{ default, template }`.

## Fase 4 — Datos estructurados

- [x] D1. `Organization` + `WebSite`/`SearchAction` en el raíz
- [x] D2. `EventVenue`, `Event` y `Person` por ficha

## Fase 5 — Accesibilidad

- [x] A1. Controles solo-icono sin nombre accesible: **3 reales** (no 22 — el primer
      detector descartaba las expresiones JSX, que son el texto visible). Corregidos
      en `Navbar.tsx` con `aria-label` + `aria-hidden` en los iconos.
- [ ] A2. Contraste — pendiente, va junto con el desglose WCAG de la agencia

## Fase 6 — Verificación

- [x] V1. lint · 40 unit · 51 rules · build, todo en verde
- [x] V2. `/robots.txt` y `/sitemap.xml` verificados servidos (34 URLs)
- [x] V3. `noindex` confirmado en privadas; metadata por ítem contra datos reales

## Pendiente

- [ ] Commit + push (sin hacer — el working tree tiene los cambios)
- [ ] **S1 wallet** — en espera por decisión
- [ ] Reseñas sin transacción verificada + tope de subidas por usuario — ambos
      necesitan Cloud Functions, se resuelven con S1
- [ ] CSP con nonce — volvería dinámicas las 52 rutas hoy estáticas; evaluar antes
- [ ] Desglose WCAG AA de la agencia (bloqueado por terceros)
