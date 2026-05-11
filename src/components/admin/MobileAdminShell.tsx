"use client";

import React, { useState } from 'react';
import { 
    Menu, X, Users, PieChart, Zap, 
    ArrowDownLeft, ArrowUpRight, History, 
    LayoutGrid, ShieldCheck, LogOut
} from 'lucide-react';
import Link from 'next/link';

interface MobileAdminShellProps {
    activeView: string;
    onViewChange: (view: string) => void;
    children: React.ReactNode;
}

export const MobileAdminShell: React.FC<MobileAdminShellProps> = ({ 
    activeView, 
    onViewChange, 
    children 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
        { id: 'profile', label: 'User 360', icon: PieChart, href: '/admin/users' },
        { id: 'activity', label: 'Activity Feed', icon: Zap, href: '/admin/users' },
        { id: 'funding', label: 'Funding Queue', icon: ArrowDownLeft, href: '/admin?tab=funding' },
        { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpRight, href: '/admin?tab=withdrawals' },
        { id: 'audit', label: 'Audit Logs', icon: History, href: '/admin?tab=audit' },
    ];

    const handleNavClick = (id: string, href: string) => {
        onViewChange(id);
        setIsOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#08090D] flex flex-col overflow-x-hidden max-w-full">
            
            {/* ☰ TOP BAR (FIXED) */}
            <header className="fixed top-0 left-0 right-0 z-[100] h-16 bg-[#0D0F14]/95 backdrop-blur-xl border-b border-white/5 px-4 flex items-center justify-between">
                <button 
                    onClick={() => setIsOpen(true)}
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl active:scale-95 transition-all"
                >
                    <Menu className="w-6 h-6 text-white" />
                </button>
                
                <h1 className="text-sm font-black text-white uppercase tracking-tighter">Admin Panel</h1>
                
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active</span>
                </div>
            </header>

            {/* ☰ HAMBURGER MENU (DRAWER) */}
            <div className={`fixed inset-0 z-[200] transition-all duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                {/* Overlay Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    onClick={() => setIsOpen(false)}
                />
                
                {/* Sidebar Content */}
                <div className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-[300px] bg-[#0D0F14] border-r border-white/10 flex flex-col transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <ShieldCheck className="w-5 h-5 text-slate-950" />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-tighter">Fornix OS</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2"><X className="w-5 h-5 text-slate-500" /></button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 py-6 space-y-1">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 mb-4">Command Center</p>
                        {navItems.map((item) => (
                            <Link 
                                key={item.id}
                                href={item.href}
                                onClick={() => handleNavClick(item.id, item.href)}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeView === item.id ? 'bg-rose-500/10 text-rose-500' : 'text-slate-500 active:bg-white/5'}`}
                            >
                                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-rose-500' : ''}`} />
                                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-6 border-t border-white/5">
                        <button className="flex items-center gap-4 text-slate-700 p-4">
                            <LogOut className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 📱 ACTIVE VIEW CONTAINER */}
            <main className="flex-1 mt-16 overflow-x-hidden max-w-full">
                {children}
            </main>
        </div>
    );
};
