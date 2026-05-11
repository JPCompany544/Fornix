"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { CRYPTO_CONFIG } from '@/config/funding';

interface CryptoWithdrawalStepProps {
    config: { token: string; network: string; address: string };
    onChange: (config: { token: string; network: string; address: string }) => void;
}

const CryptoWithdrawalStep: React.FC<CryptoWithdrawalStepProps> = ({ config, onChange }) => {
    
    // Available tokens/networks from config (we use the same config for supported assets)
    const tokens = Object.keys(CRYPTO_CONFIG);
    const networks = Object.keys((CRYPTO_CONFIG as any)[config.token] || {});

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Asset Selector */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exit Asset</label>
                    <div className="grid grid-cols-2 gap-2">
                        {tokens.map(t => (
                            <button
                                key={t}
                                onClick={() => onChange({ ...config, token: t, network: Object.keys((CRYPTO_CONFIG as any)[t])[0] })}
                                className={`px-4 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${config.token === t ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Network Selector */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exit Network</label>
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

            {/* Address Input */}
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination Wallet Address</label>
                <input
                    type="text"
                    value={config.address}
                    onChange={(e) => onChange({ ...config, address: e.target.value })}
                    placeholder="Enter institutional wallet address (0x...)"
                    className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-5 text-sm font-mono text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-300 transition-all shadow-sm"
                />
            </div>

            <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium text-amber-700 leading-relaxed">
                    Verify your destination address and network carefully. Digital asset transfers are irreversible. Capital will be settled exclusively to the provided <span className="font-bold">{config.network}</span> address.
                </p>
            </div>
        </div>
    );
};

export default CryptoWithdrawalStep;
