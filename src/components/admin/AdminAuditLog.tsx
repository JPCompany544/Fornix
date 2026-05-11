"use client";

import React, { useState } from 'react';
import { Transaction } from '@/types/admin';
import { Search, Hash, Clock, User, ArrowDownLeft, ArrowUpRight, Zap } from 'lucide-react';

interface AdminAuditLogProps {
    transactions: Transaction[];
    loading: boolean;
}

export const AdminAuditLog = ({ transactions, loading }: AdminAuditLogProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("all");

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (tx as any).description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = filterType === "all" || tx.type === filterType;
        
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                        type="text" 
                        placeholder="Search ledger..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0D0F14] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-rose-500/50 transition-all"
                    />
                </div>
                
                <div className="flex gap-2">
                    {['all', 'deposit', 'withdrawal', 'trade'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                                filterType === type 
                                ? 'bg-white/10 text-white border-white/20 shadow-xl' 
                                : 'bg-[#0D0F14] text-slate-600 border-white/5 hover:text-slate-400'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {loading && transactions.length === 0 ? (
                    <div className="p-20 text-center opacity-30 flex flex-col items-center gap-4">
                        <Clock className="w-8 h-8 animate-pulse text-rose-500" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Ledger...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-20 text-center opacity-20 border border-white/5 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase tracking-widest">No matching entries</p>
                    </div>
                ) : (
                    filteredTransactions.map((tx) => (
                        <div key={tx.id} className="bg-[#0D0F14] border border-white/5 rounded-3xl p-6 space-y-4 hover:bg-white/[0.01] transition-all shadow-lg group">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            tx.type === 'deposit' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                            tx.type === 'withdrawal' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                            'bg-blue-500'
                                        }`} />
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{tx.type}</p>
                                    </div>
                                    <p className="text-sm font-black text-white tracking-tight">{tx.profiles?.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-black tracking-tighter ${
                                        tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                                    }`}>
                                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount?.toLocaleString()}
                                    </p>
                                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Settled</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <Hash className="w-3 h-3 text-slate-700" />
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">{tx.id.slice(0, 12)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-slate-700" />
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
