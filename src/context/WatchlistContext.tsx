"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClientClient } from '@/lib/supabaseClient';
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/watchlistApi';
import { useAuth } from '@/providers/AuthProvider';

interface WatchlistContextType {
    watchlist: string[];
    loading: boolean;
    add: (symbol: string) => Promise<void>;
    remove: (symbol: string) => Promise<void>;
    refresh: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Create an authenticated client scoped to this component
    const supabase = createClientClient();

    const refresh = useCallback(async () => {
        if (!user?.id) return;
        const data = await fetchWatchlist(supabase, user.id);
        setWatchlist(data);
        setLoading(false);
    }, [user?.id, supabase]);

    // Initial Load & Real-time Subscription (SINGLETON)
    useEffect(() => {
        if (!user?.id) {
            setWatchlist([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        refresh();

        console.log("[WatchlistProvider] Initializing Global Subscription for user:", user.id);

        const channel = supabase
            .channel(`global_watchlist_${user.id}`)
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'watchlists',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    console.log("[WatchlistProvider] Real-time Sync:", payload.eventType);
                    refresh();
                }
            )
            .subscribe();

        return () => {
            console.log("[WatchlistProvider] Cleaning up Global Subscription");
            supabase.removeChannel(channel);
        };
    }, [user?.id, refresh, supabase]);

    const add = async (symbol: string) => {
        if (!user?.id || !symbol) return;
        const sym = symbol.toUpperCase().trim();
        if (watchlist.includes(sym)) return;

        const previous = [...watchlist];
        setWatchlist(prev => [...prev, sym]);

        try {
            await addToWatchlist(supabase, user.id, sym);
        } catch (err) {
            setWatchlist(previous);
            console.error("[WatchlistProvider] Add failed, reverted", err);
        }
    };

    const remove = async (symbol: string) => {
        if (!user?.id || !symbol) return;
        const sym = symbol.toUpperCase().trim();

        const previous = [...watchlist];
        setWatchlist(prev => prev.filter(s => s !== sym));

        try {
            await removeFromWatchlist(supabase, user.id, sym);
        } catch (err) {
            setWatchlist(previous);
            console.error("[WatchlistProvider] Remove failed, reverted", err);
        }
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, loading, add, remove, refresh }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlistData = () => {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error('useWatchlistData must be used within a WatchlistProvider');
    }
    return context;
};
