
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function probeSchema() {
    const tables = ['profiles', 'portfolios', 'holdings', 'transactions', 'watchlist', 'deposit_requests', 'withdrawal_requests'];
    const results: any = {};

    for (const table of tables) {
        console.log(`Probing table: ${table}...`);
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            results[table] = { error: error.message };
        } else {
            results[table] = { columns: Object.keys(data[0] || {}) };
        }
    }

    console.log("SCHEMA_AUDIT_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("SCHEMA_AUDIT_END");
}

probeSchema();
