"use client";

import React from 'react';
import Link from 'next/link';
import { Trash2, ArrowUpRight, TrendingDown } from 'lucide-react';

interface WatchlistItemProps {
    symbol: string;
    price: number;
    changePercent: number;
    onRemove: (symbol: string) => void;
}

export default function WatchlistItem({ symbol, price, changePercent, onRemove }: WatchlistItemProps) {
    const isPositive = changePercent >= 0;

    return (
        <div className="group relative flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 hover:border-slate-900 transition-all shadow-sm hover:shadow-xl">
            <Link href={`/Dashboard/Market/${symbol}`} className="flex items-center gap-6 flex-1">
                {/* Symbol Section */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset</span>
                    <span className="text-xl font-black text-slate-950 tracking-tighter">{symbol}</span>
                </div>

                {/* Price Section */}
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Price</span>
                    <span className="text-xl font-black text-slate-950 tabular-nums">
                        ${price ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
                    </span>
                </div>

                {/* Performance Section */}
                <div className="flex flex-col items-end mr-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">24H Change</span>
                    <div className={`flex items-center gap-1 text-sm font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {Math.abs(changePercent).toFixed(2)}%
                    </div>
                </div>
            </Link>

            {/* Remove Action */}
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    onRemove(symbol);
                }}
                className="p-3 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
