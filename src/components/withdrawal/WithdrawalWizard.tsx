"use client";

import React, { useState, useMemo } from 'react';
import { Shield, ChevronRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

import WithdrawalMethodStep from './WithdrawalMethodStep';
import CryptoWithdrawalStep from './CryptoWithdrawalStep';
import BankWithdrawalStep from './BankWithdrawalStep';
import WithdrawalConfirmationStep from './WithdrawalConfirmationStep';

export type WithdrawalMethod = 'crypto' | 'bank' | null;

interface WithdrawalWizardProps {
    onClose: () => void;
    portfolioId: string;
    userId: string;
    availableToWithdraw: number;
    pendingWithdrawalsTotal: number;
}

const WithdrawalWizard: React.FC<WithdrawalWizardProps> = ({ 
    onClose, 
    portfolioId, 
    userId,
    availableToWithdraw,
    pendingWithdrawalsTotal
}) => {
    const { supabase } = useAuth();

    // ── Wizard State ──────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [method, setMethod] = useState<WithdrawalMethod>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // ── Configuration State ───────────────────────────────────
    const [cryptoConfig, setCryptoConfig] = useState({ token: 'USDC', network: 'Ethereum', address: '' });
    const [bankConfig, setBankConfig] = useState({ 
        bankName: '', 
        accountName: '', 
        accountNumber: '', 
        routingNumber: '', 
        swift: '' 
    });
    
    // ── Confirmation State ────────────────────────────────────
    const [amount, setAmount] = useState<string>("");
    const [confirmed, setConfirmed] = useState(false);

    // ── Reference Code Generation ─────────────────────────────
    const referenceCode = useMemo(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let res = 'WDR-';
        for (let i = 0; i < 6; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    }, []);

    const canSubmit = useMemo(() => {
        const val = parseFloat(amount);
        const hasAmount = !isNaN(val) && val >= 100 && val <= availableToWithdraw;
        const hasDetails = method === 'crypto' 
            ? cryptoConfig.address.trim() !== "" 
            : bankConfig.accountNumber.trim() !== "" && bankConfig.bankName.trim() !== "";
        
        return hasAmount && hasDetails && confirmed;
    }, [amount, availableToWithdraw, method, cryptoConfig, bankConfig, confirmed]);

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
            // Submit Withdrawal Request
            const { error: insertError } = await supabase
                .from('withdrawal_requests')
                .insert([{
                    user_id: userId,
                    portfolio_id: portfolioId,
                    amount: parseFloat(amount),
                    method: method,
                    status: 'pending',
                    reference_code: referenceCode,
                    // Crypto fields
                    token: method === 'crypto' ? cryptoConfig.token : null,
                    network: method === 'crypto' ? cryptoConfig.network : null,
                    wallet_address: method === 'crypto' ? cryptoConfig.address : null,
                    // Bank fields
                    bank_name: method === 'bank' ? bankConfig.bankName : null,
                    account_name: method === 'bank' ? bankConfig.accountName : null,
                    account_number: method === 'bank' ? bankConfig.accountNumber : null,
                    routing_number: method === 'bank' ? bankConfig.routingNumber : null,
                    swift_code: method === 'bank' ? bankConfig.swift : null
                }]);

            if (insertError) throw insertError;

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 4000);

        } catch (err: any) {
            alert(`Withdrawal Request Failed: ${err.message}`);
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Withdrawal Requested</h2>
                    <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                        Your request <span className="font-bold text-slate-900">{referenceCode}</span> has been initialized. Institutional capital settlements are processed within 24-48 hours.
                    </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 pt-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Awaiting Clearance
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fbff] overflow-hidden">
            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                
                {/* Progress Indicator */}
                <div className="flex items-center gap-4 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step >= s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-8 h-px ${step > s ? 'bg-slate-900' : 'bg-slate-200'}`} />}
                        </div>
                    ))}
                    <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {step === 1 ? 'Method' : step === 2 ? 'Details' : 'Authorize'}
                    </span>
                </div>

                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-950 tracking-tight">
                        {step === 1 ? 'Withdraw Capital' : step === 2 ? 'Destination Details' : 'Final Authorization'}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {step === 1 ? 'Choose your preferred institutional capital exit method.' : 
                         step === 2 ? 'Specify the secure destination for your capital settlement.' : 
                         'Review and authorize your capital withdrawal request.'}
                    </p>
                </div>

                <div className="mt-12">
                    {step === 1 && (
                        <WithdrawalMethodStep 
                            selected={method} 
                            onSelect={(m) => { setMethod(m); handleNext(); }} 
                        />
                    )}
                    
                    {step === 2 && method === 'crypto' && (
                        <CryptoWithdrawalStep 
                            config={cryptoConfig} 
                            onChange={setCryptoConfig} 
                        />
                    )}

                    {step === 2 && method === 'bank' && (
                        <BankWithdrawalStep 
                            config={bankConfig} 
                            onChange={setBankConfig}
                        />
                    )}

                    {step === 3 && (
                        <WithdrawalConfirmationStep 
                            amount={amount}
                            setAmount={setAmount}
                            available={availableToWithdraw}
                            pending={pendingWithdrawalsTotal}
                            confirmed={confirmed}
                            setConfirmed={setConfirmed}
                            method={method}
                            details={method === 'crypto' ? cryptoConfig : bankConfig}
                        />
                    )}
                </div>
            </div>

            {/* Footer - Pinned but Flowing */}
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
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available to Exit</span>
                        <span className="text-[10px] font-bold text-slate-900 flex items-center gap-1.5">
                            ${availableToWithdraw.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                            className={`flex items-center gap-3 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${canSubmit && !isSubmitting ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/10' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                            Authorize Withdrawal
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

export default WithdrawalWizard;
