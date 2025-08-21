import { createBrowserClient } from '@supabase/ssr'

// Fallback values for build time when real credentials aren't available
const FALLBACK_URL = 'https://placeholder.supabase.co'
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI3MjAsImV4cCI6MTk2MDc2ODcyMH0.placeholder'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY
  
  // Debug environment variable loading
  console.log('🔧 Supabase Client Configuration:')
  console.log('  URL from env:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing')
  console.log('  Anon Key from env:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing')
  console.log('  Using URL:', url.includes('placeholder') ? '❌ FALLBACK' : '✅ Real')
  console.log('  Using Anon Key:', anonKey.includes('placeholder') ? '❌ FALLBACK' : '✅ Real')
  
  if (url.includes('placeholder') || anonKey.includes('placeholder')) {
    console.error('🚨 CRITICAL: Supabase client using fallback credentials - authentication will fail!')
  }
  
  return createBrowserClient(url, anonKey)
}

// Export a singleton instance for client-side usage
export const supabase = createClient()
