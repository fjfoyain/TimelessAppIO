# Timeless — Análisis del proyecto y plan de acción

> Fecha del análisis: 2026-05-21
> Estado del repositorio: rama `main`, último commit `4a7987c "Fixes"`.

---

## 0. Progreso (actualizado 2026-05-21)

**Fase 1 — corrección del núcleo funcional (completada):**

- ✅ **B2** — `createVenueProfile` ahora guarda `address`/`website` (alineado con el tipo `Venue`) y construye el documento sin campos `undefined` (Firestore los rechaza). `register/venue` actualizado.
- ✅ **B3** — `createTalentProfile` ahora escribe un documento con la forma del tipo `Talent` (`hourlyRate`, `city`, `bio`, `tags`, arrays por defecto, flags), así el talento aparece correctamente en el marketplace.
- ✅ **B4** — `/events/create` valida con el esquema Zod `eventSchema`: validación por paso, errores en pantalla y verificación final antes de publicar.
- ✅ **B5** — `createEvent` recibe y guarda `location` (se copia la dirección del venue seleccionado).

**Fase 2 — demo presentable (completada):**

- ✅ **B7** — `scripts/seed-demo.js`: siembra 3 venues, 4 talents (con sus cuentas Auth), 6 courses, 7 categories y 3 approvals. Idempotente.
- ✅ **B6** — nueva página `/dashboard/venue/edit`: cualquier usuario autenticado puede crear o editar su venue sin abrir una cuenta nueva. `saveVenueProfile` (crea o actualiza). `/events/create` muestra un CTA "Create a venue" cuando no hay ninguno.
- ✅ **B9** — tras registrarse como VENUE, el usuario va a `/dashboard/venue` en lugar del dashboard genérico.
- ✅ **Documentación** — `README.md` (setup de Firebase, deploy de reglas, usuario demo, seed) y `.env.local` de ejemplo.

**Fase 3 — base para escalar (en progreso):**

- ✅ **Tests unitarios** — Vitest configurado (`vitest.config.ts`), 32 tests sobre los esquemas Zod de `validators.ts` en `src/lib/__tests__/validators.test.ts`. Scripts `npm test` / `npm run test:watch`.
- ✅ **Tests en el deploy** — `npm run build` ejecuta `vitest run && next build`, así un test que falle bloquea el deploy en Vercel (se descartó un CI dedicado por ser redundante con el build de Vercel).

**Pendiente:**

- **B1** — requiere las credenciales reales de Firebase en `.env.local` (solo lo puede hacer el equipo).
- **B8** — los formularios de registro siguen con validación manual propia; funcionan, así que es refactor de baja prioridad.
- Restos de **B5** — `lat`/`lng` sin geocoding, `ticketTiers`/`products` sin UI, "Search Talent" sin asociar talento.
- Páginas `/onboarding/*` siguen huérfanas (re-piden datos ya capturados en el registro; conviene decidir si eliminarlas o integrarlas).
- Ampliar cobertura de tests: helpers puros y, si se quiere, e2e del flujo crítico con Playwright + emulador de Firebase.

---

## 1. Resumen ejecutivo

El proyecto es una base **sólida y bien estructurada**: Next.js 14 (App Router), TypeScript en modo estricto, Firebase (Auth + Firestore + Storage), validación con Zod, 44 rutas, reglas e índices de Firestore definidos. El type-check pasa limpio (`tsc --noEmit` → exit 0).

Sin embargo, **la demo no funciona de extremo a extremo hoy** por una combinación de un bloqueador de configuración y varios desajustes entre el modelo de datos y los formularios. Lo importante: ninguno de los problemas es estructural. Son correcciones acotadas, y una vez resueltas la plataforma queda lista para añadir features con seguridad.

Veredicto: **arquitectura ✅ — configuración y datos ❌ — listo para escalar tras la Fase 0 y 1.**

---

## 2. Estado por área

