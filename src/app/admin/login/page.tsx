"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientClient } from '@/lib/supabaseClient';
import { ShieldAlert, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const supabase = createClientClient();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign in with Supabase auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw new Error('Invalid credentials.');
            if (!authData.user) throw new Error('Authentication failed.');

            // 2. Verify admin flag on the profiles table
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', authData.user.id)
                .single();

            if (profileError || !profile?.is_admin) {
                // Sign out immediately — not an admin
                await supabase.auth.signOut();
                throw new Error('Access denied. This account does not have administrative privileges.');
            }

            // 3. Admin verified — enter the command center
            router.replace('/admin');

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            {/* Grid background */}
            <div
                className="fixed inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="w-full max-w-md relative z-10">
                {/* Lock icon */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldAlert className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight text-center">Command Center</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 text-center uppercase tracking-widest">
                        Fornix Institutional Admin
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@fornix.io"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pr-12 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                            <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                            <p className="text-xs font-bold text-rose-400">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="w-full py-4 rounded-xl bg-emerald-500 text-slate-950 font-black uppercase tracking-[0.2em] text-sm hover:bg-emerald-400 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Verifying Clearance...
                            </>
                        ) : (
                            'Enter Command Center'
                        )}
                    </button>
                </form>

                <p className="text-center text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-8">
                    Unauthorized access attempts are logged.
                </p>
            </div>
        </div>
    );
}
