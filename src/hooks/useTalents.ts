import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryClient'
import type { Talent, TalentInsert, TalentUpdate } from '@/types/database'

interface TalentFilters {
  category?: string
  minRate?: number
  maxRate?: number
  verified?: boolean
}

export function useTalents(filters?: TalentFilters) {
  return useQuery({
    queryKey: queryKeys.talents.list(filters),
    queryFn: async () => {
      if (!supabase) {
        // Return empty array if Supabase not configured (will use mock data)
        return [] as Talent[]
      }

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
    enabled: isSupabaseConfigured(),
  })
}

export function useTalent(id: string) {
  return useQuery({
    queryKey: queryKeys.talents.detail(id),
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('talents')
        .select('*, profiles(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id && isSupabaseConfigured(),
  })
}

export function useCreateTalent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (talent: TalentInsert) => {
      if (!supabase) throw new Error('Supabase not configured')

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
      if (!supabase) throw new Error('Supabase not configured')

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
      if (!supabase || !query.trim()) return []

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
    enabled: query.length > 2 && isSupabaseConfigured(),
  })
}
