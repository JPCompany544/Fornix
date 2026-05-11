"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';

interface TotalProfitsProps {
    unrealizedPnL: number;
    realizedPnL: number;
    dailyMovement: number;
}

const TotalProfits: React.FC<TotalProfitsProps> = ({ unrealizedPnL, realizedPnL, dailyMovement }) => {
    const totalPerformance = unrealizedPnL + realizedPnL;
    
    const isPositiveTotal = totalPerformance >= 0;
    const isPositiveDaily = dailyMovement >= 0;
    const isPositiveUnrealized = unrealizedPnL >= 0;
    const isPositiveRealized = realizedPnL >= 0;

    return (
        <div className="bg-slate-950 p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl flex flex-col h-full text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                            <BarChart2 className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h3 className="text-sm md:text-lg font-black uppercase tracking-widest text-slate-100">Performance</h3>
                    </div>
                </div>

                <div className="flex-1 space-y-6 md:space-y-8">
                    {/* Hero: Combined Total */}
                    <div>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Combined Total Return</span>
                        <div className="flex items-end gap-3">
                            <span className={`text-3xl md:text-4xl font-black tracking-tight ${isPositiveTotal ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPositiveTotal ? '+' : '-'}${Math.abs(totalPerformance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Breakdown */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Today's Delta</span>
                            <span className={`text-sm font-black ${dailyMovement === 0 ? 'text-slate-400' : isPositiveDaily ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {dailyMovement === 0 ? '' : (isPositiveDaily ? '+' : '-')}${Math.abs(dailyMovement).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Open (Unrealized)</span>
                            <span className={`text-sm font-black ${isPositiveUnrealized ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPositiveUnrealized ? '+' : '-'}${Math.abs(unrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Closed (Realized)</span>
                            <span className={`text-sm font-black ${isPositiveRealized ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPositiveRealized ? '+' : '-'}${Math.abs(realizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalProfits;
