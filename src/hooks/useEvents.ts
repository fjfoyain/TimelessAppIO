import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryClient'
import type { Event, EventInsert, EventUpdate } from '@/types/database'

export function useEvents(userId: string) {
  return useQuery({
    queryKey: queryKeys.events.list(userId),
    queryFn: async () => {
      if (!supabase) return [] as Event[]

      const { data, error } = await supabase
        .from('events')
        .select('*, talents(*), profiles(*)')
        .or(`client_id.eq.${userId}`)
        .order('event_date', { ascending: true })

      if (error) throw error
      return data as Event[]
    },
    enabled: !!userId && isSupabaseConfigured(),
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: async () => {
      if (!supabase) return null

      const { data, error } = await supabase
        .from('events')
        .select('*, talents(*), profiles(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id && isSupabaseConfigured(),
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (event: EventInsert) => {
      if (!supabase) throw new Error('Supabase not configured')

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
      if (!supabase) throw new Error('Supabase not configured')

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

export function useCancelEvent(id: string, userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error('Supabase not configured')

      const { data, error } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
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
