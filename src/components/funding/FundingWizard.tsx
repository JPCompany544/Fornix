"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Shield, ChevronRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { createClientClient } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';
import { uploadFundingProof } from '@/lib/uploadFundingProof';

import FundingMethodStep from './FundingMethodStep';
import CryptoFundingStep from './CryptoFundingStep';
import BankFundingStep from './BankFundingStep';
import FundingConfirmationStep from './FundingConfirmationStep';

export type FundingMethod = 'crypto' | 'bank' | null;

interface FundingWizardProps {
    onClose: () => void;
    portfolioId: string;
    userId: string;
}

const FundingWizard: React.FC<FundingWizardProps> = ({ onClose, portfolioId, userId }) => {
    const { supabase } = useAuth();

    // ── Wizard State ──────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [method, setMethod] = useState<FundingMethod>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // ── Configuration State ───────────────────────────────────
    const [cryptoConfig, setCryptoConfig] = useState({ token: 'USDC', network: 'Ethereum' });
    const [bankType, setBankType] = useState<'WIRE' | 'ACH'>('WIRE');
    
    // ── Confirmation State ────────────────────────────────────
    const [amount, setAmount] = useState<string>("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    // ── Reference Code Generation ─────────────────────────────
    const referenceCode = useMemo(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let res = 'FORNIX-';
        for (let i = 0; i < 6; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    }, []);

    const canSubmit = amount !== "" && parseFloat(amount) >= 1000 && confirmed;

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleFinalize = async () => {
        if (!canSubmit || isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. Proof Upload
            let proofPath: string | null = null;
            if (proofFile) {
                try {
                    proofPath = await uploadFundingProof(proofFile);
                } catch (uErr) {
                    console.warn("[Fornix] Proof upload failed, proceeding with manual reconciliation.");
                }
            }

            // 2. Submit
            const fundingDetail = method === 'crypto' 
                ? `${cryptoConfig.token} (${cryptoConfig.network})`
                : bankType;

            const { error: insertError } = await supabase
                .from('deposit_requests')
                .insert([{
                    user_id: userId,
                    portfolio_id: portfolioId,
                    amount: parseFloat(amount),
                    method: fundingDetail,
                    reference: referenceCode,
                    proof_url: proofPath,
                    status: 'pending'
                }]);

            if (insertError) throw insertError;

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 4000);

        } catch (err: any) {
            alert(`Onboarding Error: ${err.message}`);
            setIsSubmitting(false);
        }
    };

    // ── Render Helpers ────────────────────────────────────────

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transfer Initialized</h2>
                    <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                        Your capital onboarding request <span className="font-bold text-slate-900">{referenceCode}</span> is now queued for institutional verification.
                    </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 pt-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Settlement
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fbff] overflow-hidden">
            {/* Body - Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 md:p-16 max-w-4xl mx-auto w-full space-y-12 pb-12">
                    
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step >= s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {s}
                                </div>
                                {s < 3 && <div className={`w-8 h-px ${step > s ? 'bg-slate-900' : 'bg-slate-200'}`} />}
                            </div>
                        ))}
                        <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {step === 1 ? 'Method' : step === 2 ? 'Details' : 'Confirm'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none">
                            {step === 1 ? 'Select Funding Channel' : step === 2 ? 'Funding Instructions' : 'Authorize Capital Transfer'}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            {step === 1 ? 'Choose your preferred institutional capital onboarding method.' : 
                             step === 2 ? 'Follow the instructions below to initiate your transfer.' : 
                             'Provide your transfer details for settlement verification.'}
                        </p>
                    </div>

                    <div className="pt-4">
                        {step === 1 && (
                            <FundingMethodStep 
                                selected={method} 
                                onSelect={(m) => { setMethod(m); handleNext(); }} 
                            />
                        )}
                        
                        {step === 2 && method === 'crypto' && (
                            <CryptoFundingStep 
                                config={cryptoConfig} 
                                onChange={setCryptoConfig} 
                            />
                        )}

                        {step === 2 && method === 'bank' && (
                            <BankFundingStep 
                                type={bankType} 
                                onChange={setBankType}
                                referenceCode={referenceCode}
                            />
                        )}

                        {step === 3 && (
                            <FundingConfirmationStep 
                                amount={amount}
                                setAmount={setAmount}
                                proofFile={proofFile}
                                setProofFile={setProofFile}
                                confirmed={confirmed}
                                setConfirmed={setConfirmed}
                                method={method}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer - Fixed Height Flex Child */}
            <div className="shrink-0 p-8 bg-white border-t border-slate-100 flex items-center justify-between z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <div className="flex-1">
                    {step > 1 && (
                        <button 
                            onClick={handleBack}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end pr-4 border-r border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security Level</span>
                        <span className="text-[10px] font-bold text-slate-900 flex items-center gap-1.5">
                            <Shield className="w-3 h-3 text-emerald-500" /> AES-256 Verified
                        </span>
                    </div>

                    {step < 3 && method && (
                        <button 
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all"
                        >
                            Continue <ChevronRight className="w-4 h-4" />
                        </button>
                    )}

                    {step === 3 && (
                        <button 
                            disabled={!canSubmit || isSubmitting}
                            onClick={handleFinalize}
                            className={`flex items-center gap-3 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
                                canSubmit && !isSubmitting 
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/10' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Shield className="w-4 h-4" />
                            )}
                            {isSubmitting ? 'Verifying...' : 
                             !amount ? 'Enter Amount' :
                             parseFloat(amount) < 1000 ? 'Min. $1,000 Required' :
                             !confirmed ? 'Check Authorization' : 
                             'Authorize Funding Request'}
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default FundingWizard;
