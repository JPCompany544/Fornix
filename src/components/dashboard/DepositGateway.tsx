"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Upload, FileCheck, CheckCircle2, Loader2, X, FileImage, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClientClient } from '@/lib/supabaseClient';
import { useAuth } from '@/providers/AuthProvider';
import { uploadFundingProof } from '@/lib/uploadFundingProof';

interface DepositGatewayProps {
    onActivated?: () => void;
}

const FUNDING_METHODS = [
    { id: 'wire', name: 'Wire Transfer (USD)' },
    { id: 'crypto', name: 'USDC (ERC-20)' },
    { id: 'ach', name: 'ACH Transfer' }
];

const DepositGateway: React.FC<DepositGatewayProps> = ({ onActivated }) => {
    const { user } = useAuth();
    const supabase = createClientClient();
    const router = useRouter();

    const [amount, setAmount] = useState<string>("");
    const [method, setMethod] = useState<string>('wire');
    const [reference, setReference] = useState<string>("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isActivating, setIsActivating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Proof is optional — amount + method + reference is enough to submit
    const isReady = amount !== "" && parseFloat(amount) > 0 && reference.trim() !== "";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProofFile(e.target.files[0]);
        }
    };

    const handleActivate = async () => {
        if (!isReady || isActivating || !user) return;

        const enteredAmount = parseFloat(amount);
        if (isNaN(enteredAmount) || enteredAmount <= 0) return;

        setIsActivating(true);

        try {
            // 1. Get user's portfolio ID
            const { data: portfolio, error: pError } = await supabase
                .from('portfolios')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (pError || !portfolio) throw new Error("Portfolio not found.");

            // 2. Attempt proof upload (optional — never blocks submission)
            let proofPath: string | null = null;
            if (proofFile) {
                try {
                    proofPath = await uploadFundingProof(proofFile);
                } catch (uploadErr: any) {
                    console.warn("[Fornix] Proof upload skipped:", uploadErr.message);
                    // Continue without proof — admin can request it manually
                }
            }

            // 3. Insert Pending Deposit Request
            const { error: insertError } = await supabase
                .from('deposit_requests')
                .insert([{
                    user_id: user.id,
                    portfolio_id: portfolio.id,
                    amount: enteredAmount,
                    method: method,
                    reference: reference,
                    proof_url: proofPath,
                    status: 'pending'
                }]);

            if (insertError) throw insertError;

            // Success
            setIsSuccess(true);
            setTimeout(() => {
                if (onActivated) {
                    onActivated();
                } else {
                    router.push('/Dashboard/Live');
                    router.refresh();
                }
            }, 3000);

        } catch (err: any) {
            console.error("[Fornix] Funding request failure:", err.message);
            alert(`Funding Request Failed: ${err.message}`);
            setIsActivating(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff] text-slate-900 p-6">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center max-w-md text-center border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-4">Request Submitted</h2>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        Your funding request for <span className="text-slate-900 font-bold">${parseFloat(amount).toLocaleString()}</span> is now pending administrative review. Funds will be credited to your balance upon verification.
                    </p>
                    <div className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" /> Awaiting Institutional Approval
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="relative w-full flex flex-col items-center bg-[#f8fbff] text-slate-900 font-sans min-h-screen pb-20">
            <div className="w-full max-w-[1200px] px-6 md:px-10 pt-20 flex flex-col items-center">
                
                <div className="text-center space-y-4 mb-16">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Institutional Access</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">Capital Onboarding</h1>
                    <p className="text-base text-slate-500 font-medium max-w-lg mx-auto">
                        Submit wire or transfer details to securely initialize your capital. All deposits require institutional compliance review.
                    </p>
                </div>

                <div className="w-full max-w-3xl bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 space-y-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="relative z-10 space-y-10">
                        {/* Amount */}
                        <div className="space-y-4">
                            <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 flex justify-between">
                                <span>Deposit Amount (USD)</span>
                                <span className="text-emerald-600">Min: $1,000</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                                <input
                                    type="number"
                                    min="1000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 pl-14 pr-6 text-3xl font-black tracking-tight text-slate-900 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Method & Reference Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">Funding Method</label>
                                <div className="space-y-2">
                                    {FUNDING_METHODS.map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMethod(m.id)}
                                            className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-bold transition-all ${method === m.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                        >
                                            {m.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 flex flex-col justify-start">
                                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">Reference / TxID</label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="e.g. WIRE-0942 or 0x..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
                                />
                                <p className="text-[10px] font-medium text-slate-400 mt-2">Required to match your inbound capital to your account.</p>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-4 border-t border-slate-100 pt-10">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">Proof of Payment</label>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Optional</span>
                            </div>
                            
                            <div className="relative group/upload cursor-pointer">
                                <input 
                                    type="file" 
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <div className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${proofFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 group-hover/upload:border-slate-400 group-hover/upload:bg-slate-100'}`}>
                                    {proofFile ? (
                                        <div className="flex flex-col items-center gap-3">
                                            {proofFile.type === 'application/pdf' ? <FileText className="w-8 h-8 text-emerald-500" /> : <FileImage className="w-8 h-8 text-emerald-500" />}
                                            <span className="text-sm font-bold text-emerald-700 text-center px-4 truncate max-w-xs">{proofFile.name}</span>
                                            <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Attached</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <Upload className="w-8 h-8 text-slate-300 group-hover/upload:text-slate-400 transition-colors" />
                                            <span className="text-sm font-bold text-slate-500">Attach transfer receipt</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPEG, PNG, or PDF (Max 5MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-slate-400">Attaching proof speeds up admin review. You may also send it separately if unavailable.</p>
                        </div>

                        <button
                            disabled={!isReady || isActivating}
                            onClick={handleActivate}
                            className={`w-full py-6 rounded-2xl font-black tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center gap-4 text-xs ${isReady
                                ? 'bg-slate-900 text-white hover:bg-black active:scale-[0.99]'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                }`}
                        >
                            {isActivating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Encrypting & Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4" />
                                    <span>Submit Funding Request</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DepositGateway;
