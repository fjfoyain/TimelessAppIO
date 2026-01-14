# 🚀 Timeless App - Complete Deployment Guide

**Domain**: timelessapp.io (Hostinger)  
**Tech Stack**: React + TypeScript (Frontend) + Node.js (Backend)  
**Target**: Free deployment → AWS/Google Cloud scaling

---

## 📋 TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Project Setup & Consolidation](#project-setup--consolidation)
3. [Backend Setup & Database](#backend-setup--database)
4. [Frontend Configuration](#frontend-configuration)
5. [Domain & DNS Configuration](#domain--dns-configuration)
6. [Deployment Steps](#deployment-steps)
7. [Post-Deployment Tasks](#post-deployment-tasks)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Scaling Strategy](#scaling-strategy)
10. [Web3 Integration Preparation](#web3-integration-preparation)

---

## 🎯 PRE-DEPLOYMENT CHECKLIST

### ✅ Before You Start

- [ ] Have GitHub account ready
- [ ] Have domain access (timelessapp.io at Hostinger)
- [ ] Install Git locally
- [ ] Install Node.js v18+ and npm
- [ ] Have VS Code with your current code open
- [ ] Create accounts on:
  - [ ] Vercel (frontend hosting)
  - [ ] Supabase (database & auth)
  - [ ] Cloudflare (DNS & CDN)
  - [ ] Sentry (error tracking - optional)

---

## 🔧 PROJECT SETUP & CONSOLIDATION

### Step 1: Consolidate Your Code

If you have multiple versions, choose the most complete one:

```bash
# Navigate to your main project folder
cd /path/to/your/timeless-project

# Check what you have
ls -la

# If you have duplicates (Timeless-app-main and Timeless-1-frontend-main)
# Keep only Timeless-app-main and archive the other
mv Timeless-1-frontend-main Timeless-1-frontend-main.backup
```

### Step 2: Initialize Git Repository

```bash
# In your main project folder
git init

# Create .gitignore file
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Misc
.eslintcache
.stylelintcache
EOF

# Add all files
git add .

# Initial commit
git commit -m "Initial commit - Timeless App"
```

### Step 3: Create GitHub Repository

```bash
# Create a new repo on GitHub.com (use the web interface)
# Then connect your local repo:

git remote add origin https://github.com/YOUR_USERNAME/timeless-app.git
git branch -M main
git push -u origin main
```

---

## 🗄️ BACKEND SETUP & DATABASE

### Option A: Supabase (Recommended for Free Start)

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill details:
   - **Name**: timeless-app
   - **Database Password**: (generate strong password - SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free

#### 2. Create Database Schema

In Supabase SQL Editor, run this:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('client', 'talent', 'admin')) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Talents table
CREATE TABLE public.talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  skills TEXT[],
  portfolio_urls TEXT[],
  availability_status TEXT DEFAULT 'available',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_id UUID REFERENCES public.talents(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours DECIMAL(4,2) NOT NULL,
  location TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  talent_id UUID REFERENCES public.talents(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_talents_category ON public.talents(category);
CREATE INDEX idx_talents_user_id ON public.talents(user_id);
CREATE INDEX idx_events_talent_id ON public.events(talent_id);
CREATE INDEX idx_events_client_id ON public.events(client_id);
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for talents
CREATE POLICY "Talents are viewable by everyone"
  ON public.talents FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own talent profile"
  ON public.talents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own talent profile"
  ON public.talents FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Users can view their own events"
  ON public.events FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() IN (
    SELECT user_id FROM public.talents WHERE id = talent_id
  ));

CREATE POLICY "Clients can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_talents_updated_at BEFORE UPDATE ON public.talents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 3. Get Supabase Credentials

In Supabase Dashboard:
1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (keep this SECRET!)

#### 4. Enable Storage for Files

In Supabase Dashboard:
1. Go to **Storage**
2. Create buckets:
   - `avatars` (public)
   - `portfolios` (public)
   - `event-media` (public)

Storage policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('avatars', 'portfolios', 'event-media'));

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('avatars', 'portfolios', 'event-media') AND auth.role() = 'authenticated');

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (auth.uid()::text = owner);
```

---

## 💻 FRONTEND CONFIGURATION

### Step 1: Update Package.json

In your frontend folder, ensure you have:

```json
{
  "name": "timeless-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.17.0",
    "lucide-react": "^0.344.0",
    "zod": "^3.22.4",
    "date-fns": "^3.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.57.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vite": "^5.2.0"
  }
}
```

### Step 2: Install Dependencies

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Install fresh dependencies
npm install

# Install Tailwind CSS properly (if not already)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: Create Environment Variables

Create `.env.local` file in your frontend root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=https://api.timelessapp.io
```

**IMPORTANT**: Add `.env.local` to `.gitignore` (should already be there)

### Step 4: Configure Tailwind

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        dark: '#0f172a',
        light: '#f1f5f9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Step 5: Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper for auth
export const auth = supabase.auth

// Helper for storage
export const storage = supabase.storage

// Type definitions for your database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'client' | 'talent' | 'admin'
          avatar_url: string | null
          bio: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      talents: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          hourly_rate: number
          rating: number
          total_reviews: number
          skills: string[]
          portfolio_urls: string[]
          availability_status: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['talents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['talents']['Insert']>
      }
      // Add other tables as needed
    }
  }
}
```

### Step 6: Setup React Query

Create `src/lib/queryClient.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

Update `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

### Step 7: Create API Hooks

Create `src/hooks/useAuth.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    },
  })

  const signUp = useMutation({
    mutationFn: async ({ email, password, fullName, role }: {
      email: string
      password: string
      fullName: string
      role: 'client' | 'talent'
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    user: session?.user,
    signUp,
    signIn,
    signOut,
  }
}
```

Create `src/hooks/useTalents.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/supabase'

type Talent = Database['public']['Tables']['talents']['Row']

export function useTalents() {
  return useQuery({
    queryKey: ['talents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .eq('availability_status', 'available')
        .order('rating', { ascending: false })
      
      if (error) throw error
      return data as Talent[]
    },
  })
}

export function useTalent(id: string) {
  return useQuery({
    queryKey: ['talent', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talents')
        .select('*, profiles(*)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateTalent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (talent: Database['public']['Tables']['talents']['Insert']) => {
      const { data, error } = await supabase
        .from('talents')
        .insert(talent)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talents'] })
    },
  })
}
```

---

## 🌐 DOMAIN & DNS CONFIGURATION

### Step 1: Cloudflare Setup (Recommended)

1. **Sign up** at [cloudflare.com](https://cloudflare.com)
2. **Add Site**: Enter `timelessapp.io`
3. **Select Plan**: Free
4. **Copy Nameservers** (you'll get something like):
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```

### Step 2: Update Hostinger DNS

1. Log in to Hostinger
2. Go to **Domain** → **DNS Zone**
3. Change nameservers to Cloudflare's:
   - Remove existing nameservers
   - Add Cloudflare nameservers
   - Save changes

**Wait 24-48 hours** for DNS propagation (usually faster)

### Step 3: Configure Cloudflare DNS Records

Once domain is active in Cloudflare:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | @ | your-app.vercel.app | ✅ Proxied |
| CNAME | www | your-app.vercel.app | ✅ Proxied |
| CNAME | api | your-backend.railway.app | ✅ Proxied |

### Step 4: Enable Cloudflare Features

In Cloudflare Dashboard:

- **SSL/TLS**: Set to "Full (strict)"
- **Speed** → **Optimization**: Enable Auto Minify (JS, CSS, HTML)
- **Caching**: Enable Development Mode initially, disable after testing
- **Security** → **Settings**: 
  - Security Level: Medium
  - Challenge Passage: 30 minutes

---

## 🚀 DEPLOYMENT STEPS

### Phase 1: Deploy Frontend to Vercel

#### 1. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your `timeless-app` repository

#### 2. Configure Build Settings

Vercel should auto-detect, but verify:

```yaml
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 3. Add Environment Variables

In Vercel Project Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Deploy

Click **"Deploy"** - Vercel will:
- Install dependencies
- Build your app
- Deploy to a URL like `timeless-app.vercel.app`

#### 5. Add Custom Domain

In Vercel → Domains:
1. Add `timelessapp.io`
2. Add `www.timelessapp.io`
3. Vercel will provide DNS records (already done in Cloudflare step)

### Phase 2: Backend Deployment (if separate)

If you have a separate backend:

#### Option A: Railway (Easiest)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to project
railway link

# Add environment variables
railway variables set DATABASE_URL=your-supabase-url
railway variables set SUPABASE_KEY=your-service-role-key

# Deploy
railway up
```

#### Option B: Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables
6. Deploy

---

## ✅ POST-DEPLOYMENT TASKS

### 1. Verify Deployment

```bash
# Check if site is live
curl -I https://timelessapp.io

# Expected response: 200 OK
```

### 2. Test Core Functionality

- [ ] Homepage loads correctly
- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Browse talents
- [ ] Create booking
- [ ] Send message
- [ ] Mobile responsiveness

### 3. Performance Optimization

#### Enable Compression in Vercel

Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.timelessapp.io/:path*"
    }
  ]
}
```

#### Optimize Images

Install and use `vite-imagetools`:

```bash
npm install -D vite-imagetools
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [react(), imagetools()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
})
```

### 4. Setup Error Tracking

#### Add Sentry

```bash
npm install @sentry/react
```

Create `src/lib/sentry.ts`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
});
```

