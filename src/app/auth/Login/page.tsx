"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { createClientClient } from "@/lib/supabaseClient";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClientClient();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Force background and lock scrolling
        const originalBodyBg = document.body.style.backgroundColor;
        const originalHtmlBg = document.documentElement.style.backgroundColor;

        document.body.style.backgroundColor = "#ffffff";
        document.documentElement.style.backgroundColor = "#ffffff";

        return () => {
            document.body.style.backgroundColor = originalBodyBg;
            document.documentElement.style.backgroundColor = originalHtmlBg;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            // Successful login — redirect handled by AuthProvider listener or manually
            router.push("/Dashboard/Live");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Invalid credentials or system error.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full bg-white text-slate-900 flex flex-col items-center justify-center font-sans overflow-hidden">

            {/* Background SVG */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <img
                    src="/wave-haikei4.svg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            {/* Header / Brand */}
            <div className="absolute top-6 left-8 flex items-center gap-4 z-20">
                <Link href="/" className="group relative flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-semibold uppercase tracking-[0.15em]">Back</span>
                    <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-slate-900 transition-all duration-300 group-hover:w-full" />
                </Link>
            </div>

            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-[#F8FAFC] border border-slate-200/60 p-8 rounded-[2.5rem] shadow-2xl">

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black tracking-tighter mb-1 italic text-slate-900">
                            Fornix
                        </h1>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                            Secure Access for Serious Operators
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-rose-600 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-[#4A0E8A] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="operator@fornix.os"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#4A0E8A] transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                                    Password
                                </label>
                                <Link href="#" className="text-[9px] uppercase tracking-widest font-bold text-[#4A0E8A] hover:text-[#5A1E9A] transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-[#4A0E8A] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#4A0E8A] transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold tracking-tight text-base shadow-sm hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-8">
                        <p className="text-xs text-slate-500 font-medium tracking-tight">
                            Don't have an account?{" "}
                            <Link href="/auth/signup-type" className="text-slate-900 font-bold hover:underline transition-all">
                                Request Access
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Footnote */}
                <div className="mt-8 flex items-center justify-center gap-2 opacity-40 group hover:opacity-100 transition-opacity duration-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-900">
                        All data encrypted • Institutional-grade security
                    </span>
                </div>
            </div>
        </div>
    );
}
