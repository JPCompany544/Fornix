
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testTransactionInsert() {
    console.log("Testing insert into transactions...");
    
    // Attempt with 'reference'
    const { error: err1 } = await supabase
        .from('transactions')
        .insert([{ 
            user_id: '00000000-0000-0000-0000-000000000000', 
            amount: 0, 
            type: 'test', 
            status: 'test', 
            description: 'test',
            reference: 'test' 
        }]);
    
    if (err1) {
        console.log("Insert with 'reference' failed:", err1.message);
    } else {
        console.log("Insert with 'reference' worked!");
    }

    // Attempt without 'reference'
    const { error: err2 } = await supabase
        .from('transactions')
        .insert([{ 
            user_id: '00000000-0000-0000-0000-000000000000', 
            amount: 0, 
            type: 'test', 
            status: 'test', 
            description: 'test'
        }]);

    if (err2) {
        console.log("Insert without 'reference' failed:", err2.message);
    } else {
        console.log("Insert without 'reference' worked!");
    }
}

testTransactionInsert();
