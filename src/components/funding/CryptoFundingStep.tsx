"use client";

import React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { CRYPTO_CONFIG } from '@/config/funding';

interface CryptoFundingStepProps {
    config: { token: string; network: string };
    onChange: (config: { token: string; network: string }) => void;
}

const CryptoFundingStep: React.FC<CryptoFundingStepProps> = ({ config, onChange }) => {
    const [copied, setCopied] = React.useState(false);
    
    // Get available tokens
    const tokens = Object.keys(CRYPTO_CONFIG);
    
    // Get available networks for selected token
    const networks = Object.keys((CRYPTO_CONFIG as any)[config.token] || {});
    
    // Get current address
    const currentAddress = (CRYPTO_CONFIG as any)[config.token]?.[config.network]?.address || "N/A";

    const handleCopy = () => {
        navigator.clipboard.writeText(currentAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Token Selector */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Asset</label>
                    <div className="grid grid-cols-2 gap-2">
                        {tokens.map(t => (
                            <button
                                key={t}
                                onClick={() => onChange({ token: t, network: Object.keys((CRYPTO_CONFIG as any)[t])[0] })}
                                className={`px-4 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${config.token === t ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Network Selector */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Network</label>
                    <div className="flex flex-wrap gap-2">
                        {networks.map(n => (
                            <button
                                key={n}
                                onClick={() => onChange({ ...config, network: n })}
                                className={`px-4 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${config.network === n ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Instruction Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-8 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Wallet Primary</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Single-use Address</span>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* QR Code Placeholder */}
                    <div className="w-32 h-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-2">
                        <div className="w-full h-full bg-slate-200/50 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
                             {/* In a real app, use a QR component here */}
                             <div className="grid grid-cols-4 gap-1 p-2 opacity-20">
                                {[...Array(16)].map((_, i) => <div key={i} className="w-2 h-2 bg-slate-900" />)}
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deposit Address</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 font-mono text-[11px] text-slate-600 break-all leading-relaxed">
                                {currentAddress}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`p-4 rounded-xl transition-all shadow-sm flex items-center justify-center ${copied ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-900'}`}
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-medium text-amber-700 leading-relaxed">
                        Ensure you are sending <span className="font-bold">{config.token}</span> exclusively via the <span className="font-bold">{config.network}</span> network. Sending assets through an unsupported network or chain may result in permanent loss of capital.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CryptoFundingStep;
