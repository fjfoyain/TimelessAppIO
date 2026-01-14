# 📝 Timeless App - Code Templates & Configurations

**Quick copy-paste templates for essential files**

---

## 📦 Package.json Scripts

Add/update these scripts in your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "deploy": "npm run build && vercel --prod"
  }
}
```

---

## 🎨 Tailwind Config

**tailwind.config.js**

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
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#8692f8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9f1239',
          900: '#831843',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## ⚙️ Vite Config

**vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-ui': ['lucide-react'],
        },
      },
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
```

---

## 🔐 Environment Variables

**.env.local** (development)

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API (if separate backend)
VITE_API_URL=http://localhost:5000

# Environment
VITE_APP_ENV=development

# Features
VITE_ENABLE_WEB3=false
VITE_ENABLE_ANALYTICS=false
```

**.env.production** (Vercel environment variables)

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API
VITE_API_URL=https://api.timelessapp.io

# Environment
VITE_APP_ENV=production

# Features
VITE_ENABLE_WEB3=false
VITE_ENABLE_ANALYTICS=true

# Monitoring
VITE_SENTRY_DSN=your-sentry-dsn-here
```

---

## 📄 Vercel Configuration

**vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
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
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.timelessapp.io/:path*"
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

---

## 🗄️ Supabase Client

**src/lib/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Helper functions
export const auth = supabase.auth
export const storage = supabase.storage

// Upload file helper
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { data, error } = await storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data: { publicUrl } } = storage.from(bucket).getPublicUrl(data.path)
  return publicUrl
}

// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await auth.getUser()
  return user
}

// Sign out helper
export async function signOut() {
  const { error } = await auth.signOut()
  if (error) throw error
}
```

---

## 🔄 React Query Setup

**src/lib/queryClient.ts**

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
})

// Query keys factory
export const queryKeys = {
  auth: {
    session: ['session'] as const,
    profile: (id: string) => ['profile', id] as const,
  },
  talents: {
    all: ['talents'] as const,
    list: (filters?: any) => ['talents', 'list', filters] as const,
    detail: (id: string) => ['talents', 'detail', id] as const,
    search: (query: string) => ['talents', 'search', query] as const,
  },
  events: {
    all: ['events'] as const,
    list: (userId: string) => ['events', 'list', userId] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
  },
  messages: {
    conversation: (conversationId: string) => ['messages', conversationId] as const,
    list: (userId: string) => ['messages', 'list', userId] as const,
  },
} as const
```

---

## 🎣 Authentication Hook

**src/hooks/useAuth.ts**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryClient'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Get current session
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: getCurrentUser,
    retry: false,
  })

  // Sign up mutation
  const signUp = useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
      role,
    }: {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session })
      navigate('/dashboard')
    },
  })

  // Sign in mutation
  const signIn = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session })
      navigate('/dashboard')
    },
  })

  // Sign out mutation
  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.clear()
      navigate('/')
    },
  })

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updates: any) => {
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session })
    },
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }
}
```

---

## 👥 Talents Hook

**src/hooks/useTalents.ts**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryClient'
import type { Database } from '@/types/database'

type Talent = Database['public']['Tables']['talents']['Row']
type TalentInsert = Database['public']['Tables']['talents']['Insert']
type TalentUpdate = Database['public']['Tables']['talents']['Update']

export function useTalents(filters?: {
  category?: string
  minRate?: number
  maxRate?: number
  verified?: boolean
}) {
  return useQuery({
    queryKey: queryKeys.talents.list(filters),
    queryFn: async () => {
      let query = supabase
        .from('talents')
        .select('*, profiles(*)')
        .eq('availability_status', 'available')

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.minRate) {
        query = query.gte('hourly_rate', filters.minRate)
      }
      if (filters?.maxRate) {
        query = query.lte('hourly_rate', filters.maxRate)
      }
      if (filters?.verified !== undefined) {
        query = query.eq('verified', filters.verified)
      }

      const { data, error } = await query.order('rating', { ascending: false })

      if (error) throw error
      return data as Talent[]
    },
  })
}

export function useTalent(id: string) {
  return useQuery({
    queryKey: queryKeys.talents.detail(id),
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
    mutationFn: async (talent: TalentInsert) => {
      const { data, error } = await supabase
        .from('talents')
        .insert(talent)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.talents.all })
    },
  })
}

export function useUpdateTalent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: TalentUpdate) => {
      const { data, error } = await supabase
        .from('talents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.talents.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.talents.detail(id) })
    },
  })
}

export function useSearchTalents(query: string) {
  return useQuery({
    queryKey: queryKeys.talents.search(query),
    queryFn: async () => {
      if (!query.trim()) return []

      const { data, error } = await supabase
        .from('talents')
        .select('*, profiles(*)')
        .or(`title.ilike.%${query}%,skills.cs.{${query}}`)
        .eq('availability_status', 'available')
        .order('rating', { ascending: false })
        .limit(10)

      if (error) throw error
      return data as Talent[]
    },
    enabled: query.length > 2,
  })
}
```

---

## 📅 Events Hook

**src/hooks/useEvents.ts**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryClient'
import type { Database } from '@/types/database'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

export function useEvents(userId: string) {
  return useQuery({
    queryKey: queryKeys.events.list(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, talents(*), profiles(*)')
        .or(`client_id.eq.${userId},talent_id.in.(select id from talents where user_id=${userId})`)
        .order('event_date', { ascending: true })

      if (error) throw error
      return data as Event[]
    },
    enabled: !!userId,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, talents(*), profiles(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (event: EventInsert) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.list(variables.client_id) })
    },
  })
}

export function useUpdateEvent(id: string, userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: EventUpdate) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.list(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(id) })
    },
  })
}
```

---

## 🚨 Error Boundary

**src/components/ErrorBoundary.tsx**

```typescript
import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Send to Sentry or other error tracking service
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## 🔔 Toast Notifications

**src/components/Toast.tsx**

```typescript
import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border ${colors[type]} shadow-lg animate-slide-down`}
    >
      {icons[type]}
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <button onClick={onClose} className="ml-auto">
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}

// Toast context for global usage
import { createContext, useContext, ReactNode } from 'react'

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
```

---

## 🔒 Protected Route

**src/components/ProtectedRoute.tsx**

```typescript
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.user_metadata?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
```

---

## 📱 Responsive Navigation

**src/components/Navigation.tsx**

```typescript
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut.mutateAsync()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              Timeless
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/marketplace" className="text-gray-700 hover:text-primary-600">
              Browse Talents
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-primary-600">
                  Messages
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/marketplace"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Browse Talents
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Messages
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 bg-primary-600 text-white rounded-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
```

---

## 🎨 Loading Spinner

**src/components/LoadingSpinner.tsx**

```typescript
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-600 ${sizes[size]}`}
      ></div>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
```

---

## 📋 Usage Example

Here's how to use all these templates together:

**src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'
import App from './App'
import './index.css'

// Optional: Sentry
// import './lib/sentry'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
```

---

**Save this file as `CODE_TEMPLATES.md` in your project for easy reference!**

**Version**: 1.0  
**Last Updated**: January 2026