"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Bell, Settings, LogOut, Plus, Menu, X, 
    LayoutGrid, BarChart3, Briefcase, Activity, 
    ArrowUpRight, ShieldCheck, User 
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { usePortfolioState } from '@/hooks/usePortfolioState';
import DepositModal from '@/components/dashboard/DepositModal';
import WithdrawalModal from '@/components/dashboard/WithdrawalModal';

const FinorHeader = () => {
    const { user, signOut } = useAuth();
    const { 
        portfolio, 
        availableToWithdraw, 
        pendingWithdrawalsTotal,
        syncError,
        loading,
        refresh: refreshPortfolio
    } = usePortfolioState(user?.id);
    const pathname = usePathname();
    const [depositOpen, setDepositOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Operator';
    const emailSuffix = user?.email ? `@${user.email.split('@')[1].charAt(0).toUpperCase()}` : '';

    const navItems = [
        { label: 'Dashboard', href: '/Dashboard/Live', icon: LayoutGrid },
        { label: 'Market', href: '/Dashboard/Market', icon: BarChart3 },
        { label: 'Investment', href: '/Dashboard/Investment', icon: Briefcase },
        { label: 'Activity', href: '/Dashboard/Activity', icon: Activity },
        { label: 'Withdraw', href: '/Dashboard/Withdraw', icon: ArrowUpRight, isModal: true },
    ];

    const isActive = (href: string) => pathname === href || (href === '/Dashboard/Live' && pathname === '/Dashboard/Live');

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-[#f8fbff]/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center justify-between">
                
                {/* LEFT: Hamburger & Brand */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
                    >
                        <Menu className="w-5 h-5 text-slate-900" />
                    </button>

                    <Link href="/Dashboard/Live" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-slate-950 uppercase tracking-tighter hidden sm:block">Fornix</span>
                    </Link>
                </div>

                {/* CENTER: Desktop Nav */}
                <nav className="hidden lg:flex items-center bg-white p-1.5 rounded-full border border-slate-100 shadow-sm">
                    {navItems.map((item) => (
                        item.isModal ? (
                            <button
                                key={item.label}
                                onClick={() => setWithdrawOpen(true)}
                                className={`text-[12px] font-bold px-5 py-2 rounded-full transition-all ${isActive(item.href) ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {item.label}
                            </button>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-[12px] font-bold px-5 py-2 rounded-full transition-all ${isActive(item.href) ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {item.label}
                            </Link>
                        )
                    ))}
                </nav>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDepositOpen(true)}
                        disabled={loading || !portfolio?.id}
                        className={`flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                            loading || !portfolio?.id 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                            : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/10'
                        }`}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden xs:block">{loading ? 'Syncing...' : 'Deposit'}</span>
                    </button>

                    <div className="flex items-center pl-3 border-l border-slate-200">
                        <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 p-0.5 shadow-sm overflow-hidden flex-shrink-0">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                        <div className="hidden md:flex flex-col text-left ml-3 pr-2">
                            <span className="text-sm font-bold text-slate-900 leading-none mb-1">{displayName}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Institutional {emailSuffix}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE HAMBURGER DRAWER */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    
                    {/* Drawer Content */}
                    <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-black text-slate-950 uppercase tracking-tighter">Fornix OS</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex-1 p-8 space-y-3 overflow-y-auto">
                            {navItems.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <button
                                        key={item.label}
                                        disabled={loading && item.isModal}
                                        onClick={() => {
                                            if (item.isModal) {
                                                setWithdrawOpen(true);
                                            } else {
                                                window.location.href = item.href;
                                            }
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] transition-all group ${
                                            active ? 'bg-slate-950 text-white shadow-xl shadow-slate-900/20' : 
                                            (loading && item.isModal) ? 'opacity-50 cursor-not-allowed text-slate-300' :
                                            'hover:bg-slate-50 text-slate-500 hover:text-slate-950'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${active ? 'bg-white/10 border-white/20' : 'bg-white border-slate-100 shadow-sm group-hover:border-slate-300'}`}>
                                            {loading && item.isModal ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />}
                                        </div>
                                        <span className="text-[13px] font-black uppercase tracking-widest">
                                            {loading && item.isModal ? 'Syncing...' : item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-4">
                            <div className="flex items-center gap-4 p-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-0.5 shadow-sm overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-950">{displayName}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Hub</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <DepositModal 
                isOpen={depositOpen} 
                onClose={() => setDepositOpen(false)} 
                portfolioId={portfolio?.id}
                userId={user?.id}
                syncError={syncError}
                onRefresh={refreshPortfolio}
            />
            <WithdrawalModal 
                isOpen={withdrawOpen} 
                onClose={() => setWithdrawOpen(false)} 
                userId={user?.id}
                portfolioId={portfolio?.id}
                availableToWithdraw={availableToWithdraw}
                pendingWithdrawalsTotal={pendingWithdrawalsTotal}
                syncError={syncError}
                onRefresh={refreshPortfolio}
            />
        </>
    );
};

export default FinorHeader;