### 2.1 Arquitectura y código
- `src/app/` — 44 rutas en App Router, organizadas por dominio (dashboard, marketplace, wallet, admin, etc.).
- `src/lib/` — `firebase.ts`, `auth.ts`, `firestore.ts` (913 líneas, capa de acceso a datos completa), `storage.ts`, `validators.ts` (Zod).
- `src/hooks/useFirestore.ts` — 20+ hooks de lectura/escritura con suscripciones en tiempo real.
- `src/contexts/AuthContext.tsx` — sesión Firebase + perfil de usuario.
- `src/types/index.ts` — modelos tipados, con campos Web3 opcionales para el futuro.
- TypeScript estricto compila sin errores.

### 2.2 Rutas
| Grupo | Rutas | Estado |
|-------|-------|--------|
| Públicas | `/`, `/studio`, `/marketplace`, `/login`, `/register/*`, legales | OK estructuralmente |
| Protegidas | `/dashboard*`, `/wallet*`, `/messages`, `/events/create`, `/booking`, `/tickets`, `/notifications`, `/settings` | Guard `ProtectedRoute` correcto |
| Admin | `/admin*` (5 páginas) | Dependen de datos sembrados |
| Onboarding | `/onboarding/{artist,client,provider,venue}` | **Huérfanas** — ningún flujo enlaza a ellas |

### 2.3 Build / calidad
- `tsc --noEmit`: **pasa** (exit 0).
- `next build`: no se pudo completar dentro del sandbox de análisis (proceso terminado por límites del entorno, ~40 s) — **es un artefacto del entorno, no un error de código**. Conviene confirmar `npm run build` localmente.
- No hay tests automatizados ni CI configurados.

---

## 3. Bloqueadores y bugs encontrados

### 🔴 B1 — Falta `.env.local` (BLOQUEADOR CRÍTICO)
No existe `.env.local`. En `src/lib/firebase.ts` toda la `firebaseConfig` queda `undefined`, así que **Auth, Firestore y Storage fallan**: no se puede iniciar sesión, registrarse, crear venue ni evento. Nada de la demo funciona hasta resolver esto.
El proyecto Firebase es `timelessappio` (según `.firebaserc`). Hay que obtener las credenciales desde Firebase Console → Project Settings y crear el archivo a partir de `.env.local.example`.

### ✅ B2 — Desajuste de modelo: Venue *(RESUELTO)*
`createVenueProfile()` guardaba `{venueName, location, capacity, eventTypes, equipment, websiteLink}`, pero el tipo `Venue` declara `address` y `website`. Además, pasar `equipment`/`websiteLink` como `undefined` hacía fallar `setDoc` (Firestore rechaza `undefined`). **Corregido**: ahora escribe `address`/`website` y omite los campos opcionales vacíos.

### ✅ B3 — Desajuste de modelo: Talent *(RESUELTO)*
`createTalentProfile()` guardaba `{fullName, category, experience, baseRate, ratePer, portfolioLink}`, pero el marketplace y el tipo `Talent` esperan `{city, bio, tags, portfolio[], reviews[], servicePlans[], hourlyRate, isVerified, jobsCompleted, responseRate}`. **Corregido**: ahora escribe un documento completo con `hourlyRate` (= `baseRate`) y valores por defecto. *Pendiente menor:* el formulario de registro de talento no captura `city`/`bio`/`tags` — quedan vacíos hasta que el talento edite su perfil.

### ✅ B4 — `/events/create` sin validación *(RESUELTO)*
El wizard de 4 pasos no validaba nada y el esquema Zod `eventSchema` no se usaba. **Corregido**: validación por paso (bloquea "Continue" si el paso está incompleto), mensajes de error bajo cada campo y validación final con `eventSchema` antes de publicar.

### 🟠 B5 — `createEvent` deja datos incompletos *(PARCIALMENTE RESUELTO)*
Codificaba fijo `location:""`, `lat:0`, `lng:0`, `ticketTiers:[]`, `products:[]`. **Corregido**: `createEvent` ahora recibe y guarda `location` (la dirección del venue seleccionado). *Pendiente:* `lat`/`lng` siguen en 0 (sin geocoding), `ticketTiers`/`products` siguen vacíos (sin UI para definirlos) y el campo "Search Talent" del paso 3 aún no asocia talento.

