# Timeless — reglas del proyecto

Marketplace de la industria del entretenimiento (artistas, venues, talentos, clientes):
descubrimiento, eventos, reservas, mensajería, wallet/pagos y servicios de estudio.
Hoy es web; habrá app nativa iOS/Android más adelante — no acoplar nada a «solo web».

- **Stack**: Next.js + React + Firebase (Auth, Firestore, Storage) + Zod.
- **Leer antes de trabajar**: `ACTION_PLAN.md` (estado y roadmap vigentes) y
  `HANDOVER.md` (contexto de traspaso). No rehacer decisiones que ya están ahí.
- Las reglas de seguridad viven en `firestore.rules` — cualquier colección nueva
  entra con sus reglas, nunca «abierta mientras tanto».
- Diseño en `design/` — respetarlo antes de inventar UI.
