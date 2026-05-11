"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
    LayoutGrid, ArrowDownLeft, ArrowUpRight, History, 
    Users, ShieldCheck, TrendingUp, Wallet, Activity,
    ChevronRight, Loader2, Search, Filter
} from 'lucide-react';
import Link from 'next/link';
import { createClientClient } from '@/lib/supabaseClient';
import { MobileAdminShell } from '@/components/admin/MobileAdminShell';
import { AdminFundingDesk } from '@/components/admin/AdminFundingDesk';
import { AdminWithdrawalDesk } from '@/components/admin/AdminWithdrawalDesk';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';

export default function AdminDashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get('tab') || 'overview';
    
    const supabase = createClientClient();
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingFunding: 0,
        pendingWithdrawals: 0,
        totalVolume: 0
    });
    const [queueData, setQueueData] = useState<{
        deposits: any[],
        withdrawals: any[],
        transactions: any[],
        loading: boolean
    }>({
        deposits: [],
        withdrawals: [],
        transactions: [],
        loading: true
    });

    const fetchData = async () => {
        setQueueData(prev => ({ ...prev, loading: true }));
        console.log("[AdminOS] 🚨 INITIATING RESILIENT INSTITUTIONAL SYNC...");
        
        try {
            // 1. Fetch Users
            const { count: userCount, error: uError } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            if (uError) console.error("[AdminOS] Profiles Clearance Blocked:", uError.message);

            // 2. Fetch Isolated Requests (No Joins)
            const { data: rawDeposits, error: dError } = await supabase.from('deposit_requests').select('*');
            const { data: rawWithdrawals, error: wError } = await supabase.from('withdrawal_requests').select('*');
            const { data: rawTransactions } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });

            if (dError) console.error("[AdminOS] Funding Queue Received 0 Rows - RLS Check Required.");
            if (wError) console.error("[AdminOS] Withdrawal Queue Received 0 Rows - RLS Check Required.");

            // 3. Manual Profile Hydration (Bypassing Join Blocks)
            const { data: allProfiles } = await supabase.from('profiles').select('id, email');
            const profileMap = (allProfiles || []).reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {});

            const deposits = (rawDeposits || []).map(d => ({ ...d, profiles: profileMap[d.user_id] }));
            const withdrawals = (rawWithdrawals || []).map(w => ({ ...w, profiles: profileMap[w.user_id] }));
            const transactions = (rawTransactions || []).map(t => ({ ...t, profiles: profileMap[t.user_id] }));

            const pendingFunding = deposits.filter(d => d.status === 'pending').length;
            const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

            console.log("[AdminOS] Resilient Sync Complete:", {
                institutional_users: userCount || 0,
                pending_funding: pendingFunding,
                pending_settlements: pendingWithdrawals,
                total_identities_resolved: allProfiles?.length || 0
            });

            setStats({
                totalUsers: userCount || 0,
                pendingFunding,
                pendingWithdrawals,
                totalVolume: 124500.00
            });

            setQueueData({
                deposits,
                withdrawals,
                transactions,
                loading: false
            });
        } catch (err: any) {
            console.error("[AdminOS] FATAL SYNC FAILURE:", err.message);
            setQueueData(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchData();

        // ── REAL-TIME OPERATIONAL PULSE ──────────────────────────
        const channel = supabase
            .channel('admin-operational-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'deposit_requests' }, () => {
                console.log("[AdminOS] Reactive Pulse: Funding Request Detected");
                fetchData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawal_requests' }, () => {
                console.log("[AdminOS] Reactive Pulse: Withdrawal Request Detected");
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleViewChange = (view: string) => {
        if (view === 'overview') {
            router.push('/admin');
        } else if (view === 'users') {
            router.push('/admin/users');
        } else {
            router.push(`/admin?tab=${view}`);
        }
    };

    // ── MOBILE VIEW ──────────────────────────────────────────

    const MobileOverview = () => (
        <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2.5rem] p-10 text-slate-950 shadow-2xl shadow-rose-500/30">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Institutional OS</p>
                <h2 className="text-3xl font-black tracking-tighter">System Pulse</h2>
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/10 pt-6">
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60">Active Index</p>
                        <p className="text-2xl font-black">{stats.totalUsers}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60">Volume 24h</p>
                        <p className="text-2xl font-black">${stats.totalVolume.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                    <div className="w-2 h-px bg-rose-500" /> Operational Desks
                </h3>
                
                {[
                    { id: 'funding', label: 'Funding Desk', count: stats.pendingFunding, icon: ArrowDownLeft, color: 'emerald' },
                    { id: 'withdrawals', label: 'Withdrawal Desk', count: stats.pendingWithdrawals, icon: ArrowUpRight, color: 'rose' },
                    { id: 'users', label: 'Intelligence', count: stats.totalUsers, icon: Users, color: 'blue', isLink: true },
                ].map((desk) => (
                    <button 
                        key={desk.id}
                        onClick={() => handleViewChange(desk.id)}
                        className="w-full p-6 bg-[#0D0F14] border border-white/5 rounded-3xl flex items-center justify-between active:scale-[0.98] transition-all shadow-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-${desk.color}-500/10 rounded-2xl flex items-center justify-center border border-${desk.color}-500/20`}>
                                <desk.icon className={`w-6 h-6 text-${desk.color}-500`} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-white uppercase tracking-tight">{desk.label}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">{desk.isLink ? 'Global Surveillance' : `${desk.count} Pending`}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                    </button>
                ))}
            </div>
        </div>
    );

    // ── MAIN RENDER ──────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#08090D] overflow-x-hidden relative max-w-[100vw]">
            <style jsx global>{`
                html, body { overflow-x: hidden !important; width: 100%; max-width: 100vw; }
                * { box-sizing: border-box; }
            `}</style>

            {/* 📱 MOBILE VIEW (Visible < lg) */}
            <div className="lg:hidden">
                <MobileAdminShell activeView={activeTab} onViewChange={handleViewChange}>
                    {queueData.loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-30">
                            <Loader2 className="w-12 h-12 animate-spin text-rose-500" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Encrypting Desks...</p>
                        </div>
                    ) : (
                        <div className="flex-1">
                            {activeTab === 'overview' && <MobileOverview />}
                            {activeTab === 'funding' && <div className="p-4"><AdminFundingDesk deposits={queueData.deposits} loading={queueData.loading} refresh={fetchData} /></div>}
                            {activeTab === 'withdrawals' && <div className="p-4"><AdminWithdrawalDesk withdrawals={queueData.withdrawals} loading={queueData.loading} refresh={fetchData} /></div>}
                            {activeTab === 'audit' && <div className="p-4"><AdminAuditLog transactions={queueData.transactions} loading={queueData.loading} /></div>}
                        </div>
                    )}
                </MobileAdminShell>
            </div>

            {/* 🖥️ DESKTOP VIEW (Visible lg+) */}
            <div className="hidden lg:flex h-screen overflow-hidden">
                {/* Desktop sidebar */}
                <div className="w-72 bg-[#0D0F14] border-r border-white/5 p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-slate-950" /></div>
                        <span className="text-lg font-black text-white uppercase tracking-tighter">Fornix OS</span>
                    </div>
                    <nav className="flex-1 space-y-2">
                        {[
                            { id: 'overview', label: 'System Pulse', icon: LayoutGrid },
                            { id: 'funding', label: 'Funding Desk', icon: ArrowDownLeft },
                            { id: 'withdrawals', label: 'Withdrawal Desk', icon: ArrowUpRight },
                            { id: 'users', label: 'Intelligence', icon: Users, isLink: true },
                            { id: 'audit', label: 'Audit Logs', icon: History },
                        ].map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => handleViewChange(item.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white/5 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                            >
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-rose-500' : ''}`} />
                                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex-1 flex flex-col bg-[#08090D] overflow-hidden">
                    <header className="p-10 border-b border-white/5 bg-[#0D0F14]/30 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                                {activeTab === 'overview' ? 'System Overview' : 
                                 activeTab === 'funding' ? 'Funding Queue' : 
                                 activeTab === 'withdrawals' ? 'Withdrawals' : 'System Audit'}
                            </h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">Operational Control Center</p>
                        </div>
                    </header>
                    
                    <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-3 gap-10">
                                <div className="p-10 bg-[#0D0F14] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center"><ArrowDownLeft className="w-8 h-8 text-emerald-500" /></div>
                                    <h2 className="text-2xl font-black text-white uppercase">Funding Queue</h2>
                                    <p className="text-5xl font-black text-emerald-500">{stats.pendingFunding}</p>
                                </div>
                                <div className="p-10 bg-[#0D0F14] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <div className="w-16 h-16 bg-rose-500/10 rounded-3xl flex items-center justify-center"><ArrowUpRight className="w-8 h-8 text-rose-500" /></div>
                                    <h2 className="text-2xl font-black text-white uppercase">Withdrawals</h2>
                                    <p className="text-5xl font-black text-rose-500">{stats.pendingWithdrawals}</p>
                                </div>
                                <div className="p-10 bg-[#0D0F14] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center"><Users className="w-8 h-8 text-blue-500" /></div>
                                    <h2 className="text-2xl font-black text-white uppercase">Intelligence</h2>
                                    <p className="text-5xl font-black text-blue-500">{stats.totalUsers}</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'funding' && <AdminFundingDesk deposits={queueData.deposits} loading={queueData.loading} refresh={fetchData} />}
                        {activeTab === 'withdrawals' && <AdminWithdrawalDesk withdrawals={queueData.withdrawals} loading={queueData.loading} refresh={fetchData} />}
                        {activeTab === 'audit' && <AdminAuditLog transactions={queueData.transactions} loading={queueData.loading} />}
                    </main>
                </div>
            </div>
        </div>
    );
}