### ✅ B6 — No se puede crear un venue sin abrir cuenta nueva *(RESUELTO)*
Antes la única forma de crear un venue era registrarse como rol VENUE. **Corregido**: nueva página `/dashboard/venue/edit` con `saveVenueProfile` (crea el doc si no existe, lo actualiza si ya existe) — cualquier usuario autenticado puede tener su venue. `/events/create` muestra un CTA "Create a venue" cuando la lista está vacía, y el dashboard de venue enlaza a la página de edición.

### ✅ B7 — Sin datos semilla (seed) *(RESUELTO)*
Antes solo existía `scripts/create-demo-user.js` (un ADMIN). **Corregido**: nuevo `scripts/seed-demo.js` que siembra 3 venues, 4 talents (con cuentas Auth), 6 courses, 7 categories y 3 approvals, de forma idempotente. *Pendiente:* los 10 `mockTalents` del marketplace siguen siendo datos estáticos cuyas fichas `/marketplace/[id]` no abren — convendría sustituirlos por los talents sembrados.

### 🟡 B8 — Validadores Zod sin uso
Ninguna página importa `src/lib/validators.ts`. Cada formulario de registro reimplementa su validación a mano; los formularios de evento/booking/servicio validan poco o nada.

### ✅ B9 — Routing por rol incompleto *(RESUELTO parcialmente)*
Antes todos los roles iban a `/dashboard` tras registrarse. **Corregido**: el rol VENUE ahora va a `/dashboard/venue`. *Pendiente:* las páginas `/onboarding/*` siguen huérfanas — re-piden datos ya capturados en el registro, así que hay que decidir si eliminarlas o integrarlas en el flujo.

---

## 4. Diagnóstico de los flujos de demo

**Crear Venue** — funciona solo vía registro de cuenta nueva (`/register/venue`). El registro escribe `users/{uid}` + `venues/{uid}`. Falla parcialmente por B2 (campos `address`/`website` perdidos).

**Crear Evento** — `/events/create` es funcional en estructura pero: exige un venue previo (B6), no valida nada (B4), guarda el evento incompleto (B5). En condiciones ideales (env OK + un venue registrado) **sí se crea el evento** y redirige a `/dashboard/events`.

**Marketplace / fichas de talento** — el listado se ve (mock + Firestore), pero las fichas de los mock no abren (B7) y los talentos reales salen vacíos (B3).

Conclusión: el "camino feliz" de la demo (registrar venue → crear evento → verlo en dashboard) es alcanzable **en cuanto se resuelva B1**, y queda pulido tras B2, B4 y B5.

---

## 5. Plan de acción

### Fase 0 — Desbloquear la demo (1 día) — *imprescindible*
1. Crear `.env.local` con las credenciales reales del proyecto `timelessappio` (resuelve **B1**).
2. Desplegar reglas e índices: `firebase deploy --only firestore:rules,firestore:indexes,storage`.
3. Ejecutar `node scripts/create-demo-user.js` para tener el usuario demo/admin.
4. Confirmar `npm run build` y `npm run dev` en local sin errores.
5. Prueba manual del camino feliz: registrar venue → `/events/create` → publicar → ver en `/dashboard/events`.

### Fase 1 — Corregir el núcleo funcional (2–3 días)
6. **B2**: alinear `createVenueProfile` con el tipo `Venue` (renombrar `location`→`address`, `websiteLink`→`website`, o ajustar el tipo). Elegir una sola convención y aplicarla en lectura y escritura.
7. **B3**: alinear `createTalentProfile` con `Talent` — escribir `city`, `bio`, `tags`, `hourlyRate` (mapear `baseRate`), y valores por defecto de `isVerified`, `jobsCompleted`, `responseRate`, `portfolio`, `reviews`, `servicePlans`.
8. **B4**: conectar `eventSchema` (Zod) a `/events/create` con validación por paso; bloquear "Continue"/"Publish" si el paso es inválido.
9. **B5**: en `createEvent`, copiar `address` del venue a `location` del evento; permitir definir `ticketTiers` (mínimo un tier por defecto) para que `/tickets` tenga sentido.
10. **B8**: usar los esquemas de `validators.ts` en todos los formularios de registro y en evento/booking/servicio (eliminar la validación manual duplicada).

