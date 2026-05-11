import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Watchlist API Layer
 * Diagnostic-Hardened Interface for Supabase 'watchlists' table.
 * 
 * Note: These functions now require the authenticated Supabase client 
 * to ensure Row Level Security (RLS) policies pass correctly.
 */

export async function fetchWatchlist(supabase: SupabaseClient, userId: string): Promise<string[]> {
    if (!userId) return [];
    
    try {
        const { data, error } = await supabase
            .from('watchlists')
            .select('symbol')
            .eq('user_id', userId);

        if (error) {
            console.error("[WatchlistAPI] Fetch Error:", error.message);
            throw error;
        }

        return data.map(item => item.symbol.toUpperCase().trim());
    } catch (err) {
        console.error("[WatchlistAPI] Critical Fetch Failure:", err);
        return [];
    }
}

export async function addToWatchlist(supabase: SupabaseClient, userId: string, symbol: string) {
    if (!userId || !symbol) {
        console.warn("[WatchlistAPI] Add attempt with missing data:", { userId, symbol });
        return;
    }

    const normalizedSymbol = symbol.toUpperCase().trim();

    try {
        const { data, error } = await supabase
            .from('watchlists')
            .insert({ 
                user_id: userId, 
                symbol: normalizedSymbol 
            })
            .select();

        if (error) {
            // Handle unique constraint (already watchlisted)
            if (error.code === '23505') {
                console.log(`[WatchlistAPI] Symbol ${normalizedSymbol} already in watchlist for user ${userId}`);
                return;
            }
            console.error("[WatchlistAPI] Insert Error:", error.message, error.details);
            throw error;
        }

        console.log(`[WatchlistAPI] Successfully added ${normalizedSymbol} to Supabase`);
        return data;
    } catch (err) {
        console.error("[WatchlistAPI] Critical Add Failure:", err);
        throw err;
    }
}

export async function removeFromWatchlist(supabase: SupabaseClient, userId: string, symbol: string) {
    if (!userId || !symbol) return;

    const normalizedSymbol = symbol.toUpperCase().trim();

    try {
        const { error } = await supabase
            .from('watchlists')
            .delete()
            .eq('user_id', userId)
            .eq('symbol', normalizedSymbol);

        if (error) {
            console.error("[WatchlistAPI] Delete Error:", error.message);
            throw error;
        }

        console.log(`[WatchlistAPI] Successfully removed ${normalizedSymbol} from Supabase`);
    } catch (err) {
        console.error("[WatchlistAPI] Critical Delete Failure:", err);
        throw err;
    }
}
