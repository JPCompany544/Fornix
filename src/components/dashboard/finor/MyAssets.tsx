"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { Holding } from '@/hooks/usePortfolioState';

interface MyAssetsProps {
    holdings: Holding[];
}

const MyAssets: React.FC<MyAssetsProps> = ({ holdings }) => {
    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg md:text-xl font-bold text-slate-900">My Assets</h3>
                <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {holdings.length} Positions
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {holdings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40 py-10">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📁</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Portfolio Empty</p>
                    </div>
                ) : (
                    holdings.map((holding) => {
                        const isPositivePnL = holding.pnl >= 0;
                        const isPositiveDaily = holding.daily_movement >= 0;

                        return (
                            <Link 
                                key={holding.id} 
                                href={`/Dashboard/Market/${holding.symbol}`}
                                className="flex items-center justify-between group p-3 md:p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all no-underline"
                            >
                                <div className="flex items-center space-x-3 md:space-x-5">
                                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-white border border-slate-100 p-2 shadow-sm shrink-0">
                                        <img 
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${holding.symbol}`} 
                                            alt={holding.symbol} 
                                            className="w-full h-full object-contain opacity-80" 
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm md:text-[15px] font-black text-slate-950 truncate">{holding.symbol}</span>
                                            <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${isPositivePnL ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {isPositivePnL ? 'Profit' : 'Loss'}
                                            </div>
                                        </div>
                                        <span className="text-[10px] md:text-[13px] text-slate-400 font-bold uppercase tracking-widest truncate">
                                            {holding.quantity} Shares
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 md:gap-12">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">P/L</span>
                                        <div className={`flex items-center text-xs md:text-[13px] font-black ${isPositivePnL ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {isPositivePnL ? '+' : '-'}${Math.abs(holding.pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                        <div className={`flex items-center text-[9px] font-bold ${isPositivePnL ? 'text-emerald-500/70' : 'text-rose-500/70'}`}>
                                            {isPositivePnL ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                            {holding.pnl_percent.toFixed(1)}%
                                        </div>
                                    </div>

                                    {/* Hide on mobile to prevent overflow */}
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">24h</span>
                                        <div className={`flex items-center text-[13px] font-bold ${holding.daily_movement === 0 ? 'text-slate-400' : isPositiveDaily ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            ${Math.abs(holding.daily_movement).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end min-w-[70px] md:min-w-[90px]">
                                        <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Value</span>
                                        <span className="text-xs md:text-[15px] font-black text-slate-950">
                                            ${holding.position_value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>

                                    <div className="hidden xs:block opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyAssets;
