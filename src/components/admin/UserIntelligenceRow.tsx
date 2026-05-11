
"use client";

import React from 'react';
import { User, Activity, Clock } from 'lucide-react';

interface UserIntelligenceRowProps {
    user: {
        id: string;
        email: string;
        full_name?: string;
        created_at: string;
        updated_at?: string;
    };
    isSelected: boolean;
    onClick: () => void;
}

export const UserIntelligenceRow: React.FC<UserIntelligenceRowProps> = ({ user, isSelected, onClick }) => {
    // Random activity for mock visual (Phase 3 Requirement)
    const isRecentlyActive = Math.random() > 0.5;

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 text-left border-b border-white/5 transition-all group relative ${isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.01]'}`}
        >
            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" />}
            
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <User className={`w-3 h-3 ${isSelected ? 'text-rose-500' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest">
                        {user.id.slice(0, 8)}
                    </span>
                </div>
                {isRecentlyActive && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Active</span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                    {user.email}
                </p>
                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <Clock className="w-3 h-3 opacity-50" />
                    <span>Last Activity {new Date(user.updated_at || user.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </button>
    );
};
