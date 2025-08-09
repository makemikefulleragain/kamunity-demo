const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔄 Temporarily disabling RLS for demo purposes...')

async function disableRLSForDemo() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema: 'public' },
    auth: { persistSession: false }
  })
  
  try {
    // Test current access with anon key first
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    console.log('🧪 Testing current anon access...')
    const { data: testRooms, error: testError } = await anonSupabase
      .from('rooms')
      .select('*')
      .eq('room_type', 'chat')
      .limit(1)
    
    console.log('📊 Anon key can access rooms:', testRooms?.length || 0)
    if (testError) console.log('❌ Anon access error:', testError.message)
    
    // If anon access is blocked, we need to fix RLS
    if (testError || !testRooms || testRooms.length === 0) {
      console.log('🔧 RLS is blocking access, attempting to create permissive policies...')
      
      // For demo purposes, let's try to make tables publicly readable
      // This is a workaround since we can't easily modify RLS policies via API
      
      // Alternative: Let's check if we can query with service role and return data via API
      const { data: serviceRooms, error: serviceError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_type', 'chat')
      
      console.log('📊 Service role can access rooms:', serviceRooms?.length || 0)
      if (serviceError) console.log('❌ Service access error:', serviceError.message)
      
      if (serviceRooms && serviceRooms.length > 0) {
        console.log('✅ Service role access works - data exists!')
        console.log('💡 Solution: Update API endpoints to use service role for demo')
      }
    } else {
      console.log('✅ Anon access already works!')
    }
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

disableRLSForDemo()
