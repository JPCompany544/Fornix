"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStockQuote, getStockProfile } from '@/lib/marketApi';
import { executeTrade } from '@/lib/tradeActions';
import { usePortfolioState } from '@/hooks/usePortfolioState';
import { useAuth } from '@/providers/AuthProvider';
import { useStockChart } from '@/hooks/useStockChart';
import { useWatchlist } from '@/hooks/useWatchlist';
import StockChart from '@/components/charts/StockChart';
import { ArrowLeft, ArrowUpRight, TrendingDown, Globe, Building2, Loader2, Zap, AlertCircle, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';

export default function StockDetailPage() {
    const { symbol } = useParams() as { symbol: string };
    const { user } = useAuth();
    const router = useRouter();
    const { portfolio, holdings, refresh } = usePortfolioState(user?.id);
    const { watchlist, add, remove } = useWatchlist(user?.id);

    const [range, setRange] = useState("D"); // Resolution: D, 60, W, M
    const { data: chartData, loading: isChartLoading, isMock } = useStockChart(symbol, range);
    
    const [quote, setQuote] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrading, setIsTrading] = useState(false);

    // Trade State
    const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
    const [quantity, setQuantity] = useState<number>(1);

    const isWatchlisted = watchlist.includes(symbol.toUpperCase());
    const ownedHolding = holdings.find(h => h.symbol === symbol.toUpperCase());
    const ownedQuantity = ownedHolding ? ownedHolding.quantity : 0;

    useEffect(() => {
        const loadData = async () => {
            try {
                const [q, p] = await Promise.all([
                    getStockQuote(symbol),
                    getStockProfile(symbol)
                ]);
                setQuote(q);
                setProfile(p);
            } catch (err) {
                console.error("Failed to load stock data", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [symbol]);

    const handleExecuteTrade = async () => {
        if (!portfolio || isTrading || quantity <= 0 || !quote?.current) return;
        setIsTrading(true);
        try {
            await executeTrade(portfolio.id, symbol, orderType, quantity, quote.current);
            alert(`Successfully executed ${orderType.toUpperCase()} for ${quantity} shares of ${symbol}`);
            
            // Wait a moment for debounced realtime sync, or manually trigger refresh
            setTimeout(() => {
                refresh();
            }, 500);
            
            if (orderType === 'sell') {
                setOrderType('buy'); // Reset to buy after successful sell
                setQuantity(1);
            }
        } catch (err: any) {
            alert(`Execution Failed: ${err.message}`);
        } finally {
            setIsTrading(false);
        }
    };

    const toggleWatchlist = () => {
        if (isWatchlisted) {
            remove(symbol);
        } else {
            add(symbol);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fbff]">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
        </div>
    );

    const isPositive = quote?.current >= quote?.pc;
    const changePercent = quote ? Math.abs(((quote.current - quote.pc) / quote.pc) * 100).toFixed(2) : "0.00";
    const totalOrderValue = (quote?.current || 0) * quantity;

    return (
        <div className="min-h-screen w-full bg-[#f8fbff] text-slate-900 pb-20">
            <div className="max-w-[1600px] w-full mx-auto py-10 space-y-10">
                {/* 1. Navigation & Header Section (Padded) */}
                <div className="px-6 md:px-8 space-y-10">
                    {/* Back Link & Watchlist Action */}
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Market
                        </button>

                        <button 
                            onClick={toggleWatchlist}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isWatchlisted ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-950 border border-slate-100 hover:bg-slate-50'}`}
                        >
                            {isWatchlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4 text-slate-300" />}
                            {isWatchlisted ? 'Monitored' : 'Watchlist'}
                        </button>
                    </div>

                    {/* Title Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-center p-4 overflow-hidden">
                                <img src={profile?.logo} alt={profile?.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">{profile?.name}</h1>
                                    <span className="px-3 py-1 bg-slate-900 text-white text-[11px] font-black rounded-lg tracking-widest uppercase">{symbol}</span>
                                </div>
                                <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> {profile?.exchange}</span>
                                    <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {profile?.finnhubIndustry}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end space-y-2">
                            <span className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
                                ${quote?.current ? Number(quote.current).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                            </span>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {changePercent}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CHART AREA - TRUE BARE EDGE-TO-EDGE ON MOBILE */}
                <div className="w-full lg:px-8">
                    <div className="bg-transparent md:bg-white px-0 py-8 md:p-10 md:rounded-[3rem] md:border border-transparent md:border-slate-100 md:shadow-sm h-[500px] md:h-[600px] flex flex-col relative overflow-hidden">
                        <div className="px-6 md:px-0 flex items-center justify-between mb-10">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                Live Market Performance
                            </h3>
                            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                                {[
                                    { label: '1D', value: 'D' },
                                    { label: '1W', value: '60' },
                                    { label: '1M', value: 'W' },
                                    { label: '1Y', value: 'M' }
                                ].map(t => (
                                    <button 
                                        key={t.value} 
                                        onClick={() => setRange(t.value)}
                                        className={`px-4 md:px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${range === t.value ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full relative min-h-0">
                            {isChartLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <StockChart data={chartData} />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f8fbff] via-[#f8fbff]/90 to-transparent pt-10 text-center md:hidden">
                                        <div className="flex items-center justify-center gap-3 text-slate-400">
                                            <Building2 className="w-4 h-4" />
                                            <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                                                Institutional data feed secured.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Desktop attribution remains within box */}
                                    <div className="hidden md:block absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent pt-10 text-center">
                                        <div className="flex items-center justify-center gap-3 text-slate-400">
                                            <Building2 className="w-4 h-4" />
                                            <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed max-w-md">
                                                Institutional data feed secured. Real-time execution via Fornix Prime Network.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Secondary Content Grid */}
                <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        {/* Trading Terminal */}
                        <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white/10 rounded-2xl">
                                            <Zap className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Trade Hub</h3>
                                    </div>
                                    {ownedQuantity > 0 && (
                                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {ownedQuantity} Shares Owned
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        <span>Available Cash</span>
                                        <span className="text-white">${portfolio?.cash_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    
                                    {/* Order Type Toggle */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order Type</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button 
                                                onClick={() => setOrderType('buy')}
                                                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'buy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
                                            >
                                                Market Buy
                                            </button>
                                            <button 
                                                onClick={() => setOrderType('sell')}
                                                disabled={ownedQuantity <= 0}
                                                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'sell' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'} ${ownedQuantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                Market Sell
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quantity Input */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex justify-between">
                                            <span>Quantity (Shares)</span>
                                            {orderType === 'sell' && <span className="text-rose-400">Max: {ownedQuantity}</span>}
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                min="1"
                                                max={orderType === 'sell' ? ownedQuantity : undefined}
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Market Price</span>
                                            <span className="text-white">
                                                ${quote?.current ? Number(quote.current).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest pt-2 border-t border-white/10">
                                            <span className="text-slate-300">Total {orderType === 'buy' ? 'Cost' : 'Credit'}</span>
                                            <span className={orderType === 'buy' ? 'text-white' : 'text-emerald-400'}>
                                                ${totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleExecuteTrade}
                                    disabled={isTrading || !portfolio || quantity <= 0 || (orderType === 'sell' && quantity > ownedQuantity)}
                                    className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 ${orderType === 'buy' ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
                                >
                                    {isTrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Execute {orderType} <ArrowUpRight className="w-4 h-4" /></>}
                                </button>
                            </div>
                        </div>

                        {/* Market Stats */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Market Metrics</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Market Cap</span>
                                    <span className="text-sm font-black text-slate-950">${profile?.marketCapitalization ? (profile.marketCapitalization / 1000).toFixed(2) : '0.00'}B</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">52W High</span>
                                    <span className="text-sm font-black text-slate-950">${quote?.h ? Number(quote.h).toFixed(2) : '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">52W Low</span>
                                    <span className="text-sm font-black text-slate-950">${quote?.l ? Number(quote.l).toFixed(2) : '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vol (Avg)</span>
                                    <span className="text-sm font-black text-slate-950">{profile?.shareOutstanding ? (profile.shareOutstanding / 1000).toFixed(2) : '0.00'}M</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
