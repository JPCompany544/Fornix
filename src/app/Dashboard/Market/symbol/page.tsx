"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStockQuote, getStockProfile } from '@/lib/marketApi';
import { executeTrade } from '@/lib/tradeActions';
import { usePortfolioState } from '@/hooks/usePortfolioState';
import { useAuth } from '@/providers/AuthProvider';
import { useStockChart } from '@/hooks/useStockChart';
import StockChart from '@/components/charts/StockChart';
import FinorHeader from '@/components/dashboard/finor/FinorHeader';
import { ArrowLeft, ArrowUpRight, TrendingDown, Globe, Building2, Loader2, Zap } from 'lucide-react';

export default function StockDetailPage() {
    const { symbol } = useParams() as { symbol: string };
    const { user } = useAuth();
    const router = useRouter();
    const { portfolio } = usePortfolioState(user?.id);

    const [range, setRange] = useState("D"); // Resolution: D, 60, W, M
    const { data: chartData, loading: isChartLoading } = useStockChart(symbol, range);
    
    const [quote, setQuote] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrading, setIsTrading] = useState(false);

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

    const handleBuy = async () => {
        if (!portfolio || isTrading) return;
        setIsTrading(true);
        try {
            await executeTrade(portfolio.id, symbol, 'buy', 1, quote.current);
            alert(`Successfully purchased 1 share of ${symbol}`);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsTrading(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fbff]">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
        </div>
    );

    const isPositive = quote.current >= quote.pc;
    const changePercent = Math.abs(((quote.current - quote.pc) / quote.pc) * 100).toFixed(2);

    return (
        <div className="min-h-screen w-full bg-[#f8fbff] text-slate-900 pb-20">
            <FinorHeader />

            <main className="max-w-[1600px] w-full mx-auto px-8 py-10 space-y-10">
                {/* Back Link */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Market
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Header & Chart */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Title Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex items-center gap-8">
                                <div className="w-24 h-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-center p-4">
                                    <img src={profile.logo} alt={profile.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-4xl font-black text-slate-950 tracking-tight">{profile.name}</h1>
                                        <span className="px-3 py-1 bg-slate-900 text-white text-[11px] font-black rounded-lg tracking-widest uppercase">{symbol}</span>
                                    </div>
                                    <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> {profile.exchange}</span>
                                        <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {profile.finnhubIndustry}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end space-y-2">
                                <span className="text-5xl font-black text-slate-950 tracking-tight">${quote.current?.toFixed(2)}</span>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {changePercent}%
                                </div>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Performance History</h3>
                                <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
                                    {[
                                        { label: '1D', value: 'D' },
                                        { label: '1W', value: '60' },
                                        { label: '1M', value: 'W' },
                                        { label: '1Y', value: 'M' }
                                    ].map(t => (
                                        <button 
                                            key={t.value} 
                                            onClick={() => setRange(t.value)}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${range === t.value ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex-1 w-full min-h-0">
                                {isChartLoading ? (
                                    <div className="h-[300px] flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synthesizing Candle Data...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <StockChart data={chartData} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Trading & Stats */}
                    <div className="lg:col-span-1 space-y-10">
                        {/* Trading Terminal */}
                        <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        <Zap className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Trade Hub</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        <span>Available Cash</span>
                                        <span className="text-white">${portfolio?.cash_balance.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order Type</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Market Buy</button>
                                            <button className="bg-white/5 text-slate-400 border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Market Sell</button>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleBuy}
                                    disabled={isTrading || !portfolio}
                                    className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-100 transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4"
                                >
                                    {isTrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Confirm Allocation <ArrowUpRight className="w-4 h-4" /></>}
                                </button>
                            </div>
                        </div>

                        {/* Market Stats */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Market Metrics</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Market Cap</span>
                                    <span className="text-sm font-black text-slate-950">${(profile.marketCapitalization / 1000).toFixed(2)}B</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">52W High</span>
                                    <span className="text-sm font-black text-slate-950">${quote.h?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">52W Low</span>
                                    <span className="text-sm font-black text-slate-950">${quote.l?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vol (Avg)</span>
                                    <span className="text-sm font-black text-slate-950">{(profile.shareOutstanding / 1000).toFixed(2)}M</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
