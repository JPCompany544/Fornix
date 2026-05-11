import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Standard client for non-component usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Component client for use in Client Components (App Router)
export const createClientClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey)