Update `src/main.tsx`:

```typescript
import './lib/sentry'
// ... rest of imports
```

### 5. Setup Analytics

#### Add Vercel Analytics

```bash
npm install @vercel/analytics
```

Update `src/main.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Analytics />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

---

## 📊 MONITORING & MAINTENANCE

### Daily Checks

```bash
# Create a monitoring script
cat > monitor.sh << 'EOF'
#!/bin/bash

echo "🔍 Checking Timeless App Status..."

# Check uptime
STATUS=$(curl -o /dev/null -s -w "%{http_code}" https://timelessapp.io)
if [ $STATUS -eq 200 ]; then
  echo "✅ Site is UP (Status: $STATUS)"
else
  echo "❌ Site is DOWN (Status: $STATUS)"
fi

# Check API
API_STATUS=$(curl -o /dev/null -s -w "%{http_code}" https://api.timelessapp.io/health)
echo "📡 API Status: $API_STATUS"

# Check Supabase
echo "🗄️  Checking database..."
# Add Supabase health check here

echo "Done!"
EOF

chmod +x monitor.sh
```

### Setup Uptime Monitoring

Use a free service:

1. **UptimeRobot** (uptimerobot.com):
   - Add monitor for `https://timelessapp.io`
   - Check every 5 minutes
   - Alert via email if down

2. **Better Uptime** (betteruptime.com):
   - More detailed monitoring
   - Status page for users

### Weekly Tasks

- [ ] Check Vercel analytics
- [ ] Review Sentry errors
- [ ] Check Supabase database size
- [ ] Backup database (Supabase auto-backups, but verify)
- [ ] Review user feedback
- [ ] Update dependencies if needed

### Monthly Tasks

- [ ] Security audit
- [ ] Performance review
- [ ] Cost analysis
- [ ] Feature planning
- [ ] Database optimization

---

## 📈 SCALING STRATEGY

### Stage 1: 0-1000 Users (Current Setup)

**Cost**: $0-25/month

```
Frontend: Vercel Free
Backend: Supabase Free
CDN: Cloudflare Free
Monitoring: Free tiers
```

**Capacity**:
- 100GB bandwidth
- 500MB database
- 1GB file storage

### Stage 2: 1K-10K Users

**Cost**: $25-100/month

**Upgrades**:
1. Supabase Pro ($25/mo):
   - 8GB database
   - 100GB bandwidth
   - Daily backups
   - No pausing

2. Vercel Pro ($20/mo):
   - More build minutes
   - Better analytics
   - Team features

### Stage 3: 10K-100K Users

**Cost**: $200-500/month

**Migration to AWS/GCP**:

```
Architecture:
├── CloudFront/Cloud CDN (Global CDN)
├── S3/Cloud Storage (Static files)
├── API Gateway (API routing)
├── Lambda/Cloud Run (Serverless backend)
├── RDS/Cloud SQL (PostgreSQL)
└── ElastiCache/Memorystore (Redis caching)
```

**Migration Steps**:

1. **Database**: Export from Supabase → Import to AWS RDS
2. **Files**: Sync Supabase Storage → S3/GCS
3. **API**: Deploy backend to Lambda/Cloud Run
4. **Frontend**: Move to S3 + CloudFront
5. **Update DNS**: Point to new infrastructure

### Stage 4: 100K+ Users

**Cost**: $1000+/month

**Advanced Architecture**:

```
Route 53 (DNS)
  ↓
CloudFront (Multi-region CDN)
  ↓
ALB (Load Balancer)
  ↓
ECS/EKS (Container orchestration)
  ↓
RDS Multi-AZ (High availability DB)
  ↓
ElastiCache Cluster (Distributed cache)
```

**Features**:
- Multi-region deployment
- Auto-scaling
- Advanced monitoring (CloudWatch/Stackdriver)
- WAF protection
- DDoS mitigation

---

## 🔗 WEB3 INTEGRATION PREPARATION

### Phase 1: Setup (Before Launch)

Create project structure:

```bash
mkdir -p src/web3/{contracts,hooks,services,utils}
```

Install dependencies:

```bash
npm install ethers@^6 wagmi@^2 viem@^2 @rainbow-me/rainbowkit@^2
```

### Phase 2: Basic Wallet Integration

Create `src/web3/config.ts`:

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygon, polygonMumbai } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'Timeless',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [polygon, polygonMumbai],
})
```

Create `src/web3/hooks/useWallet.ts`:

```typescript
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return {
    address,
    isConnected,
    connect,
    disconnect,
    connectors,
  }
}
```

### Phase 3: NFT Tickets (Future)

Smart contract structure:

```solidity
// EventTicket.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicket is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct Ticket {
        uint256 eventId;
        address talent;
        uint256 price;
        uint256 eventDate;
    }
    
    mapping(uint256 => Ticket) public tickets;
    
    constructor() ERC721("TimelessTicket", "TICKET") {}
    
    function mintTicket(
        address to,
        uint256 eventId,
        address talent,
        uint256 price,
        uint256 eventDate
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        
        tickets[tokenId] = Ticket({
            eventId: eventId,
            talent: talent,
            price: price,
            eventDate: eventDate
        });
        
        return tokenId;
    }
}
```

Deploy script:

```typescript
// scripts/deploy.ts
import { ethers } from 'hardhat'

