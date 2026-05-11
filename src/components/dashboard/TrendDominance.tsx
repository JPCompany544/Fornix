"use client";

import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis } from 'recharts';

const data = [
    { day: '01', attraction: 120, performance: 110, drift: 2 },
    { day: '02', attraction: 132, performance: 115, drift: 3 },
    { day: '03', attraction: 101, performance: 105, drift: 5 },
    { day: '04', attraction: 134, performance: 125, drift: 4 },
    { day: '05', attraction: 190, performance: 150, drift: 2 },
    { day: '06', attraction: 230, performance: 180, drift: 1 },
    { day: '07', attraction: 210, performance: 175, drift: 1 },
];

const TrendDominance: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-[12px] uppercase tracking-[0.2em] font-bold text-slate-500">TREND DOMINANCE</h2>
                <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400 opacity-20" />
                        <span className="text-[10px] font-mono text-slate-500">HISTORICAL</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-slate-100" />
                        <span className="text-[10px] font-mono text-slate-300">ACTUAL</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Capital Attraction */}
                <div className="flex flex-col">
                    <span className="text-[10px] tracking-widest text-slate-500 mb-2 uppercase font-semibold">Capital Attraction</span>
                    <div className="flex-1 min-h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line
                                    type="stepAfter"
                                    dataKey="attraction"
                                    stroke="#f1f5f9"
                                    strokeWidth={1.5}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-baseline mt-2">
                        <span className="text-xl font-mono text-white">CONVERGING</span>
                        <span className="text-[10px] font-mono text-emerald-500">SLOPE: +12°</span>
                    </div>
                </div>

                {/* System Performance */}
                <div className="flex flex-col">
                    <span className="text-[10px] tracking-widest text-slate-500 mb-2 uppercase font-semibold">Performance Index</span>
                    <div className="flex-1 min-h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line
                                    type="monotone"
                                    dataKey="performance"
                                    stroke="#94a3b8"
                                    strokeWidth={1.5}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-baseline mt-2">
                        <span className="text-xl font-mono text-white">STABLE</span>
                        <span className="text-[10px] font-mono text-slate-500">STD: 2.1</span>
                    </div>
                </div>

                {/* Drift Signal */}
                <div className="flex flex-col">
                    <span className="text-[10px] tracking-widest text-slate-500 mb-2 uppercase font-semibold">Drift Signal</span>
                    <div className="flex-1 min-h-[140px] flex items-center justify-center">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border border-slate-900 rounded-full" />
                            <div className="absolute inset-0 border border-slate-900 rounded-full scale-[0.66]" />
                            <div className="absolute inset-0 border border-slate-900 rounded-full scale-[0.33]" />
                            <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>
                    <div className="flex justify-between items-baseline mt-2">
                        <span className="text-xl font-mono text-white">MINIMAL</span>
                        <span className="text-[10px] font-mono text-slate-500">0.04σ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendDominance;
