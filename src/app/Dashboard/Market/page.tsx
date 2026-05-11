"use client";

import React, { useState, useEffect } from 'react';
import { Search, BarChart3, Globe } from 'lucide-react';
import { getBatchQuotes, getStockProfile } from '@/lib/marketApi';
import { STOCK_UNIVERSE } from '@/lib/stockUniverse';
import StockCard from '@/components/market/StockCard';

export default function MarketDiscoveryPage() {
    const [search, setSearch] = useState('');
    const [stocks, setStocks] = useState<any[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const loadMarket = async () => {
            const symbols = STOCK_UNIVERSE.map(s => s.symbol);
            const [priceData, ...profiles] = await Promise.all([
                getBatchQuotes(symbols),
                ...symbols.map(s => getStockProfile(s).catch(() => ({})))
            ]);
            
            const hydrated = STOCK_UNIVERSE.map((u, index) => {
                const live = priceData.find(p => p.symbol === u.symbol);
                const profile = profiles[index];
                return {
                    ...u,
                    price: live?.price || 0,
                    change: live?.change || 0,
                    percent: live?.percent || 0,
                    logo: profile?.logo || null
                };
            });
            
            setStocks(hydrated);
            setIsInitialLoading(false);
        };
        loadMarket();
    }, []);

    const filteredStocks = stocks.filter((s) =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="pb-20">
            <main className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-10 space-y-10">
                
                {/* Compact Search Hero */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 py-6">
                    <div className="space-y-3 max-w-2xl text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Institutional Hub</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter leading-none">
                            Discovery
                        </h1>
                        <p className="text-base text-slate-500 font-medium leading-relaxed max-w-md">
                            Monitor and allocate live capital across curated assets.
                        </p>
                    </div>

                    <div className="w-full max-w-sm relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="relative flex items-center bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                            <Search className="absolute left-5 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search ticker..."
                                className="w-full pl-12 pr-4 py-5 text-sm font-bold focus:outline-none focus:bg-slate-50/30 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Compact Grid Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2.5">
                            <BarChart3 className="w-5 h-5 text-slate-950" />
                            <h2 className="text-base font-black text-slate-950 uppercase tracking-tight">Active Universe</h2>
                        </div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                            {filteredStocks.length} Results
                        </div>
                    </div>

                    {isInitialLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                            {Array.from({ length: 21 }).map((_, i) => (
                                <div key={i} className="h-48 bg-white rounded-2xl border border-slate-50 animate-pulse shadow-sm" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                            {filteredStocks.map((stock) => (
                                <StockCard 
                                    key={stock.symbol}
                                    symbol={stock.symbol}
                                    name={stock.name}
                                    domain={stock.domain}
                                    logo={stock.logo}
                                    price={stock.price}
                                    change={stock.change}
                                    percent={stock.percent}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
