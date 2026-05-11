"use client";

import React, { useState } from 'react';
import { History, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Transaction } from '@/hooks/usePortfolioState';

interface MarketInsightProps {
    transactions: Transaction[];
    depositRequests?: any[];
}

const MarketInsight: React.FC<MarketInsightProps> = ({ transactions, depositRequests = [] }) => {
    const [activeTab, setActiveTab] = useState<'trades' | 'funding'>('trades');

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">Activity Log</h3>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Institutional Audit Trail</p>
                </div>
                
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <button 
                        onClick={() => setActiveTab('trades')}
                        className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'trades' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Trades
                    </button>
                    <button 
                        onClick={() => setActiveTab('funding')}
                        className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'funding' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Funding
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-[350px]">
                {activeTab === 'trades' && (
                    transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-30 space-y-4 py-16">
                            <Wallet className="w-12 h-12 text-slate-300" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No activity detected</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx) => {
                                const isSell = tx.type === 'sell';
                                return (
                                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100/50 hover:border-slate-200 transition-all group">
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className={`p-2.5 md:p-3 rounded-xl shadow-sm ${
                                                tx.type === 'buy' ? 'bg-indigo-50 text-indigo-600' :
                                                isSell ? 'bg-orange-50 text-orange-600' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {tx.type === 'buy' ? <TrendingUp className="w-4 h-4 md:w-5 md:h-5" /> : <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <span className="text-xs md:text-sm font-black uppercase tracking-tight text-slate-900">{tx.type}</span>
                                                    <span className="text-[8px] md:text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-100 text-slate-400 uppercase tracking-widest">{tx.symbol}</span>
                                                </div>
                                                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">
                                                    {new Date(tx.created_at).toLocaleDateString()} • {tx.quantity} Shares
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className="text-xs md:text-sm font-black text-slate-950">${Number(tx.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                @ ${Number(tx.price).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}

                {activeTab === 'funding' && (
                    depositRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-30 space-y-4 py-16">
                            <Wallet className="w-12 h-12 text-slate-300" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No funding activity</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {depositRequests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100/50 hover:border-slate-200 transition-all">
                                    <div className="flex items-center space-x-3 md:space-x-4">
                                        <div className={`p-2.5 md:p-3 rounded-xl shadow-sm ${req.status === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {req.status === 'pending' ? <Clock className="w-4 h-4 md:w-5 md:h-5" /> : <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs md:text-sm font-black uppercase tracking-tight text-slate-900">Deposit</span>
                                                <span className={`text-[7px] md:text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                {new Date(req.created_at).toLocaleDateString()} • {req.method}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end text-right">
                                        <span className="text-xs md:text-sm font-black text-slate-950">${Number(req.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[80px] md:max-w-[120px]">
                                            {req.reference}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-50 text-center">
                <button className="text-[9px] md:text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">
                    Export Audit Log →
                </button>
            </div>
        </div>
    );
};

export default MarketInsight;
