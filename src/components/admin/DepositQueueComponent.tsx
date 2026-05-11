"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createClientClient } from '@/lib/supabaseClient';
import { Check, X, ExternalLink, Loader2, RefreshCw, Wallet, ArrowRight } from 'lucide-react';

interface DepositRequest {
    id: string;
    user_id: string;
    amount: number;
    method: string;
    reference: string;
    proof_url: string;
    status: string;
    created_at: string;
    profiles: {
        email: string;
    };
}

const DepositQueueComponent = () => {
    const supabase = createClientClient();
    const [requests, setRequests] = useState<DepositRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchQueue = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('deposit_requests')
                .select(`
                    id, user_id, amount, method, reference, proof_url, status, created_at,
                    profiles(email)
                `)
                .eq('status', 'pending')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setRequests(data as any);
        } catch (err: any) {
            console.error("Fetch failed:", err.message);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchQueue();
    }, [fetchQueue]);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setProcessingId(id);
        try {
            const rpcName = action === 'approve' ? 'approve_deposit_request' : 'reject_deposit_request';
            const { error } = await supabase.rpc(rpcName, { p_request_id: id });
            if (error) throw error;
            setRequests(prev => prev.filter(req => req.id !== id));
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

    if (loading && requests.length === 0) {
        return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
    }

    if (requests.length === 0) {
        return (
            <div className="bg-white/5 border border-white/5 p-12 rounded-[2rem] text-center opacity-30">
                <Wallet className="w-10 h-10 mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.4em]">No pending deposits</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map(req => (
                <div key={req.id} className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col lg:flex-row gap-6 items-center group hover:bg-white/[0.05] transition-all">
                    {/* Tiny Proof Preview */}
                    <div className="w-16 h-16 bg-black rounded-xl border border-white/10 overflow-hidden relative shrink-0">
                        {req.proof_url ? (
                            <img src={getPublicUrl(req.proof_url)} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><X className="w-4 h-4 text-slate-800" /></div>
                        )}
                        {req.proof_url && (
                            <a href={getPublicUrl(req.proof_url)} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-3 h-3 text-white" />
                            </a>
                        )}
                    </div>

                    <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Client</p>
                            <p className="text-xs font-bold text-white truncate">{req.profiles.email}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Amount</p>
                            <p className="text-sm font-black text-emerald-400">${req.amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reference</p>
                            <p className="text-[10px] font-mono text-slate-400 truncate">{req.reference}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button 
                            onClick={() => handleAction(req.id, 'reject')}
                            disabled={processingId !== null}
                            className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 transition-all hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleAction(req.id, 'approve')}
                            disabled={processingId !== null}
                            className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 transition-all hover:text-white"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DepositQueueComponent;
