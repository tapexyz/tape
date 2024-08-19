'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  }
})

export const Providers = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <QueryClientProvider client={qc}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
