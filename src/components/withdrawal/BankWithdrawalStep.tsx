"use client";

import React from 'react';
import { Landmark } from 'lucide-react';

interface BankWithdrawalStepProps {
    config: { 
        bankName: string; 
        accountName: string; 
        accountNumber: string; 
        routingNumber: string; 
        swift: string 
    };
    onChange: (config: any) => void;
}

const BankWithdrawalStep: React.FC<BankWithdrawalStepProps> = ({ config, onChange }) => {
    
    const InputField = ({ label, placeholder, value, field }: { label: string, placeholder: string, value: string, field: string }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange({ ...config, [field]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-white border border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-300 transition-all shadow-sm"
            />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <InputField label="Beneficiary Account Name" value={config.accountName} field="accountName" placeholder="e.g. Fornix Capital LLC" />
                </div>
                <InputField label="Bank Name" value={config.bankName} field="bankName" placeholder="e.g. JP Morgan Chase" />
                <InputField label="Account Number" value={config.accountNumber} field="accountNumber" placeholder="Full Account Number" />
                <InputField label="Routing / ABA" value={config.routingNumber} field="routingNumber" placeholder="9-digit Routing" />
                <InputField label="SWIFT / BIC (Optional)" value={config.swift} field="swift" placeholder="Institutional SWIFT Code" />
            </div>

            <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-100 rounded-2xl">
                <Landmark className="w-5 h-5 text-slate-400" />
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-relaxed">
                    Settlements are processed via domestic ACH or international WIRE depending on routing availability.
                </p>
            </div>
        </div>
    );
};

export default BankWithdrawalStep;
