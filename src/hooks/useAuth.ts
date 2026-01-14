import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase'
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
    enabled: isSupabaseConfigured(),
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
      role: 'client' | 'talent' | 'venue' | 'provider'
    }) => {
      if (!supabase) throw new Error('Supabase not configured')

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
      if (!supabase) throw new Error('Supabase not configured')

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
      if (!supabase) throw new Error('Supabase not configured')

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
    mutationFn: async (updates: Record<string, unknown>) => {
      if (!supabase) throw new Error('Supabase not configured')
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
    isConfigured: isSupabaseConfigured(),
    signUp,
    signIn,
    signOut,
    updateProfile,
  }
}
