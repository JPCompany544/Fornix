"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAuth } from '@/providers/AuthProvider';

interface StockCardProps {
    symbol: string;
    name?: string;
    domain?: string;
    logo?: string;
    price: number;
    change: number;
    percent: number;
}

const StockCard: React.FC<StockCardProps> = ({ symbol, name, domain, logo, price, change, percent }) => {
    const { user } = useAuth();
    const { watchlist, add, remove } = useWatchlist(user?.id);
    
    const safePrice = Number(price) || 0;
    const safeChange = Number(change) || 0;
    const safePercent = Number(percent) || 0;
    const isPositive = safePercent >= 0;
    const isWatchlisted = watchlist.includes(symbol.toUpperCase());

    const [imgSrc, setImgSrc] = useState<string>(logo || `https://financialmodelingprep.com/image-stock/${symbol}.png`);

    useEffect(() => {
        if (logo) setImgSrc(logo);
    }, [logo]);

    const handleError = () => {
        if (imgSrc === logo || imgSrc === `https://financialmodelingprep.com/image-stock/${symbol}.png`) {
            if (domain) {
                setImgSrc(`https://icon.horse/icon/${domain}`);
            } else {
                setImgSrc(`https://api.dicebear.com/7.x/initials/svg?seed=${symbol}&backgroundColor=0f172a&fontFamily=Arial&bold=true`);
            }
        } else if (imgSrc.includes('icon.horse')) {
            setImgSrc(`https://api.dicebear.com/7.x/initials/svg?seed=${symbol}&backgroundColor=0f172a&fontFamily=Arial&bold=true`);
        }
    };

    const toggleWatchlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWatchlisted) {
            remove(symbol);
        } else {
            add(symbol);
        }
    };

    return (
        <Link 
            href={`/Dashboard/Market/${symbol}`}
            className="p-4 bg-white rounded-[1.5rem] border border-slate-100 hover:border-slate-900 hover:shadow-xl transition-all group flex flex-col justify-between h-full bg-gradient-to-b from-white to-slate-50/20 relative"
        >
            {/* Watchlist Toggle */}
            <button 
                onClick={toggleWatchlist}
                className={`absolute top-4 right-4 z-20 p-2 rounded-xl transition-all ${isWatchlisted ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-300 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-100'}`}
            >
                {isWatchlisted ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>

            <div className="space-y-3">
                {/* Compact Logo & Symbol Section */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform overflow-hidden relative">
                            <img 
                                src={imgSrc} 
                                alt={name || symbol} 
                                className="w-full h-full object-contain relative z-10"
                                onError={handleError}
                            />
                            <div className="absolute inset-0 bg-slate-50 opacity-30" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-950 uppercase tracking-widest">{symbol}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Equity</span>
                        </div>
                    </div>
                    {/* Placeholder for spacing, toggle is absolute */}
                    <div className="w-7 h-7" /> 
                </div>

                {/* Compact Identity */}
                <h3 className="text-[13px] font-black text-slate-950 leading-tight line-clamp-1 tracking-tight">
                    {name || symbol}
                </h3>
            </div>

            {/* Compact Performance */}
            <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-end justify-between">
                <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-950 tracking-tighter tabular-nums">
                        ${safePrice > 0 ? safePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
                    </span>
                    <div className={`flex items-center gap-1.5 text-[9px] font-black mt-0.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <span>{isPositive ? '+' : ''}{safeChange.toFixed(2)}</span>
                        <span className={`px-1.5 py-0.5 rounded-md ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                            {isPositive ? '+' : ''}{safePercent.toFixed(2)}%
                        </span>
                    </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:text-slate-950 transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </Link>
    );
};

export default StockCard;
