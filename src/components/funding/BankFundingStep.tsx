"use client";

import React from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { BANK_CONFIG } from '@/config/funding';

interface BankFundingStepProps {
    type: 'WIRE' | 'ACH';
    onChange: (type: 'WIRE' | 'ACH') => void;
    referenceCode: string;
}

const BankFundingStep: React.FC<BankFundingStepProps> = ({ type, onChange, referenceCode }) => {
    const [copiedField, setCopiedField] = React.useState<string | null>(null);
    
    const config = BANK_CONFIG[type];

    const handleCopy = (val: string, field: string) => {
        navigator.clipboard.writeText(val);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const InstructionRow = ({ label, value }: { label: string, value: string }) => (
        <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group/row">
            <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                <p className="text-[13px] font-bold text-slate-900">{value}</p>
            </div>
            <button
                onClick={() => handleCopy(value, label)}
                className={`p-2.5 rounded-lg transition-all ${copiedField === label ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-slate-900 hover:bg-slate-50'}`}
            >
                {copiedField === label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Type Selector */}
            <div className="flex gap-4">
                {(['WIRE', 'ACH'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => onChange(t)}
                        className={`px-8 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                        {t === 'WIRE' ? 'International Wire' : 'Domestic ACH'}
                    </button>
                ))}
            </div>

            {/* Instruction Card */}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Settlement Instructions</span>
                    <span className="text-[10px] font-bold text-slate-400">USD Clearings Only</span>
                </div>
                
                <div className="p-8 space-y-2">
                    <InstructionRow label="Account Name" value={config.accountName} />
                    <InstructionRow label="Bank Name" value={config.bankName} />
                    <InstructionRow label="Routing Number" value={config.routingNumber} />
                    <InstructionRow label="Account Number" value={config.accountNumber} />
                    {'swift' in config && <InstructionRow label="SWIFT / BIC" value={config.swift as string} />}
                    
                    <div className="mt-8 p-6 bg-slate-950 rounded-2xl text-white space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Required Reference Code</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgb(16,185,129)]" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black tracking-[0.1em]">{referenceCode}</span>
                            <button
                                onClick={() => handleCopy(referenceCode, 'Reference')}
                                className={`p-3 rounded-xl transition-all ${copiedField === 'Reference' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                {copiedField === 'Reference' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                            IMPORTANT: Include this code in the payment memo. Transfers without a valid reference code will undergo delayed manual settlement.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium text-blue-700 leading-relaxed">
                    {config.instructions} Standard institutional review applies to all inbound fiat capital.
                </p>
            </div>
        </div>
    );
};

export default BankFundingStep;
