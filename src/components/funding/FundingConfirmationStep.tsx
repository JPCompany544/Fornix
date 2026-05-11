"use client";

import React from 'react';
import { Upload, FileImage, FileText, CheckCircle2 } from 'lucide-react';

interface FundingConfirmationStepProps {
    amount: string;
    setAmount: (val: string) => void;
    proofFile: File | null;
    setProofFile: (file: File | null) => void;
    confirmed: boolean;
    setConfirmed: (val: boolean) => void;
    method: 'crypto' | 'bank' | null;
}

const FundingConfirmationStep: React.FC<FundingConfirmationStepProps> = ({
    amount, setAmount, proofFile, setProofFile, confirmed, setConfirmed, method
}) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProofFile(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Amount Input */}
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between">
                    <span>Authorized Capital Amount (USD)</span>
                    <span className="text-emerald-600">Institutional Minimum: $1,000</span>
                </label>
                <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                    <input
                        type="number"
                        min="1000"
                        autoFocus
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-100 rounded-2xl py-6 pl-14 pr-6 text-3xl font-black tracking-tight text-slate-900 focus:outline-none focus:border-slate-300 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Proof Upload */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Execution Proof</label>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Optional</span>
                </div>
                
                <div className="relative group cursor-pointer">
                    <input 
                        type="file" 
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${proofFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white group-hover:border-slate-300 group-hover:bg-slate-50'}`}>
                        {proofFile ? (
                            <div className="flex flex-col items-center gap-3">
                                {proofFile.type === 'application/pdf' ? <FileText className="w-8 h-8 text-emerald-500" /> : <FileImage className="w-8 h-8 text-emerald-500" />}
                                <span className="text-xs font-bold text-emerald-700 text-center px-4 truncate max-w-xs">{proofFile.name}</span>
                                <span className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest">Attached</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <Upload className="w-8 h-8 text-slate-300 group-hover:text-slate-400 transition-colors" />
                                <span className="text-xs font-bold text-slate-500">Attach Transfer Receipt</span>
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">JPEG, PNG, or PDF</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Terms & Confirmation */}
            <div className="pt-6 border-t border-slate-100">
                <div 
                    onClick={() => setConfirmed(!confirmed)}
                    className="w-full flex items-center gap-4 text-left cursor-pointer group p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all shadow-sm"
                >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${confirmed ? 'bg-slate-900 border-slate-900' : 'border-slate-200 group-hover:border-slate-300'}`}>
                        {confirmed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                            Authorize Settlement Verification
                        </span>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            I confirm that the funds have been sent according to the provided instructions. Settlement is subject to institutional verification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundingConfirmationStep;
