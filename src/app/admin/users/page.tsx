"use client";

import React, { useState, useEffect } from 'react';
import { 
    Search, Activity, Wallet, PieChart, 
    TrendingUp, TrendingDown, Eye, History,
    ChevronRight, Loader2, User as UserIcon,
    ArrowLeft, List, Layout, Zap, Menu,
    ShieldCheck, Users, ArrowDownLeft, ArrowUpRight, LayoutGrid
} from 'lucide-react';
import Link from 'next/link';
import { createClientClient } from '@/lib/supabaseClient';
import { useUserIntelligence } from '@/hooks/useUserIntelligence';
import { UserIntelligenceRow } from '@/components/admin/UserIntelligenceRow';
import { MobileAdminShell } from '@/components/admin/MobileAdminShell';

type MobileTab = "users" | "profile" | "activity";

export default function AdminUsersDashboard() {
    const [activeTab, setActiveTab] = useState<MobileTab>("users");
    
    const supabase = createClientClient();
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(true);

    const { data: intel, loading: loadingIntel } = useUserIntelligence(selectedUserId);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase.rpc('get_admin_user_list');
            if (error) {
                const { data: directData } = await supabase.from('profiles').select('*');
                setUsers(directData || []);
            } else {
                setUsers(data || []);
            }
            setLoadingUsers(false);
        };
        fetchUsers();
    }, [supabase]);

    const handleUserSelect = (id: string) => {
        setSelectedUserId(id);
        setActiveTab("profile");
    };

    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── MOBILE VIEWS (ISOLATED) ───────────────────────────────
    
    const MobileUsersList = () => (
        <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                    type="text" 
                    placeholder="Search identities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0D0F14] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-rose-500/30 transition-all"
                />
            </div>
            
            <div className="space-y-3">
                {loadingUsers ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>
                ) : filteredUsers.map(user => (
                    <button 
                        key={user.id}
                        onClick={() => handleUserSelect(user.id)}
                        className="w-full p-6 bg-[#0D0F14] border border-white/5 rounded-3xl flex items-center justify-between text-left active:bg-white/5 transition-colors"
                    >
                        <div className="space-y-1">
                            <p className="text-sm font-black text-white truncate w-48">{user.email}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Surveillance</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-700" />
                    </button>
                ))}
            </div>
        </div>
    );

    const MobileProfileView = () => (
        <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {!selectedUserId ? (
                <div className="py-40 flex flex-col items-center opacity-20 gap-4"><UserIcon className="w-16 h-16" /><p className="text-xs font-black uppercase">Select target</p></div>
            ) : loadingIntel ? (
                <div className="py-40 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-rose-500" /></div>
            ) : (
                <>
                    <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2.5rem] p-10 text-slate-950 shadow-2xl">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-8 leading-tight">{intel?.profile.full_name || 'Active Account'}</h3>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Valuation</p>
                            <p className="text-4xl font-black tracking-tighter">${intel?.portfolio.total_value?.toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0D0F14] border border-white/10 p-6 rounded-3xl">
                            <p className="text-[9px] font-black text-slate-500 uppercase">Cash</p>
                            <p className="text-xl font-black text-white mt-1">${intel?.portfolio.cash_balance?.toLocaleString()}</p>
                        </div>
                        <div className="bg-[#0D0F14] border border-white/10 p-6 rounded-3xl">
                            <p className="text-[9px] font-black text-slate-500 uppercase">P/L</p>
                            <p className={`text-xl font-black mt-1 ${intel?.portfolio.total_unrealized_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                ${intel?.portfolio.total_unrealized_pnl?.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] px-2">Portfolio Inventory</h4>
                        {intel?.holdings.map((h: any, i: number) => (
                            <div key={i} className="bg-[#0D0F14] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-xs text-white border border-white/10">{h.symbol}</div>
                                    <p className="text-sm font-black text-white">{h.symbol}</p>
                                </div>
                                <p className="text-sm font-black text-white">${h.market_value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    const MobileFeedView = () => (
        <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                <Activity className="w-4 h-4 text-rose-500" /> Audit Feed
            </h4>
            <div className="space-y-4">
                {intel?.transactions.map((tx: any, i: number) => (
                    <div key={i} className="bg-[#0D0F14] border border-white/5 p-6 rounded-[2rem] flex items-center gap-5 shadow-xl">
                        <div className={`w-1 h-10 rounded-full ${tx.type === 'buy' || tx.type === 'deposit' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-xs font-black text-white uppercase tracking-widest">{tx.type} {tx.symbol}</p>
                                <span className="text-[9px] font-bold text-slate-600">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xl font-black text-white mt-1">${(tx.amount || 0).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#08090D] overflow-x-hidden relative max-w-[100vw]">
            
            <style jsx global>{`
                html, body { 
                    overflow-x: hidden !important; 
                    position: relative;
                    width: 100%;
                    max-width: 100vw;
                }
                * { max-width: 100vw; box-sizing: border-box; }
            `}</style>

            {/* 📱 MOBILE VIEW (Visible < lg) */}
            <div className="lg:hidden">
                <MobileAdminShell activeView={activeTab} onViewChange={(v) => setActiveTab(v as MobileTab)}>
                    {activeTab === "users" && <MobileUsersList />}
                    {activeTab === "profile" && <MobileProfileView />}
                    {activeTab === "activity" && <MobileFeedView />}
                </MobileAdminShell>
            </div>

            {/* 🖥️ DESKTOP VIEW (Visible lg+) */}
            <div className="hidden lg:flex h-screen overflow-hidden">
                {/* LEFT PANE */}
                <div className="w-[380px] flex flex-col bg-[#0D0F14] border-r border-white/5">
                    <div className="p-8 space-y-6 border-b border-white/5">
                        <Link href="/admin" className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-rose-500 transition-colors group">
                            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Back to System
                        </Link>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Identity Index</h1>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input 
                                type="text" 
                                placeholder="Search identities..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs focus:outline-none focus:border-white/10 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loadingUsers ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-rose-500" /></div>
                        ) : filteredUsers.map(user => (
                            <UserIntelligenceRow key={user.id} user={user} isSelected={selectedUserId === user.id} onClick={() => handleUserSelect(user.id)} />
                        ))}
                    </div>
                </div>

                {/* CENTER PANE */}
                <div className="flex-1 flex flex-col bg-[#08090D] overflow-hidden">
                    {!selectedUserId ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-4"><Activity className="w-20 h-20" /><p className="text-sm font-black uppercase tracking-[0.6em]">Select identity</p></div>
                    ) : loadingIntel && !intel ? (
                        <div className="flex-1 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-rose-500" /></div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="p-10 border-b border-white/5 bg-[#0D0F14]/30 flex justify-between items-end">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{intel?.profile.full_name || 'Operational Account'}</h2>
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500"><span>{intel?.profile.email}</span><div className="w-1 h-1 bg-slate-700 rounded-full" /><span>{intel?.profile.id}</span></div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Portfolio Value</p>
                                    <p className="text-3xl font-black text-white">${intel?.portfolio.total_value?.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"><span className="text-[10px] font-black text-slate-500 uppercase">Cash</span><p className="text-3xl font-black text-white mt-2">${intel?.portfolio.cash_balance?.toLocaleString()}</p></div>
                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"><span className="text-[10px] font-black text-slate-500 uppercase">Unrealized P/L</span><p className={`text-3xl font-black mt-2 ${intel?.portfolio.total_unrealized_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${intel?.portfolio.total_unrealized_pnl?.toLocaleString()}</p></div>
                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"><span className="text-[10px] font-black text-slate-500 uppercase">Positions</span><p className="text-3xl font-black text-white mt-2">{intel?.holdings.length || 0}</p></div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Current Holdings</h3>
                                    <div className="bg-[#0D0F14] border border-white/5 rounded-[2rem] overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead><tr className="border-b border-white/5"><th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase">Asset</th><th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase">Quantity</th><th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase text-right">Value</th></tr></thead>
                                            <tbody>
                                                {intel?.holdings.map((h: any, i: number) => (
                                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                                        <td className="px-8 py-5"><span className="text-sm font-black text-white">{h.symbol}</span></td>
                                                        <td className="px-8 py-5"><span className="text-xs font-bold text-slate-400">{h.quantity}</span></td>
                                                        <td className="px-8 py-5 text-right"><span className="text-sm font-black text-white">${h.market_value.toLocaleString()}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT PANE */}
                <div className="w-[350px] flex flex-col bg-[#0D0F14] border-l border-white/5">
                    <div className="p-8 border-b border-white/5"><h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-3"><Activity className="w-4 h-4 text-rose-500" /> Live Feed</h3></div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                        <div className="space-y-4">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Execution Audit</p>
                            <div className="space-y-3">
                                {intel?.transactions.map((tx: any, i: number) => (
                                    <div key={i} className="flex items-start gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${tx.type === 'buy' || tx.type === 'deposit' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold text-white truncate">{tx.type.toUpperCase()} {tx.symbol}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">${(tx.amount || 0).toLocaleString()}</span>
                                                <span className="text-[9px] font-bold text-slate-700">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
            `}</style>
        </div>
    );
}
