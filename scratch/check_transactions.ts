
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTransactions() {
    console.log("Checking transactions columns...");
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error("Fetch failed:", error.message);
    } else {
        console.log("Columns:", Object.keys(data[0] || {}));
    }
}

checkTransactions();
