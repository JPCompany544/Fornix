import { useWatchlistData } from '@/context/WatchlistContext';

/**
 * useWatchlist Hook
 * Consumer hook for the global WatchlistProvider state.
 * Prevents redundant subscriptions and ensures consistent state across all components.
 */
export function useWatchlist(userId?: string) {
    // We ignore userId here because the Provider handles the logged-in user automatically
    // but we keep the signature for backwards compatibility with existing components.
    const data = useWatchlistData();
    
    return {
        watchlist: data.watchlist,
        loading: data.loading,
        add: data.add,
        remove: data.remove,
        refresh: data.refresh
    };
}
