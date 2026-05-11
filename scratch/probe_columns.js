
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://qdlgxkgmxlbcwvpketmi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbGd4a2dteGxiY3d2cGtldG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzgyMDcsImV4cCI6MjA5Mjk1NDIwN30.qrUNOw2zktF8jcLdJX7BuO5Z5rP9-NrttCh_fjTeHKA";

const s = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    const tables = ['transactions', 'watchlists', 'portfolios'];
    for (const table of tables) {
        const { data, error } = await s.from(table).select('*').limit(1);
        if (error) {
            console.log(`${table} Error:`, error.message);
        } else {
            console.log(`${table} columns:`, Object.keys(data?.[0] || {}));
        }
    }
}
run();
