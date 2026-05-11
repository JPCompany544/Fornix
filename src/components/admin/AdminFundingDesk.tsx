"use client";

import React, { useState } from 'react';
import { DepositRequest } from '@/types/admin';
import { createClientClient } from '@/lib/supabaseClient';
import { Check, X, ExternalLink, Loader2, Wallet, Search } from 'lucide-react';

interface AdminFundingDeskProps {
    deposits: DepositRequest[];
    loading: boolean;
    refresh: () => Promise<void>;
}

export const AdminFundingDesk = ({ deposits, loading, refresh }: AdminFundingDeskProps) => {
    const supabase = createClientClient();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // PHASE 4: show only status === "pending", order by created_at DESC
    const pendingRequests = deposits
        .filter(d => d.status === 'pending')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const filteredRequests = pendingRequests.filter(req =>
        req.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reference?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setProcessingId(id);
        try {
            const rpcName = action === 'approve' ? 'approve_deposit_request' : 'reject_deposit_request';
            const { error } = await supabase.rpc(rpcName, { p_request_id: id });
            if (error) throw error;
            // PHASE 3: rely on refresh (realtime will also trigger this, but manual refresh after RPC is safer)
            await refresh();
        } catch (err: any) {
            alert(`Action failed: ${err.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const getPublicUrl = (path: string) => {
        if (!path) return '';
        const { data } = supabase.storage.from('funding-proofs').getPublicUrl(path);
        return data.publicUrl;
    };

    if (loading && deposits.length === 0) {
        return (
            <div className="flex items-center justify-center py-40">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Funding Queue</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Institutional Capital Injections</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                        type="text"
                        placeholder="Search email or reference..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0D0F14] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs font-medium focus:outline-none focus:border-white/10 transition-all"
                    />
                </div>
            </div>

            {filteredRequests.length === 0 ? (
                <div className="bg-[#0D0F14] border border-white/5 p-20 rounded-[2.5rem] text-center opacity-30">
                    <Wallet className="w-12 h-12 mx-auto mb-6 text-slate-700" />
                    <p className="text-xs font-black uppercase tracking-[0.4em]">No pending deposits</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredRequests.map(req => (
                        <div key={req.id} className="bg-[#0D0F14] border border-white/5 rounded-[2rem] p-6 flex flex-col lg:flex-row gap-8 items-center group hover:bg-white/[0.02] transition-all">
                            <div className="w-20 h-20 bg-black rounded-2xl border border-white/10 overflow-hidden relative shrink-0">
                                {req.proof_url ? (
                                    <img src={getPublicUrl(req.proof_url)} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5"><X className="w-5 h-5 text-slate-800" /></div>
                                )}
                                {req.proof_url && (
                                    <a href={getPublicUrl(req.proof_url)} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="w-4 h-4 text-white" />
                                    </a>
                                )}
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                                <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Client Identity</p>
                                    <p className="text-sm font-bold text-white truncate">{req.profiles?.email}</p>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{new Date(req.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Settlement Amount</p>
                                    <p className="text-xl font-black text-emerald-400">${req.amount.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{req.method}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Internal Reference</p>
                                    <p className="text-[11px] font-mono text-slate-400 break-all">{req.reference}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:flex items-center gap-3 shrink-0 w-full lg:w-auto">
                                <button
                                    onClick={() => handleAction(req.id, 'reject')}
                                    disabled={processingId !== null}
                                    className="px-6 py-4 rounded-2xl bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 border border-white/5 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                >
                                    {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, 'approve')}
                                    disabled={processingId !== null}
                                    className="px-8 py-4 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/20 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                >
                                    {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
