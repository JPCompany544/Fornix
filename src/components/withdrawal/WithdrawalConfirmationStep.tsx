"use client";

import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface WithdrawalConfirmationStepProps {
    amount: string;
    setAmount: (val: string) => void;
    available: number;
    pending: number;
    confirmed: boolean;
    setConfirmed: (val: boolean) => void;
    method: 'crypto' | 'bank' | null;
    details: any;
}

const WithdrawalConfirmationStep: React.FC<WithdrawalConfirmationStepProps> = ({
    amount, setAmount, available, pending, confirmed, setConfirmed, method, details
}) => {
    
    const amountVal = parseFloat(amount) || 0;
    const isExceeding = amountVal > available;

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Liquidity Status Panel */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Liquidity</span>
                    <p className="text-xl font-black text-slate-900">${available.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending Requests</span>
                    <p className="text-xl font-black text-slate-400">${pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between">
                    <span>Withdrawal Amount (USD)</span>
                    <div className="flex gap-4">
                        {amountVal > 0 && amountVal < 100 && <span className="text-rose-500 font-bold uppercase tracking-widest">Minimum $100</span>}
                        {isExceeding && <span className="text-rose-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Insufficient Funds</span>}
                    </div>
                </label>
                <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className={`w-full bg-white border rounded-2xl py-6 pl-14 pr-6 text-3xl font-black tracking-tight focus:outline-none transition-all shadow-sm ${isExceeding ? 'border-rose-200 text-rose-500 bg-rose-50/30' : 'border-slate-100 text-slate-900 focus:border-slate-300'}`}
                    />
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Settlement Destination</span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Verified Channel</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                        {method === 'crypto' ? <div className="text-[11px] font-black">{details.token}</div> : <ArrowRight className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                            {method === 'crypto' ? details.address : `${details.bankName} • ${details.accountNumber.slice(-4)}`}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {method === 'crypto' ? `${details.network} Network` : details.accountName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Terms & Confirmation - Highly Visible Section */}
            <div className="pt-10 border-t border-slate-100 pb-12">
                <button
                    type="button"
                    onClick={() => setConfirmed(!confirmed)}
                    className={`flex items-start gap-5 text-left group w-full p-6 rounded-2xl border-2 transition-all duration-300 ${confirmed ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}
                >
                    <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${confirmed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 group-hover:border-slate-400 bg-white'}`}>
                        {confirmed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className="space-y-1.5">
                        <span className={`text-[12px] font-black uppercase tracking-widest ${confirmed ? 'text-white' : 'text-slate-900'}`}>Authorize Settlement</span>
                        <p className={`text-[11px] font-medium leading-relaxed ${confirmed ? 'text-slate-400' : 'text-slate-500'}`}>
                            I verify that the destination details provided above are correct. I understand that institutional capital settlement is irreversible once authorized and requires administrative review.
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default WithdrawalConfirmationStep;