async function main() {
  const EventTicket = await ethers.getContractFactory('EventTicket')
  const ticket = await EventTicket.deploy()
  await ticket.deployed()
  
  console.log('EventTicket deployed to:', ticket.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
```

---

## 🎯 IMMEDIATE ACTION CHECKLIST

### Week 1: Foundation ✅

- [ ] Consolidate code to single repo
- [ ] Initialize git and push to GitHub
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Setup environment variables
- [ ] Test local development

### Week 2: Deployment 🚀

- [ ] Deploy frontend to Vercel
- [ ] Configure custom domain (timelessapp.io)
- [ ] Setup Cloudflare DNS
- [ ] Add SSL certificate (auto via Cloudflare)
- [ ] Test production site
- [ ] Setup error tracking

### Week 3: Polish ✨

- [ ] Fix any bugs found in testing
- [ ] Optimize images and assets
- [ ] Add loading states
- [ ] Improve mobile experience
- [ ] Add analytics
- [ ] Create basic documentation

### Week 4: Launch Prep 🎊

- [ ] Final security review
- [ ] Performance optimization
- [ ] Create backup strategy
- [ ] Setup monitoring alerts
- [ ] Prepare launch announcement
- [ ] Soft launch to beta users

---

## 📚 USEFUL COMMANDS REFERENCE

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

### Deployment

```bash
# Deploy to Vercel (manual)
vercel --prod

# Deploy via git (automatic)
git push origin main

# Check deployment status
vercel ls

# View logs
vercel logs
```

### Database

```bash
# Access Supabase CLI
npx supabase login

# Generate types from database
npx supabase gen types typescript --project-id "your-project-ref" > src/types/database.ts

# Reset database (local)
npx supabase db reset

# Push migrations
npx supabase db push
```

### Monitoring

```bash
# Check site status
curl -I https://timelessapp.io

# Check Lighthouse score
npx lighthouse https://timelessapp.io --view

# Analyze bundle size
npx vite-bundle-visualizer
```

---

## 🆘 TROUBLESHOOTING

### Issue: Build Fails on Vercel

**Solution**:
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check

# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Environment Variables Not Working

**Solution**:
- Ensure variables start with `VITE_` for Vite
- Restart dev server after adding variables
- Check Vercel dashboard for production variables
- Variables are only available in build-time, not client-side secrets

### Issue: Supabase Connection Fails

**Solution**:
```typescript
// Add error handling
try {
  const { data, error } = await supabase.from('talents').select('*')
  if (error) throw error
  return data
} catch (error) {
  console.error('Supabase error:', error)
  // Handle error appropriately
}
```

### Issue: Domain Not Resolving

**Solution**:
- Wait 24-48 hours for DNS propagation
- Check nameservers: `dig timelessapp.io NS`
- Verify Cloudflare shows "Active"
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)

---

## 🎉 CONCLUSION

You now have a complete guide to:
1. ✅ Setup your development environment
2. ✅ Configure database and backend
3. ✅ Deploy to production
4. ✅ Configure custom domain
5. ✅ Monitor and maintain
6. ✅ Scale as you grow

**Next Steps**:
1. Follow the immediate action checklist
2. Test thoroughly before launch
3. Gather user feedback
4. Iterate and improve
5. Scale when needed

**Resources**:
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

Good luck with your launch! 🚀

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Maintainer**: Pancho - Timeless Team