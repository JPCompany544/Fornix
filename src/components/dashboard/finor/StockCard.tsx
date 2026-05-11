"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingDown } from 'lucide-react';

interface StockCardProps {
    symbol: string;
    name?: string;
    price: number;
    changePercent: number;
    isLoading?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ symbol, name, price, changePercent, isLoading }) => {
    if (isLoading) {
        return (
            <div className="p-6 bg-white rounded-3xl border border-slate-100 animate-pulse space-y-4">
                <div className="flex justify-between">
                    <div className="w-12 h-6 bg-slate-100 rounded-lg" />
                    <div className="w-4 h-4 bg-slate-100 rounded-full" />
                </div>
                <div className="w-24 h-4 bg-slate-100 rounded" />
                <div className="space-y-2">
                    <div className="w-32 h-8 bg-slate-200 rounded-xl" />
                    <div className="w-16 h-4 bg-slate-100 rounded" />
                </div>
            </div>
        );
    }

    const isPositive = changePercent >= 0;

    return (
        <Link 
            href={`/Dashboard/Market/${symbol}`}
            className="p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-slate-900 hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-full"
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg tracking-widest uppercase">{symbol}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-950 transition-colors" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-950 leading-tight mb-1 line-clamp-1">{name || symbol}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Asset</p>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-50 flex items-end justify-between">
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-950 tracking-tight">
                        ${price > 0 ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
                    </span>
                    <div className={`flex items-center text-[11px] font-black mt-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {Math.abs(changePercent).toFixed(2)}%
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default StockCard;
