"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle2, TrendingUp, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface DepositConfirmationProps {
    amount: string;
    onGoToDashboard: () => void;
}

const DepositConfirmation: React.FC<DepositConfirmationProps> = ({ amount, onGoToDashboard }) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[250] bg-[#020617] text-slate-300 flex flex-col items-center justify-center font-sans overflow-y-auto">
            {/* Background Ambience */}
            <div className="absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

            <div className={`relative z-10 w-full max-w-xl px-8 flex flex-col items-center transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Animated Checkmark */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    <CheckCircle2 className="w-20 h-20 text-emerald-500 relative z-10" />
                </div>

                {/* Title */}
                <h1 className="text-4xl font-light tracking-tight text-white mb-4 text-center">
                    Deposit successful. <br />
                    <span className="text-emerald-500 italic">Your capital is live.</span>
                </h1>

                {/* Deposit Summary Card */}
                <div className="w-full bg-slate-900/50 border border-slate-800 p-8 mb-10 mt-6 space-y-6 backdrop-blur-md">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 uppercase tracking-widest font-bold">Total Deployed</span>
                        <span className="text-white font-mono text-xl">{amount}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-6">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-500 uppercase tracking-widest font-bold">Activation Date</span>
                        </div>
                        <span className="text-slate-300 font-mono italic">Immediate</span>
                    </div>

                    <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-6">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-500 uppercase tracking-widest font-bold">Starting Confidence</span>
                        </div>
                        <span className="text-emerald-500 font-mono tracking-widest uppercase">High (98.2)</span>
                    </div>
                </div>

                {/* Primary CTA */}
                <button
                    onClick={onGoToDashboard}
                    className="group relative w-full py-5 bg-emerald-600 text-white font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-emerald-50 hover:text-black active:scale-[0.98] flex items-center justify-center space-x-3"
                >
                    <span>Initialize Dashboard</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                {/* Assurance Footnote */}
                <div className="mt-12 flex items-center space-x-2 opacity-40">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Verified by Fornix Audit Layer</span>
                </div>
            </div>
        </div>
    );
};

export default DepositConfirmation;
