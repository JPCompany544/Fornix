"use client";

import React from 'react';
import { Landmark, Coins, ChevronRight } from 'lucide-react';
import { WithdrawalMethod } from './WithdrawalWizard';

interface WithdrawalMethodStepProps {
    selected: WithdrawalMethod;
    onSelect: (method: WithdrawalMethod) => void;
}

const WithdrawalMethodStep: React.FC<WithdrawalMethodStepProps> = ({ selected, onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Bank Transfer Card */}
            <button
                onClick={() => onSelect('bank')}
                className={`group relative flex flex-col items-start p-8 rounded-3xl border-2 transition-all duration-300 text-left ${selected === 'bank' ? 'border-slate-900 bg-white shadow-xl' : 'border-slate-100 bg-white/50 hover:border-slate-200 hover:bg-white'}`}
            >
                <div className={`p-4 rounded-2xl mb-8 transition-colors ${selected === 'bank' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'}`}>
                    <Landmark className="w-8 h-8" />
                </div>
                
                <div className="space-y-2 mb-8">
                    <h3 className="text-xl font-black text-slate-950 tracking-tight">Fiat Settlement</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Withdraw capital directly to your institutional bank account via WIRE or ACH. Standard settlement times apply.
                    </p>
                </div>

                <div className="w-full flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank Transfer</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selected === 'bank' ? 'translate-x-1 text-slate-900' : 'text-slate-300 group-hover:text-slate-400'}`} />
                </div>
            </button>

            {/* Crypto Card */}
            <button
                onClick={() => onSelect('crypto')}
                className={`group relative flex flex-col items-start p-8 rounded-3xl border-2 transition-all duration-300 text-left ${selected === 'crypto' ? 'border-slate-900 bg-white shadow-xl' : 'border-slate-100 bg-white/50 hover:border-slate-200 hover:bg-white'}`}
            >
                <div className={`p-4 rounded-2xl mb-8 transition-colors ${selected === 'crypto' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'}`}>
                    <Coins className="w-8 h-8" />
                </div>
                
                <div className="space-y-2 mb-8">
                    <h3 className="text-xl font-black text-slate-950 tracking-tight">Digital Asset Exit</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Exit via stablecoins or primary digital assets. Secure delivery to your verified institutional wallet address.
                    </p>
                </div>

                <div className="w-full flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Crypto Settlement</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selected === 'crypto' ? 'translate-x-1 text-slate-900' : 'text-slate-300 group-hover:text-slate-400'}`} />
                </div>
            </button>
        </div>
    );
};

export default WithdrawalMethodStep;
