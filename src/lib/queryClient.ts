import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
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

// Query keys factory for type-safe query key management
export const queryKeys = {
  auth: {
    session: ['session'] as const,
    profile: (id: string) => ['profile', id] as const,
  },
  talents: {
    all: ['talents'] as const,
    list: (filters?: Record<string, unknown>) => ['talents', 'list', filters] as const,
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
  venues: {
    all: ['venues'] as const,
    detail: (id: string) => ['venues', 'detail', id] as const,
  },
  providers: {
    all: ['providers'] as const,
    detail: (id: string) => ['providers', 'detail', id] as const,
  },
} as const
