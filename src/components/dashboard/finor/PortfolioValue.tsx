"use client";

import React from 'react';
import { ChevronDown, MoreHorizontal, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data remains for the visual chart (as portfolio_history table is not yet implemented)
// But the main balance and status are now 100% live.
const data = [
    { name: 'Jan', value: 1500 }, { name: '', value: 1520 }, { name: '', value: 2100 }, { name: '', value: 2800 }, { name: '', value: 2400 },
    { name: 'Feb', value: 2600 }, { name: '', value: 3200 }, { name: '', value: 4300 }, { name: '', value: 4600 }, { name: '', value: 3700 },
    { name: 'Mar', value: 3300 }, { name: '', value: 4200 }, { name: '', value: 3500 }, { name: '', value: 3100 }, { name: '', value: 4500 },
    { name: 'Apr', value: 3900 }, { name: '', value: 4700 }, { name: '', value: 4400 }, { name: '', value: 6800 }, { name: '', value: 6400 },
    { name: 'May', value: 6500 }, { name: '', value: 5900 }, { name: '', value: 6400 }, { name: '', value: 6200 }, { name: '', value: 3900 },
    { name: 'Jun', value: 3200 }, { name: '', value: 3700 }, { name: '', value: 3500 }, { name: '', value: 4800 }, { name: '', value: 5980 },
    { name: 'Jul', value: 3400 }, { name: '', value: 2400 }, { name: '', value: 1800 }, { name: '', value: 2600 }, { name: '', value: 2200 },
    { name: 'Aug', value: 2800 }, { name: '', value: 2900 }, { name: '', value: 2300 }, { name: '', value: 2350 }, { name: '', value: 2700 },
    { name: 'Sep', value: 3000 }, { name: '', value: 3900 }, { name: '', value: 3700 }, { name: '', value: 3800 }, { name: '', value: 3400 },
    { name: 'Oct', value: 3500 }, { name: '', value: 3000 }, { name: '', value: 3900 }, { name: '', value: 4300 }, { name: 'Live', value: 5800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0b0c15] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800/50 min-w-[140px]">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg font-bold font-mono tracking-tight">${payload[0].value.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
            </div>
        );
    }
    return null;
};

interface PortfolioValueProps {
    amount: number;
}

const PortfolioValue: React.FC<PortfolioValueProps> = ({ amount }) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);

    return (
        <div className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm h-full flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 z-10 relative">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm md:text-lg font-bold text-slate-500">Total Portfolio Value</h3>
                        <div className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded flex items-center gap-1.5 border border-blue-100">
                            <Activity className="w-2.5 h-2.5" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    <div className="flex items-baseline space-x-4">
                        <span className="text-3xl md:text-5xl font-black text-slate-900 tracking-[-0.04em]">{formattedAmount}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Real-time aggregation</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <button className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 px-4 py-2 rounded-full text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>All Time</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-0 -ml-4 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 700 }}
                            dy={15}
                        />
                        <YAxis hide domain={[0, 8000]} />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3, fill: '#4f46e5' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioValue;