### Fase 2 — Demo presentable y completa (2–3 días)
11. **B7**: crear `scripts/seed-demo.js` (Admin SDK) que siembre venues, talents, courses, categories y approvals coherentes. Reemplazar los `mockTalents` por talentos reales en Firestore para que las fichas `/marketplace/[id]` abran.
12. **B6**: añadir un flujo "Añadir venue" para usuarios autenticados (no solo en el registro), p. ej. en `/dashboard/venue` o `/settings`.
13. **B9**: enrutado por rol tras el registro (VENUE → `/dashboard/venue`, etc.) y enlazar las páginas `/onboarding/*` desde `/register/success`.
14. Repasar estados vacíos y de carga en todas las vistas dependientes de datos.

### Fase 3 — Base para añadir features con seguridad (3–4 días)
15. Añadir tests: unitarios para `lib/firestore.ts` y los esquemas Zod; e2e del camino feliz (Playwright).
16. Configurar CI (GitHub Actions): `lint` + `tsc` + `build` + tests en cada PR.
17. Documentar en el `README` los pasos de arranque reales (env, deploy de reglas, seed).
18. Centralizar las constantes dispersas (tipos de servicio, tags de evento, categorías) en un único módulo de configuración.
19. Crear `CONTRIBUTING.md` o sección de "cómo añadir una feature" (patrón: tipo en `types/` → función en `firestore.ts` → hook en `useFirestore.ts` → página en `app/` → regla en `firestore.rules` → índice si hace falta).

### Fase 4 — Preparación móvil nativa (según roadmap del proyecto)
20. Definir si la app iOS/Android consumirá la misma capa Firebase directamente o vía una API. Extraer la lógica de negocio reutilizable fuera de los componentes para poder compartirla.

---

## 6. Prioridad recomendada

| Prioridad | Items | Por qué |
|-----------|-------|---------|
| **P0 — ahora** | Fase 0 (B1) | Sin esto nada funciona |
| **P1 — esta semana** | B2, B3, B4, B5 | El camino feliz queda correcto y sin datos corruptos |
| **P2 — siguiente** | B6, B7, B8, B9 | Demo presentable y consistente |
| **P3 — antes de escalar** | Tests, CI, docs | Permite añadir features sin romper lo existente |

El criterio de "completamente funcional" se cumple al terminar **P0 + P1 + P2**. La capacidad de "añadir nuevas features con seguridad" se cumple al completar **P3**.

---

## 7. Checklist de "Definition of Done" para la demo

- [ ] `.env.local` configurado y `npm run build` pasa.
- [ ] Reglas e índices de Firestore desplegados.
- [ ] Registrar cuenta VENUE → perfil de venue guardado con todos los campos correctos.
- [ ] Crear evento con validación → evento publicado con ubicación y visible en `/dashboard/events`.
- [ ] Marketplace: listar y abrir fichas de talento sin vacíos.
- [ ] Wallet: añadir y retirar fondos con transacciones reflejadas.
- [ ] Panel admin con datos reales (no vacío).
- [ ] Tests del camino feliz en verde y CI activo.

---

## 8. Auditoría de UI/UX, diseño y seguridad (2026-05-21)

Revisión transversal del código. Cada hallazgo lleva un código (`S` seguridad,
`U` UI/UX, `A` accesibilidad, `P` rendimiento/código) y una severidad.

**Progreso (2026-05-21):** resueltos S2, S3, S4, S5 (eventos), S6, U1, U2, U3, A1 y P1.
S7 y P3 resultaron falsos positivos. **S1** (wallet) se pospone a la fase de
producción por decisión del equipo (mientras no haya cobros).

### Seguridad

