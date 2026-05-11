"use client";

import React from 'react';
import { Insight } from '@/hooks/usePortfolioInsights';
import { AlertTriangle, Info, TrendingUp, Activity, Target } from 'lucide-react';

interface InsightsPanelProps {
    insights: Insight[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
    if (insights.length === 0) return null;

    const getIcon = (type: string, severity: string) => {
        if (severity === 'critical') return <AlertTriangle className="w-4 h-4 text-rose-500" />;
        if (type === 'performance') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
        if (type === 'activity') return <Activity className="w-4 h-4 text-indigo-500" />;
        if (type === 'concentration' || type === 'allocation') return <Target className="w-4 h-4 text-amber-500" />;
        return <Info className="w-4 h-4 text-slate-500" />;
    };

    const getBgColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-rose-50 border-rose-100';
            case 'warning': return 'bg-amber-50 border-amber-100';
            case 'info': return 'bg-slate-50 border-slate-100';
            default: return 'bg-white border-slate-100';
        }
    };

    const getTextColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-rose-900';
            case 'warning': return 'text-amber-900';
            case 'info': return 'text-slate-700';
            default: return 'text-slate-900';
        }
    };

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center gap-2 mb-1 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio Intelligence</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {insights.map((insight) => (
                    <div 
                        key={insight.id} 
                        className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${getBgColor(insight.severity)} shadow-sm`}
                    >
                        <div className="mt-0.5">
                            {getIcon(insight.type, insight.severity)}
                        </div>
                        <div className="flex-1">
                            <p className={`text-xs font-bold leading-relaxed ${getTextColor(insight.severity)}`}>
                                {insight.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InsightsPanel;
