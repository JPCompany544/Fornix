"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupTypePage() {
    const router = useRouter();

    useEffect(() => {
        // Force scroll capability on mount
        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
        };
    }, []);

    const handleSelection = (type: 'individual' | 'operator') => {
        localStorage.setItem('signup_type', type);
        router.push(`/auth/register?type=${type}`);
    };

    return (
        <div className="relative min-h-screen w-full bg-white text-slate-900 flex flex-col items-center overflow-x-hidden overflow-y-auto font-sans">

            {/* Background SVG - Fixed and non-interfering */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <img
                    src="/wave-haikei4.svg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-30 md:opacity-50"
                />
            </div>

            {/* Header/Navigation Bar */}
            <div className="relative z-20 w-full max-w-[1200px] px-6 py-6 flex items-center justify-between">
                <Link href="/" className="group relative flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em]">Back</span>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Step 01</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-[800px] px-6 py-8 md:py-20 flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-black tracking-[-0.05em] mb-4 text-slate-950 leading-[0.95]">
                        Select Your <br className="md:hidden" /> Profile Type
                    </h1>
                    <p className="text-sm md:text-lg text-slate-500 font-bold uppercase tracking-widest text-[11px] md:text-[13px]">
                        Configure your Fornix environment
                    </p>
                </div>

                {/* Selection Cards */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                    {/* Individual Card */}
                    <div className="group relative bg-white border border-slate-100 hover:border-slate-900 rounded-[2.5rem] p-6 md:p-10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black tracking-tighter text-slate-950">
                                Individual
                            </h2>
                        </div>

                        <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-8 font-medium">
                            For independent professionals managing their own capital or research.
                        </p>

                        <ul className="space-y-4 mb-10 flex-1">
                            {['Personal workspace', 'Single-user access', 'Direct execution'].map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-[10px] md:text-[12px] text-slate-400 font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-900 transition-colors" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSelection('individual')}
                            className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl"
                        >
                            Select Individual
                        </button>
                    </div>

                    {/* Operator Card */}
                    <div className="group relative bg-white border border-slate-100 hover:border-slate-900 rounded-[2.5rem] p-6 md:p-10 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black tracking-tighter text-slate-950">
                                Operator
                            </h2>
                        </div>

                        <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-8 font-medium">
                            For those operating on behalf of others or managing structured capital.
                        </p>

                        <ul className="space-y-4 mb-10 flex-1">
                            {['Multi-user environments', 'Role-based access', 'Audit-ready logging'].map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-[10px] md:text-[12px] text-slate-400 font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-900 transition-colors" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSelection('operator')}
                            className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl"
                        >
                            Select Operator
                        </button>
                    </div>

                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-300 font-black">
                        Configuration can be modified post-onboarding
                    </p>
                </div>

            </div>
        </div>
    );
}
