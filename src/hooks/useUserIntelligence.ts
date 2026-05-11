
import { useState, useEffect, useCallback } from "react";
import { createClientClient } from "@/lib/supabaseClient";

export interface UserIntelligence {
    profile: any;
    portfolio: any;
    holdings: any[];
    transactions: any[];
    watchlist: any[];
}

export function useUserIntelligence(userId: string | null) {
    const supabase = createClientClient();
    const [data, setData] = useState<UserIntelligence | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIntelligence = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        console.log(`[IntelligenceHook] Fetching data for: ${userId}...`);
        try {
            const { data: intelligence, error: rpcError } = await supabase
                .rpc('get_user_intelligence', { p_user_id: userId });

            if (rpcError) {
                console.error("[IntelligenceHook] RPC Error:", rpcError);
                throw rpcError;
            }
            
            console.log("[IntelligenceHook] Raw Data Received:", intelligence);
            setData(intelligence);
        } catch (err: any) {
            console.error("[IntelligenceHook] Fatal Error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId, supabase]);

    useEffect(() => {
        fetchIntelligence();

        if (!userId) return;

        // REAL-TIME SYNC ENGINE (Phase 4)
        const channel = supabase
            .channel(`user-intelligence-${userId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolios', filter: `user_id=eq.${userId}` }, () => fetchIntelligence())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'holdings' }, () => fetchIntelligence()) // Simplified for now
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` }, () => fetchIntelligence())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'watchlists', filter: `user_id=eq.${userId}` }, () => fetchIntelligence())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, fetchIntelligence, supabase]);

    return { data, loading, error, refresh: fetchIntelligence };
}
