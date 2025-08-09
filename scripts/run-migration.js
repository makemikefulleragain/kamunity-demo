const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Running news system database migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', 'create_news_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          // Try direct query execution as fallback
          const { error: directError } = await supabase
            .from('_temp')
            .select('*')
            .limit(0);
            
          // If that fails too, try using the raw query
          try {
            await supabase.query(statement + ';');
          } catch (queryError) {
            console.error(`❌ Error executing statement ${i + 1}:`, error);
            console.error('Statement:', statement);
            throw error;
          }
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['news_items', 'news_comments', 'news_comment_reports']);
    
    if (tablesError) {
      console.warn('⚠️ Could not verify table creation:', tablesError);
    } else {
      console.log('📊 Created tables:', tables?.map(t => t.table_name).join(', '));
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