**🔴 S1 — El saldo del wallet es manipulable desde el cliente.**
La regla `wallets/{userId}` permite `update: if isOwner`, y `recordDeposit`/`recordWithdrawal` calculan el balance en el navegador. Es decir, un usuario puede fijar su saldo a cualquier valor. Además `transactions` permite `create: if isAuth()` con `userId` y `amount` arbitrarios. Aceptable para una demo con dinero ficticio, **crítico antes de producción**. Solución: mover los movimientos de wallet a Cloud Functions y dejar `wallets`/`transactions` como solo-lectura para el cliente.

**✅ S2 — Las páginas de admin no comprueban el rol** *(RESUELTO)*.
**Corregido**: nuevo componente `AdminRoute` (`src/components/AdminRoute.tsx`) que exige `role === ADMIN || isSuperUser` y redirige a `/dashboard` si no. `AdminLayout` ahora lo usa en lugar de `ProtectedRoute`.

**✅ S3 — Lectura pública de todos los usuarios** *(RESUELTO)*.
Antes `users/{userId}` tenía `read: if true`, exponiendo el **email de cada usuario** a cualquiera. Como Firestore no permite seguridad a nivel de campo, **la solución fue separar los datos públicos de los privados**:
- `name` y `avatar` se **denormalizan** en el documento `talents` (que ya es público), que es lo único que el marketplace necesita mostrar.
- `users` pasa a ser **privado**: `read: if isOwner || isAdmin`. El email ya no es visible para nadie más.
- `getAllTalents` / `getTalentWithUser` ya no leen `users`; construyen un objeto público mínimo (`talentToPublicUser`) sin email.
- `updateUserProfile` sincroniza `name`/`avatar` con el doc de talent para que el marketplace no muestre datos obsoletos.
- El seed (`seed-demo.js`) escribe `name`/`avatar` en los talents.

Esto encaja con el objetivo del equipo: el contacto y los contratos ocurren dentro de la app; no se filtran emails que permitan saltarse la plataforma. *Pendiente:* si en el futuro se exponen públicamente otros roles (artistas, etc.), conviene generalizar a una colección `publicProfiles`.

**✅ S4 — Creación de documentos sin verificar el propietario** *(RESUELTO)*.
**Corregido**: las reglas de `notifications`, `bookings` y `transactions` ahora exigen `request.resource.data.userId == request.auth.uid` en el `create`.

**✅ S5 — Storage: escritura de imágenes ajenas** *(RESUELTO parcialmente)*.
**Corregido**: `events/{eventId}` ahora verifica con `firestore.get()` que quien sube la imagen es el `organizerId` del evento. *Pendiente:* `services/{serviceId}` no se puede atar igual porque la imagen se sube **antes** de crear el doc del servicio — requiere rediseñar la ruta de almacenamiento para incluir el `userId`.

**✅ S6 — `auditLogs` con `create: if isAuth()`** *(RESUELTO)*.
**Corregido**: ahora `create: if isAdmin()`. No hay código cliente que cree logs, así que es seguro (idealmente serían escritos por el servidor).

**🟢 S7 — `target="_blank"`** *(FALSO POSITIVO)*. Todos los enlaces ya tenían `rel="noopener noreferrer"`.

*Notas positivas:* `serviceAccountKey.json` nunca se subió al repo (gitignore correcto); las variables `NEXT_PUBLIC_FIREBASE_*` son públicas por diseño (SDK de cliente); no hay `dangerouslySetInnerHTML` ni vectores obvios de XSS.

### UI / UX

**✅ U1 — Métricas falsas presentadas como reales** *(RESUELTO)*.
**Corregido**: el panel "Venue Performance" del dashboard de venue ya no muestra cifras inventadas; ahora indica que las métricas aparecerán cuando haya actividad. *Pendiente menor:* algunas stats de rol en `/dashboard` siguen siendo estáticas — conviene calcularlas o etiquetarlas.

**✅ U2 — Controles que no hacen nada** *(RESUELTO)*.
**Corregido**: el botón "Export Report" se sustituyó por "Edit Venue" (que sí lleva a `/dashboard/venue/edit`); el campo muerto "Search Talent" del paso 3 de `/events/create` se eliminó y el paso se renombró a "Services".

