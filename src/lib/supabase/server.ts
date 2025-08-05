import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Fallback values for build time when real credentials aren't available
const FALLBACK_URL = 'https://placeholder.supabase.co'
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI3MjAsImV4cCI6MTk2MDc2ODcyMH0.placeholder'

export const createClient = () => {
  const cookieStore = cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
