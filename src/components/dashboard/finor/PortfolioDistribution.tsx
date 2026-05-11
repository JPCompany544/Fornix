"use client";

import React, { useMemo } from 'react';
import { ShieldCheck, DollarSign } from 'lucide-react';
import { Holding } from '@/hooks/usePortfolioState';

interface PortfolioDistributionProps {
    holdings: Holding[];
    totalValue: number;
}

const COLORS = [
    '#6366f1', // indigo-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#8b5cf6', // violet-500
    '#ef4444', // rose-500
    '#f97316', // orange-500
    '#14b8a6', // teal-500
    '#3b82f6', // blue-500
];

const getColorForSymbol = (symbol: string) => {
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
        hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
};

const PortfolioDistribution: React.FC<PortfolioDistributionProps> = ({ holdings, totalValue }) => {
    const allocationData = useMemo(() => {
        return holdings.map(h => ({
            symbol: h.symbol,
            percentage: totalValue > 0 ? (h.position_value / totalValue) * 100 : 0,
            value: h.position_value,
            color: getColorForSymbol(h.symbol)
        })).sort((a, b) => b.percentage - a.percentage);
    }, [holdings, totalValue]);

    const cashValue = useMemo(() => {
        const totalHoldingsValue = holdings.reduce((sum, h) => sum + h.position_value, 0);
        return totalValue > 0 ? Math.max(0, totalValue - totalHoldingsValue) : 0;
    }, [holdings, totalValue]);

    const cashPercentage = totalValue > 0 ? (cashValue / totalValue) * 100 : 0;

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Allocation</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Asset Distribution</p>
                </div>
                <div className="bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live</span>
                </div>
            </div>

            {/* Distribution Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-10 shadow-inner">
                {allocationData.map((item) => (
                    <div 
                        key={item.symbol} 
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }} 
                        className="h-full border-r border-white/20 last:border-0 transition-all duration-500"
                        title={`${item.symbol}: ${item.percentage.toFixed(1)}%`}
                    />
                ))}
                {cashPercentage > 0 && (
                    <div 
                        style={{ width: `${cashPercentage}%` }} 
                        className="h-full bg-slate-200 transition-all duration-500" 
                        title={`Cash: ${cashPercentage.toFixed(1)}%`}
                    />
                )}
            </div>

            {/* Breakdown List */}
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {allocationData.map((item) => (
                    <div key={item.symbol} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-bold text-slate-900">{item.symbol}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-slate-900">{item.percentage.toFixed(1)}%</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                ))}
                
                {cashValue > 0 && (
                    <div className="flex items-center justify-between p-3 mt-2 border-t border-slate-50">
                        <div className="flex items-center space-x-4 text-slate-500">
                            <div className="h-4 w-4 rounded-full bg-slate-200 shadow-sm flex items-center justify-center">
                                <DollarSign className="w-2.5 h-2.5 text-slate-500" />
                            </div>
                            <span className="text-sm font-bold">Liquid Cash</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-slate-900">{cashPercentage.toFixed(1)}%</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                ${cashValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                )}

                {holdings.length === 0 && (
                    <div className="text-center py-10 opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Awaiting Assets...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioDistribution;