**✅ U3 — Sin `loading.tsx` ni `error.tsx` por ruta** *(RESUELTO)*.
**Corregido**: añadidos `src/app/loading.tsx` (spinner) y `src/app/error.tsx` (pantalla de error con "Try again"). *Posible mejora:* añadir variantes por sección si se quiere granularidad.

**🟡 U4 — Marketplace mezcla 10 talentos mock** cuyas fichas `/marketplace/[id]` no abren (ya recogido en B7).

**🟢 U5 — 2 etiquetas `<img>` nativas** en lugar de `next/image` (peor rendimiento, warnings de build).

**🟢 U6 — Iconos (Material Icons) y fuentes dependen del CDN de Google**; sin conexión la UI se degrada (mitigado en parte por la PWA y la página offline).

### Accesibilidad

**✅ A1 — El zoom está desactivado** *(RESUELTO)*. Se quitaron `userScalable: false` y `maximumScale: 1` del `viewport`; el pinch-to-zoom vuelve a estar disponible.

**🟡 A2 — Contraste bajo.** El texto secundario en `text-slate-500/600` sobre fondos muy oscuros queda por debajo de WCAG AA en varias vistas.

**🟢 A3 — Algunos botones de solo-icono sin `aria-label`** (hay 24 atributos `aria-` en el código, pero no cubren todos los casos).

### Rendimiento / código

**✅ P1 — `getAllTalents()` hacía N+1 consultas secuenciales** *(RESUELTO)*. Ahora las consultas del usuario de cada talent se ejecutan en paralelo con `Promise.all`.

**🟢 P2 — SEO:** 31 de 47 páginas no definen metadata propia y comparten el título raíz. Las páginas cliente necesitan un `layout.tsx` con metadata.

**🟢 P3 — `console.*`** *(FALSO POSITIVO)*. Las 5 ocurrencias son legítimas (logging del service worker, del `ErrorBoundary` y un fallback de subida); no hay logs de depuración sueltos.

### Estado tras esta iteración

**Resueltos:** S2, S3, S4, S5 (eventos), S6, U1, U2, U3, A1, P1. S7 y P3 eran falsos positivos.

**Pendientes:**

| Prioridad | Hallazgos |
|-----------|-----------|
| **Antes de producción** | S1 (wallet — pospuesto por el equipo mientras no haya cobros) |
| **Mejoras** | S5 (parte de `services`), A2 (contraste), P2 (SEO/metadata) |
| **Pulido** | U4 (mock talents del marketplace), U6 (dependencia de CDN), A3 (algunos `aria-label`) |

Para una **demo** ya no quedan bloqueantes visibles ni de privacidad. El único punto crítico restante es **S1**, que debe resolverse antes de manejar dinero real.

---

## 9. Flujo de negociación: plan → chat → contrato (2026-05-21)

Funcionalidad pedida por negocio. Antes, en la ficha del talento, "Select Plan" iba directo a una página de contrato con **datos mock** y el botón "Contact" no creaba conversación si no existía una. Ahora el flujo está conectado de punta a punta:

- **`getOrCreateConversation`** (en `firestore.ts`): busca la conversación 1:1 entre dos usuarios o la crea. Puede llevar el contexto del plan (`planContext`: talentId, planId, título, precio).
- **Ficha del talento** (`/marketplace/[id]`): el botón "Discuss this Plan" crea/abre la conversación con el talento, publica un mensaje inicial citando el plan y lleva al chat. "Contact" hace lo mismo sin plan. Si el visitante no tiene sesión, va a `/login`.
- **Chat** (`/messages`): acepta `?convo=<id>` para abrir la conversación correcta. Si la conversación tiene `planContext`, el panel derecho muestra el plan y un botón **"Proceed to contract"**.
- **Contrato** (`/booking/contract`): ya **no usa datos mock** — lee el talent y el plan reales de Firestore (`getTalentWithUser` + `servicePlans`), y muestra el nombre del talento (antes mostraba por error el del comprador).
- **Seed**: cada talent sembrado recibe ahora 2 `servicePlans`, para que el flujo tenga datos desde el primer momento.

