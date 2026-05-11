"use client";

import React from 'react';
import { DepositRequest, WithdrawalRequest, Transaction } from '@/types/admin';
import { 
    ArrowDownLeft, 
    ArrowUpRight, 
    Activity, 
    ShieldCheck,
    Clock,
    TrendingUp
} from 'lucide-react';

interface AdminOverviewProps {
    deposits: DepositRequest[];
    withdrawals: WithdrawalRequest[];
    transactions: Transaction[];
}

export const AdminOverview = ({ deposits, withdrawals, transactions }: AdminOverviewProps) => {
    const pendingDeposits = deposits.filter(d => d.status === 'pending');
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending' || w.status === 'processing');
    
    const stats = [
        { 
            label: 'Pending Deposits', 
            value: pendingDeposits.length, 
            icon: ArrowDownLeft, 
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        { 
            label: 'Pending Withdrawals', 
            value: pendingWithdrawals.length, 
            icon: ArrowUpRight, 
            color: 'text-rose-400',
            bg: 'bg-rose-500/10'
        },
        { 
            label: 'Audit Events (Last 100)', 
            value: transactions.length, 
            icon: Activity, 
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        { 
            label: 'System Status', 
            value: 'Operational', 
            icon: ShieldCheck, 
            color: 'text-slate-400',
            bg: 'bg-white/5'
        }
    ];

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[#0D0F14] border border-white/5 p-8 rounded-[2rem] group hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Realtime</div>
                        </div>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0D0F14] border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Clock className="w-5 h-5 text-slate-500" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Activity</h3>
                    </div>
                    <div className="space-y-4">
                        {transactions.slice(0, 5).map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${tx.type === 'deposit' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <div>
                                        <p className="text-xs font-bold text-white">{tx.profiles?.email}</p>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase">{tx.type} • {new Date(tx.created_at).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-black text-white">${tx.amount?.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0D0F14] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center space-y-4 opacity-50">
                    <TrendingUp className="w-12 h-12 text-slate-700" />
                    <div>
                        <p className="text-xs font-black text-white uppercase tracking-widest">Analytics Engine</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">Deep liquidity analysis coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
