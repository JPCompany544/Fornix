"use client";

import React, { useState } from 'react';
import { WithdrawalRequest } from '@/types/admin';
import { createClientClient } from '@/lib/supabaseClient';
import { 
    Check, X, Loader2, Landmark, Coins, 
    Search, User, ExternalLink, AlertCircle, 
    ShieldCheck, ChevronRight 
} from 'lucide-react';

interface AdminWithdrawalDeskProps {
    withdrawals: WithdrawalRequest[];
    loading: boolean;
    refresh: () => Promise<void>;
}

export const AdminWithdrawalDesk = ({ withdrawals, loading, refresh }: AdminWithdrawalDeskProps) => {
    const supabase = createClientClient();
    
    const [activeQueue, setActiveQueue] = useState<'queue' | 'history'>('queue');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [processingAction, setProcessingAction] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredList = withdrawals
        .filter(w => {
            const email = w.profiles?.email || "";
            const ref = w.reference_code || "";
            const isMatch = ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          email.toLowerCase().includes(searchQuery.toLowerCase());
            
            const status = w.status?.toLowerCase() || "";
            if (activeQueue === 'queue') {
                return isMatch && (status === 'pending' || status === 'processing');
            } else {
                return isMatch && (status === 'approved' || status === 'rejected' || status === 'completed');
            }
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const handleStatusUpdate = async (id: string, status: string, notes?: string) => {
        setProcessingAction(id);
        try {
            if (status === 'approved') {
                const { error } = await supabase.rpc('approve_withdrawal_request', { p_request_id: id });
                if (error) throw error;
            } else if (status === 'rejected') {
                const { error } = await supabase.rpc('reject_withdrawal_request', { 
                    p_request_id: id, 
                    p_notes: notes || 'Refused by institutional desk.' 
                });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('withdrawal_requests')
                    .update({ 
                        status: status as any,
                        admin_notes: notes || null,
                        processed_at: new Date().toISOString()
                    })
                    .eq('id', id);
                if (error) throw error;
            }
            await refresh();
            setSelectedId(null);
        } catch (err: any) {
            alert(`Action failed: ${err.message}`);
        } finally {
            setProcessingAction(null);
        }
    };

    const selectedRequest = withdrawals.find(r => r.id === selectedId);

    // ── MOBILE VIEW ──────────────────────────────────────────
    
    const MobileView = () => (
        <div className="flex flex-col space-y-6">
            <div className="flex bg-[#0D0F14] rounded-2xl p-1.5 border border-white/5">
                <button onClick={() => setActiveQueue('queue')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeQueue === 'queue' ? 'bg-rose-500 text-slate-950' : 'text-slate-500'}`}>Queue</button>
                <button onClick={() => setActiveQueue('history')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeQueue === 'history' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>Audit</button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                    type="text" 
                    placeholder="Search Reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0D0F14] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-rose-500/50"
                />
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>
                ) : filteredList.map(req => (
                    <div key={req.id} className="bg-[#0D0F14] border border-white/5 rounded-3xl p-6 space-y-6 shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{req.reference_code}</p>
                                <p className="text-sm font-black text-white">{req.profiles?.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${req.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>{req.status}</span>
                        </div>
                        
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase">Settlement</p>
                                <p className="text-xl font-black text-rose-500">${req.amount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-600 uppercase">Method</p>
                                <p className="text-xs font-bold text-white uppercase">{req.method}</p>
                            </div>
                        </div>

                        {req.status === 'pending' && (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button onClick={() => handleStatusUpdate(req.id, 'rejected')} className="py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-slate-500 border border-white/5">Reject</button>
                                <button onClick={() => handleStatusUpdate(req.id, 'approved')} className="py-4 bg-rose-500 rounded-2xl text-[10px] font-black uppercase text-slate-950 shadow-lg shadow-rose-500/20">Authorize</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // ── DESKTOP VIEW ─────────────────────────────────────────

    return (
        <div className="w-full">
            {/* Desktop Only Wrapper */}
            <div className="hidden lg:flex h-[800px] bg-[#0A0C10] rounded-[2.5rem] overflow-hidden border border-white/5">
                {/* Previous desktop code ... */}
                <div className="w-[400px] flex flex-col border-r border-white/5 bg-[#0D0F14]">
                    <div className="p-6 space-y-4 border-b border-white/5">
                        <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
                            <button onClick={() => setActiveQueue('queue')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeQueue === 'queue' ? 'bg-rose-500 text-slate-950' : 'text-slate-500'}`}>Active Queue</button>
                            <button onClick={() => setActiveQueue('history')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeQueue === 'history' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>Audit History</button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredList.map(req => (
                            <button key={req.id} onClick={() => setSelectedId(req.id)} className={`w-full p-5 text-left border-b border-white/5 relative ${selectedId === req.id ? 'bg-white/[0.03]' : ''}`}>
                                {selectedId === req.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />}
                                <p className="text-[10px] font-black text-slate-500 mb-1">{req.reference_code}</p>
                                <p className="text-sm font-bold text-white mb-1 truncate">{req.profiles?.email}</p>
                                <p className="text-lg font-black text-rose-400">${req.amount.toLocaleString()}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-[#08090D] overflow-hidden">
                    {!selectedRequest ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-10"><ShieldCheck className="w-20 h-20" /><p className="text-sm font-black uppercase tracking-widest mt-4">Select request</p></div>
                    ) : (
                        <div className="flex-1 flex flex-col p-12 overflow-y-auto custom-scrollbar space-y-10">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Withdrawal Review</h2>
                            <div className="grid grid-cols-3 gap-8">
                                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl"><p className="text-[10px] font-black text-slate-500 uppercase mb-2">Exit Amount</p><p className="text-4xl font-black text-white">${selectedRequest.amount.toLocaleString()}</p></div>
                                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl"><p className="text-[10px] font-black text-slate-500 uppercase mb-2">Method</p><p className="text-2xl font-bold text-white uppercase">{selectedRequest.method}</p></div>
                                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl"><p className="text-[10px] font-black text-slate-500 uppercase mb-2">Status</p><p className="text-2xl font-bold text-white uppercase">{selectedRequest.status}</p></div>
                            </div>
                            <div className="p-10 bg-[#0D0F14] rounded-[2rem] border border-white/5 flex justify-end gap-4">
                                <button onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')} className="px-10 py-5 bg-white/5 rounded-2xl text-[11px] font-black uppercase text-slate-400 hover:text-rose-500 transition-all">Reject</button>
                                <button onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')} className="px-12 py-5 bg-rose-500 rounded-2xl text-[11px] font-black uppercase text-slate-950 shadow-xl shadow-rose-500/20">Authorize</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden">
                <MobileView />
            </div>
        </div>
    );
};