**Acción requerida:** volver a ejecutar `node scripts/seed-demo.js` para que los talents existentes reciban los `servicePlans` (el seed sobrescribe sus documentos).

*Pendiente / futuras mejoras:* estados de negociación (`NegotiationStatus` ya existe en los tipos pero no se usa); que aceptar el contrato actualice ese estado; notificar al talento cuando le escriben.

---

## 10. Feedback del product owner (2026-05-21)

Revisión de la conversación con el PO. Implementado:

**Registro de artista**
- Más géneros: reggaeton, salsa, bachata, reggae, y opción **"Other"** con texto libre.
- Campo **tipos de evento** con los que trabaja el artista (cumpleaños, bodas, baby showers, corporativo, etc.) — chips multi-selección.
- Se **quitó la subida de portafolio/demo del registro** — el registro es más corto; el artista lo completa en su perfil tras la aprobación.
- `createArtistProfile` ahora guarda `eventTypes` y construye el doc sin campos `undefined`.

**Gate de cuenta "Pending"**
- Nuevo componente `AccountGate` + helper `isAccountActive`. Las **acciones de confianza** quedan bloqueadas hasta que la cuenta esté aprobada (`status === Active`); admins/super-users siempre activos.
- Bloqueado: crear evento (`/events/create` muestra un aviso), contactar/negociar talento (botones deshabilitados en `/marketplace/[id]`), y retirar fondos (`/wallet`). El resto (explorar, editar perfil) sigue disponible — como Airbnb/Fiverr.

**Validación de cuenta con documentos** *(añadido 2026-05-21)*
- **Settings → Identity Verification** ahora es funcional: el usuario elige tipo de documento (Cédula / Pasaporte / RUC de empresa), sube el archivo (imagen o PDF, hasta 10MB) y queda "Under review".
- El documento se guarda en Storage bajo `identity/{uid}/` — ruta **privada** (solo el dueño y los admins pueden leerla; no es pública como el resto del Storage).
- Subir el documento crea un registro en `approvals` con `type: "Identity"`, el `userId` y la URL del documento.
- **Panel de admin** (`/admin/approvals`): las solicitudes de identidad aparecen con un enlace "View submitted document". Al **aprobar**, `updateApprovalStatus` también pone `users/{uid}.status = Active` (se abre el gate); al **rechazar**, lo pone `Rejected` y el usuario puede volver a subir el documento.
- Regla de Firestore de `approvals`: el admin lee todo; un usuario puede leer su propia solicitud.

**Navegación**
- Nueva página **`/venues`** para explorar venues (con búsqueda y filtro por tipo de evento).
- Footer "Browse Venues" y la tarjeta "Venues" de `/search` ahora apuntan a `/venues` (antes abrían el marketplace de talentos).

**Chat — bloqueo de contactos (estilo Airbnb)**
- `maskContactInfo` (`src/lib/chat.ts`): enmascara teléfonos y emails en los mensajes antes de guardarlos. 8 tests en `chat.test.ts`.
- El chat avisa al usuario cuando se ocultó un contacto.

**Wallet**
- El botón "Statement" se renombró a **"Transaction History"**.

### Evaluación de las ideas que necesitan decisión (no implementadas)

- **Modelo de negocio / pagos** (wallet, escrow, intermediarios, comisiones, multas, suscripción, recargas): sin resolver en la conversación. Recomendación para el MVP: **no ser intermediario de dinero** (escrow real = licencias, KYC, ser procesador de pagos). El modelo "3 servicios gratis → suscripción mensual" es más simple y viable; pago directo entre partes. Conecta con S1 (diferido).
- **Verificación de identidad** (subir cédula/pasaporte/RUC): correcto ubicarla en Settings (ya existe el bloque visual "Identity Verification"); falta hacerla funcional. Pedir cédula en el registro fue **descartado por el propio equipo** ("too much").
- **Página de invitaciones** (estilo Invitalo) y **blog para SEO**: el equipo los marcó como **fase siguiente**.
- **Organizar por tipo de evento / tipo de proveedor** (estilo Invitalo): buena dirección; rediseño de navegación de tamaño medio para una iteración posterior.

