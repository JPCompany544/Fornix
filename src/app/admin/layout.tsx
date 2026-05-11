"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { createClientClient } from '@/lib/supabaseClient';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClientClient();
    
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) return;
        if (authLoading) return;

        if (!user) {
            router.replace('/admin/login');
            return;
        }

        const checkAdminStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single();

                if (error || !data?.is_admin) {
                    setIsAdmin(false);
                    if (!isLoginPage) router.replace('/admin/login');
                } else {
                    setIsAdmin(true);
                }
            } catch {
                setIsAdmin(false);
                router.replace('/admin/login');
            }
        };

        checkAdminStatus();
    }, [user, authLoading, pathname, isLoginPage, router, supabase]);

    if (isLoginPage) return <>{children}</>;

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Verifying Clearance...</span>
            </div>
        );
    }

    if (isAdmin === false) {
        return (
            <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center text-white p-6 text-center">
                <ShieldAlert className="w-16 h-16 text-rose-500 mb-6" />
                <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Access Denied</h1>
                <p className="text-slate-400 max-w-md mx-auto mb-10 text-sm">This zone requires institutional administrative clearance.</p>
                <Link href="/admin/login" className="flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Admin Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#08090D] text-slate-50 font-sans selection:bg-rose-500 selection:text-white">
            {children}
        </div>
    );
}
