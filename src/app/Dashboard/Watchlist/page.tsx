"use client";

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useMarketData } from '@/context/MarketProvider';
import WatchlistItem from '@/components/watchlist/WatchlistItem';
import FinorHeader from '@/components/dashboard/finor/FinorHeader';
import { Plus, Search, Loader2, Bookmark, LayoutGrid, Info } from 'lucide-react';

export default function WatchlistPage() {
    const { user } = useAuth();
    const { watchlist, loading, add, remove } = useWatchlist(user?.id);
    const { prices, refreshPrices } = useMarketData();
    const [newSymbol, setNewSymbol] = useState('');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSymbol) return;
        
        const sym = newSymbol.toUpperCase().trim();
        await add(sym);
        setNewSymbol('');
        
        // Refresh prices for the new symbol immediately
        refreshPrices([sym]);
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fbff] text-slate-900 pb-20">
            <FinorHeader />

            <main className="max-w-[1200px] w-full mx-auto px-6 py-12 space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-900 rounded-2xl shadow-xl">
                                <Bookmark className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Institutional Hub</span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-950 tracking-tighter leading-none">My Watchlist</h1>
                        <p className="text-lg text-slate-500 font-medium max-w-md">Track high-conviction assets and monitor live market performance.</p>
                    </div>

                    {/* Add Symbol Input */}
                    <form onSubmit={handleAdd} className="flex items-center gap-3 w-full max-w-sm">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-0 bg-slate-900 rounded-2xl blur opacity-0 group-focus-within:opacity-5 transition-opacity" />
                            <div className="relative flex items-center bg-white border border-slate-100 rounded-2xl shadow-sm px-5 py-4">
                                <Search className="w-4 h-4 text-slate-300 mr-3" />
                                <input 
                                    type="text"
                                    value={newSymbol}
                                    onChange={(e) => setNewSymbol(e.target.value)}
                                    placeholder="Add ticker (e.g. BTC)"
                                    className="w-full text-sm font-bold focus:outline-none placeholder:text-slate-300 uppercase"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="p-4 bg-slate-950 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* Watchlist Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2.5">
                            <LayoutGrid className="w-5 h-5 text-slate-950" />
                            <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest">Monitored Assets</h2>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Live Feed
                            </div>
                            <span>{watchlist.length} Tickers</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center space-y-6 bg-white rounded-[3rem] border border-slate-100">
                            <Loader2 className="w-10 h-10 animate-spin text-slate-200" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Synchronizing Vault...</p>
                        </div>
                    ) : watchlist.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[3rem] border border-slate-100 border-dashed">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                <Info className="w-8 h-8 text-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black text-slate-950 uppercase tracking-widest">Empty Watchlist</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add symbols above to begin monitoring</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {watchlist.map((symbol) => {
                                const marketData = prices[symbol];
                                return (
                                    <WatchlistItem 
                                        key={symbol}
                                        symbol={symbol}
                                        price={marketData?.price || 0}
                                        changePercent={marketData?.changePercent || 0}
                                        onRemove={remove}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
