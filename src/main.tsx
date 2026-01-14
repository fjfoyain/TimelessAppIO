import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import App from './App'
import './index.css'

// Check if Supabase is configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
if (!supabaseUrl) {
  console.info(
    '%c Timeless App - Development Mode ',
    'background: #6366f1; color: white; padding: 4px 8px; border-radius: 4px;',
    '\nSupabase is not configured. Running with mock data.',
    '\nTo enable backend, create a .env.local file with:',
    '\n  VITE_SUPABASE_URL=your-url',
    '\n  VITE_SUPABASE_ANON_KEY=your-key'
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
