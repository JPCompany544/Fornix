
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testJoin() {
    const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('id, user_id, profiles(email)')
        .limit(1);
    
    if (error) {
        console.error("Join failed:", error.message);
        // Try with inner join hint
        const { data: data2, error: error2 } = await supabase
            .from('withdrawal_requests')
            .select('id, user_id, profiles!inner(email)')
            .limit(1);
        if (error2) {
            console.error("Inner join failed too:", error2.message);
        } else {
            console.log("Inner join worked!");
        }
    } else {
        console.log("Standard join worked!");
    }
}

testJoin();