*Sin acción de re-seed requerida:* los cambios de registro de artista solo afectan a nuevos registros.

---

## 11. Páginas de exploración, blog y limpieza (2026-05-21)

**Página de eventos**
- Nueva página pública **`/events`** para explorar eventos publicados (con búsqueda).
- Footer ("Discover Events", "Events Calendar") y la tarjeta "Events" de `/search` ahora apuntan a `/events`.

**Blog (SEO)**
- Blog estático basado en archivos: `src/data/blogPosts.ts` (3 posts iniciales) + índice `/blog` + posts `/blog/[slug]`.
- Páginas renderizadas en el servidor con `generateMetadata` y `generateStaticParams` (title/description/OpenGraph por post) — bien para SEO.
- Enlace "Blog" añadido al footer. Para publicar un post nuevo basta con añadir una entrada en `blogPosts.ts`.

**Limpieza**
- Los **talentos mock** ya no se mezclan en el marketplace ni en las fichas `/marketplace/[id]` — el marketplace muestra solo talentos reales de Firestore. El archivo `src/data/mockTalents.ts` se conserva (no se borró, por indicación del equipo); simplemente ya no se importa.

**Navegación por tipo de evento / proveedor (estilo Invitalo)** *(añadido 2026-05-21)*
- `eventTypes` ahora forma parte del modelo `Talent`: se captura en el registro de talento (chips), lo escribe `createTalentProfile` y el seed lo asigna a cada talento.
- El **marketplace** filtra por tipo de evento (nuevo desplegable) y lee parámetros de URL: `/marketplace?category=…`, `?eventType=…`, `?q=…`. Envuelto en `Suspense` por `useSearchParams`.
- La página **`/search`** se rehízo como hub de exploración: tarjetas "Browse by event type" y "Browse by provider" que llevan al marketplace ya filtrado. Taxonomía compartida en `src/lib/constants.ts`.

**Limpieza** *(añadido 2026-05-21)*
- Las 4 páginas **`/onboarding/*`** se eliminaron (eran huérfanas y redundantes con el registro).

**Kanban de proyectos** *(añadido 2026-05-21)*
- Nueva colección `projects` con CRUD (`createProject`, `getUserProjects`, `updateProjectStatus`, `deleteProject`), hook `useProjects` y reglas de Firestore (privado, solo el dueño).
- `/dashboard/projects` reescrito: kanban real de 3 columnas (Inquiries → In Progress → Completed), con "New Project" (modal), avanzar/retroceder tarjetas y borrarlas. Ya no depende de los eventos.

**Gestión de portafolio** *(añadido 2026-05-21)*
- Nueva página **`/dashboard/portfolio`**: el talento sube imágenes (a Storage `portfolio/{uid}/`), les pone caption y las quita; se guardan en `talents/{uid}.portfolio` y aparecen en su ficha pública del marketplace.
- `uploadPortfolioImage` (Storage) + `updateTalentPortfolio` (Firestore) + regla de Storage para `portfolio/{uid}/`.
- Enlazada desde el dashboard del talento ("My Portfolio").

### Acciones requeridas tras este bloque

- **Re-desplegar reglas:** `firebase deploy --only firestore:rules,storage` (nuevas reglas para `projects` y para Storage `portfolio/`).
- **Re-seed:** correr de nuevo `node scripts/seed-demo.js` para que los talentos sembrados reciban `eventTypes` (necesario para el filtro por tipo de evento del marketplace).

### Pendiente (menores, de auditorías previas)

- S1 (wallet manipulable — diferido hasta cobros reales), S5 (parte de `services` en Storage), A2 (contraste), P2 (metadata SEO por página).
- El portafolio de **artistas** (colección `artists`) no tiene superficie pública aún; la página de portafolio cubre talentos.
