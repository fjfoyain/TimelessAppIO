# Timeless - Entertainment Industry Marketplace

Timeless is a full-stack web platform connecting artists, venues, talents, and clients in the entertainment industry. It provides marketplace discovery, event management, booking, messaging, wallet/payments, and studio services.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS (custom dark theme) |
| **Auth** | Firebase Authentication |
| **Database** | Firebase Firestore |
| **Storage** | Firebase Storage |
| **Validation** | Zod schemas |
| **Icons** | Material Icons (Google Fonts CDN) |
| **Font** | Be Vietnam Pro (Google Fonts) |
| **Deploy** | Vercel |

## Design System

- **Primary**: `#7f13ec` (electric purple)
- **Dark Theme Only**: backgrounds `#0a060f`, `#050408`, `#191022`
- **Glass Panels**: `backdrop-blur-xl` + `border-white/5`
- **Glow Effects**: `shadow-glow`, `btn-glow` classes
- **Accents**: Cyan `#00f0ff`, Fuchsia `#d946ef`

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page (App tab)
│   ├── studio/                   # Studio landing + classes
│   ├── login/                    # Authentication
│   ├── forgot-password/          # Password recovery (Firebase)
│   ├── register/                 # Registration (artist/client/talent/venue)
│   ├── dashboard/                # Role-based dashboard + sub-views
│   │   ├── events/               # Event/gig management
│   │   ├── venue/                # Venue-specific dashboard
│   │   └── projects/             # Project/booking manager (kanban)
│   ├── marketplace/              # Talent browse + [id] profiles
│   ├── wallet/                   # Wallet + transaction history
│   ├── messages/                 # Messaging & contract hub
│   ├── events/create/            # Multi-step event creation wizard
│   ├── booking/                  # Booking calendar
│   ├── notifications/            # Notifications center
│   ├── admin/                    # Admin suite (5 pages)
│   │   ├── analytics/
│   │   ├── logs/
│   │   ├── approvals/
│   │   └── categories/
│   ├── settings/                 # Account & security settings
│   ├── tickets/                  # Digital tickets with QR codes
│   ├── services/new/             # Add provider service
│   ├── search/                   # Global search
│   ├── help/                     # Help & support center
│   ├── contact/                  # Contact form + WhatsApp
│   ├── terms/                    # Terms of service
│   ├── privacy/                  # Privacy policy
│   ├── onboarding/               # Role-specific onboarding tours
│   ├── coming-soon/              # Waitlist landing
│   ├── maintenance/              # System maintenance page
│   ├── logout/                   # Logout confirmation
│   └── not-found.tsx             # Custom 404 page
├── components/
│   ├── landing/                  # Shared: Navbar, Footer, AnimatedBackground, WhatsAppFAB
│   ├── marketplace/              # TalentCard
│   ├── legal/                    # LegalLayout (sidebar for terms/privacy)
│   ├── admin/                    # AdminLayout (sidebar for admin pages)
│   ├── registration/             # Shared registration components
│   └── ProtectedRoute.tsx        # Auth guard wrapper
├── contexts/
│   └── AuthContext.tsx            # Firebase auth context + useAuth hook
├── data/
│   └── mockTalents.ts            # Mock talent data (10 talents)
├── lib/
│   ├── firebase.ts               # Firebase app initialization
│   ├── auth.ts                   # Auth helpers (signIn, signUp, signOut)
│   ├── firestore.ts              # Firestore helpers
│   └── validators.ts             # Zod validation schemas
└── types/
    └── index.ts                  # TypeScript data models (Web3-ready)
```

## Routes (44 total)

### Public Pages
| Route | Description |
|-------|------------|
| `/` | Landing page - App tab |
| `/studio` | Landing page - Studio tab |
| `/studio/classes` | Studio masterclass catalog |
| `/marketplace` | Talent browse with search/filters |
| `/marketplace/[id]` | Talent profile page |
| `/login` | Sign in |
| `/forgot-password` | Password recovery (Firebase) |
| `/register` | Role selection |
| `/register/artist` | Artist registration |
| `/register/client` | Client registration |
| `/register/talent` | Talent registration |
| `/register/venue` | Venue registration |
| `/register/success` | Registration success |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |
| `/contact` | Contact & support (WhatsApp) |
| `/search` | Global search |
| `/help` | Help center |
| `/onboarding/*` | Role-specific onboarding (4 routes) |
| `/coming-soon` | Waitlist page |
| `/maintenance` | System maintenance |
| `/logout` | Logout screen |

### Protected Pages (require auth)
| Route | Description |
|-------|------------|
| `/dashboard` | Role-based main dashboard |
| `/dashboard/events` | Event/gig management |
| `/dashboard/venue` | Venue dashboard |
| `/dashboard/projects` | Project manager (kanban) |
| `/wallet` | Wallet & earnings |
| `/wallet/transactions` | Transaction history |
| `/messages` | Messaging & contracts |
| `/events/create` | Create event wizard |
| `/booking` | Booking calendar |
| `/notifications` | Notification center |
| `/settings` | Account & security |
| `/tickets` | Digital tickets & QR |
| `/services/new` | Add provider service |

### Admin Pages (require admin role)
| Route | Description |
|-------|------------|
| `/admin` | Admin control center |
| `/admin/analytics` | Analytics dashboard |
| `/admin/logs` | Audit & system logs |
| `/admin/approvals` | Pending approvals |
| `/admin/categories` | Category manager |

## User Roles

| Role | Access |
|------|--------|
| `ADMIN` | Full access + admin panel |
| `ARTIST` | Dashboard, events, wallet, messages |
| `CLIENT` | Dashboard, marketplace, events, messages |
| `TALENT` | Dashboard, wallet, bookings, messages |
| `VENUE` | Venue dashboard, bookings, events |
| `PROVIDER` | Services, bookings, wallet |

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Auth + Firestore enabled

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd TimelessappIO

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in your Firebase credentials

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

Vercel settings:
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: (leave empty)

## Web3 Roadmap

The data models include optional Web3 fields for future integration:
- Wallet addresses, chain IDs
- NFT ticket contracts
- On-chain transaction hashes
- Creator tokens
- Soulbound badges

Target chain: **Base** (low fees, Coinbase ecosystem, EVM compatible).

## Contact

- **WhatsApp**: +593 95-890-9112
- **Email**: priority@timeless.com

---

Built with Next.js, TypeScript, Tailwind CSS, and Firebase.
