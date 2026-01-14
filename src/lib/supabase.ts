import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using mock mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

// Helper functions
export const auth = supabase?.auth
export const storage = supabase?.storage

// Check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase

// Upload file helper
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  if (!storage) {
    console.warn('Storage not configured')
    return null
  }

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
  if (!auth) return null
  const { data: { user } } = await auth.getUser()
  return user
}

// Sign out helper
export async function signOut() {
  if (!auth) return
  const { error } = await auth.signOut()
  if (error) throw error
}
