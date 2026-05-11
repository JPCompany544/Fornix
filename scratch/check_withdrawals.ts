
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkWithdrawals() {
    console.log("Checking withdrawal_requests...");
    const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .limit(5);
    
    if (error) {
        console.error("Fetch failed:", error.message);
    } else {
        console.log("Data found:", data.length, "rows");
        console.log("Columns:", Object.keys(data[0] || {}));
    }

    console.log("Checking join with profiles...");
    const { data: joinData, error: joinError } = await supabase
        .from('withdrawal_requests')
        .select('*, profiles(email)')
        .limit(5);

    if (joinError) {
        console.error("Join failed:", joinError.message);
    } else {
        console.log("Join worked! Rows:", joinData.length);
    }
}

checkWithdrawals();
