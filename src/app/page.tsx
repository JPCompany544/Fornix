"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Key,
  Database,
  Activity,
  Cpu,
  UserCheck,
  Layers,
  Play,
  RefreshCw,
  Settings,
  Puzzle,
  Code2,
  Box,
  Target,
  Compass,
  Zap,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const [amount, setAmount] = useState(143000000);
  const [displayAmount, setDisplayAmount] = useState(143000000);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      clearTimeout(loadTimer);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAmount((prev) => prev + Math.floor(Math.random() * 5000) + 1000);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (displayAmount < amount) {
      const step = Math.ceil((amount - displayAmount) / 20);
      const timer = setTimeout(() => {
        setDisplayAmount((prev) => Math.min(prev + step, amount));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [amount, displayAmount]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const navItems = [
    { label: "Dashboard", href: "/auth/login" },
    { label: "Portfolio", href: "/auth/login" },
    { label: "Analytics", href: "/auth/login" },
    { label: "Risk", href: "/auth/login" }
  ];

  const credibilityPillars = [
    {
      icon: <img src="/cube-focus.svg" alt="Architecture" className="w-5 h-5 opacity-80" />,
      title: "Execution Infrastructure",
      description: "Redundant, low-latency execution engines built for high-frequency reliability."
    },
    {
      icon: <img src="/chart-line-up.svg" alt="Risk" className="w-5 h-5 opacity-80" />,
      title: "Risk Analytics Engine",
      description: "Real-time exposure analysis with automated safeguards and drift detention."
    },
    {
      icon: <img src="/tree-structure.svg" alt="Scalability" className="w-5 h-5 opacity-80" />,
      title: "Scalable Financial System",
      description: "Audit-ready logging with dynamic scaling to handle global market volatility."
    },
    {
      icon: <img src="/terminal-window.svg" alt="Production" className="w-5 h-5 opacity-80" />,
      title: "Live Trading Infrastructure",
      description: "Battle-tested environments designed to eliminate drift and ensure execution certainty."
    }
  ];

  return (
    <div className={`h-screen w-full font-sans bg-white snap-y snap-mandatory overflow-y-scroll transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

      {/* 1. Hero Section */}
      <section
        className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#4A0E8A] via-[#1A003A] to-[#000022] text-white snap-start flex flex-col"
        style={{ fontFamily: '"Neue Montreal", "Neue Haas Grotesk Display Pro", "Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
      >
        {/* MOBILE HEADER */}
        <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between md:px-[8%] md:py-12">
            <Link href="/" className="group flex items-center gap-3">
                <img src="/MainCLogo.png" alt="Fornix Logo" className="h-12 w-12 md:h-32 md:w-32 object-contain transition-transform group-hover:scale-110" />
                <span className="md:hidden text-2xl font-black tracking-tighter uppercase">Fornix</span>
            </Link>

            {/* Hamburger Button */}
            <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            >
                <Menu className="w-6 h-6 text-white" />
            </button>

            {/* Desktop Navbar Area */}
            <nav className="hidden md:flex gap-12">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="group relative text-sm font-medium tracking-widest text-white/70 transition-colors hover:text-white"
                    >
                        {item.label}
                        <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                    </Link>
                ))}
            </nav>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] md:hidden">
                <div className="absolute inset-0 bg-[#000022]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setMobileMenuOpen(false)} />
                <div className="absolute top-0 right-0 bottom-0 w-[80%] bg-gradient-to-b from-[#4A0E8A] to-[#1A003A] p-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
                    <div className="flex justify-between items-center mb-16">
                        <span className="text-xl font-black uppercase tracking-widest">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-white/10 rounded-xl">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-8">
                        {navItems.map((item) => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                className="text-3xl font-black uppercase tracking-tighter text-white/60 hover:text-white transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto pt-10 border-t border-white/10">
                        <Link href="/auth/signup-type" className="flex items-center justify-between w-full py-6 px-8 bg-white text-[#4A0E8A] rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
                            Get Access <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        )}

        {/* Hero Content Container */}
        <main className="relative z-10 flex-1 flex flex-col md:flex-row md:items-center justify-center md:justify-between px-6 md:px-[8%] pt-20 md:pt-0 gap-16 md:gap-0">
          
          {/* Right Side Branding */}
          <div id="Right-Side-Hero" className="flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2">
            <h1
              className={`text-[80px] sm:text-[100px] md:text-[140px] font-black tracking-[-0.05em] leading-[0.8] uppercase transition-all duration-700 opacity-0 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-5'}`}
              style={{ transitionDelay: '300ms' }}
            >
              Fornix
            </h1>
            <p
              className={`mt-10 max-w-sm text-sm md:text-lg leading-relaxed text-white/80 font-medium transition-all duration-700 opacity-0 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-5'}`}
              style={{ transitionDelay: '500ms' }}
            >
              A real-time investment operating system for portfolio execution, capital tracking, and institutional-grade risk visibility.
            </p>
          </div>

          {/* Left Side Hook */}
          <div id="Left-side-hero" className="flex flex-col items-center md:items-start order-2 md:order-1">
            <Link
              href="/auth/signup-type"
              className={`group flex flex-row items-center justify-between gap-12 rounded-2xl border border-white/20 bg-white/5 px-8 py-6 backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:border-white/40 active:translate-y-0 hover:-translate-y-1 w-full md:min-w-[260px] opacity-0 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-5'}`}
              style={{ transitionDelay: '700ms' }}
            >
              <span className="text-xl font-black uppercase tracking-widest text-white">Request Access</span>
              <ArrowUpRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
            </Link>
            <div className="mt-12 text-2xl md:text-4xl font-bold leading-[1.1] tracking-tighter text-center md:text-left">
              <span
                className={`block text-white transition-all duration-700 opacity-0 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-5'}`}
                style={{ transitionDelay: '400ms' }}
              >
                Portfolio Execution Terminal
              </span>
              <span
                className={`block text-white/50 transition-all duration-700 opacity-0 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-5'}`}
                style={{ transitionDelay: '500ms' }}
              >
                Real-time Capital Visibility
              </span>
              <span
                className={`block text-white/10 transition-all duration-700 opacity-0 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-5'}`}
                style={{ transitionDelay: '600ms' }}
              >
                Institutional Risk Control
              </span>
            </div>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 z-0 flex justify-center pointer-events-none overflow-hidden">
          <img
            src="/Nebula.png"
            alt="Nebula"
            className="w-[250vw] md:w-[150vw] max-none translate-y-[60%] md:translate-y-[75%] opacity-60 md:opacity-80 mix-blend-screen transition-opacity duration-1000"
          />
        </div>

        <div
          className={`relative md:absolute bottom-12 md:bottom-[8%] left-1/2 -translate-x-1/2 z-10 flex flex-col md:flex-row items-center gap-2 md:gap-4 transition-all duration-700 opacity-0 ${isLoaded ? 'opacity-100 translate-y-0' : 'translate-y-5'}`}
          style={{ transitionDelay: '900ms' }}
        >
          <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 whitespace-nowrap">
            Live Platform Volume
          </div>
          <div className="text-3xl md:text-4xl font-black tracking-tighter text-white tabular-nums">
            {formatCurrency(displayAmount)}+
          </div>
        </div>
      </section>

      {/* 2. Proof-of-Seriousness Section */}
      <section className="min-h-screen w-full flex items-center justify-center bg-white px-6 md:px-16 py-20 md:py-0 relative z-20 overflow-hidden snap-start group data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src="/circle-scatter-haikei.svg" alt="Background" className="w-full h-full object-cover opacity-50" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-16 md:gap-24">
          <div className="text-center lg:text-left lg:w-[45%]">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-[-0.05em] leading-[0.9] mb-10">
              Built for institutional <br /> capital execution. <br />
              <span className="text-slate-300">Designed for <br /> portfolio control.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              A portfolio system engineered for execution accuracy, real-time pricing, and institutional-grade financial visibility.
            </p>
          </div>

          <div className="w-full lg:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {credibilityPillars.map((pillar, index) => (
              <div key={index} className="flex flex-col items-start space-y-4 group p-8 rounded-[2.5rem] bg-slate-50/50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:bg-slate-900 group-hover:border-slate-900 transition-all">
                  <div className="group-hover:invert transition-all">{pillar.icon}</div>
                </div>
                <h3 className="text-lg font-black text-slate-950 tracking-tight leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-bold uppercase tracking-wider text-[10px]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Who This Is Built For Section */}
      <section className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-6 md:px-16 py-20 md:py-0 relative z-20 overflow-hidden snap-start group data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src="/layered-waves-haikei.svg" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="mb-16 text-center md:text-left">
            <span className="inline-block text-[10px] font-black tracking-[0.4em] text-[#4A0E8A] uppercase mb-4 px-4 py-1.5 bg-[#4A0E8A]/5 rounded-full">
              User Segments
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-[-0.05em] leading-[0.9] mb-6">
              Built for investors, <br />
              <span className="text-slate-300">portfolio managers.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
            {[
              { title: "Analysts", desc: "Institutional tooling without the overhead." },
              { title: "Fund Managers", desc: "Unified engine for diverse vertical strategies." },
              { title: "Private Capital Teams", desc: "Transparency and secure governance by default." },
              { title: "Investment Groups", desc: "Automated tracking, reporting, and attribution." },
              { title: "Financial Builders", desc: "Battle-tested financial backbone for your app." },
              { title: "Active Traders", desc: "Execution stability for high-frequency desks." }
            ].map((segment, index) => (
              <div key={index} className="space-y-4 group">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
                  {segment.title}
                </h3>
                <div className="h-1 w-12 bg-slate-200 group-hover:bg-[#4A0E8A] transition-all" />
                <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                  {segment.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Architecture & Trust Layer Section */}
      <section className="min-h-screen w-full flex items-center justify-center bg-white px-6 md:px-16 py-20 md:py-0 relative z-20 overflow-hidden snap-start group data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src="/blob-haikei.svg" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col space-y-8 text-center lg:text-left">
            <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.9] text-slate-900">
              Security & <br /> Execution Infrastructure
            </h2>
            <p className="text-xl text-slate-400 font-bold tracking-tight">
              Built with modern financial system standards for secure execution, auditability, and data integrity.
            </p>
          </div>
          <div className="flex flex-col space-y-6">
            {[
              { 
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor:'#6366f1', stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor:'#4338ca', stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="url(#grad1)" opacity="0.2" />
                        <path d="M12 22s8-4.5 8-10V7l-8-5-8 5v5c0 5.5 8 10 8 10z" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 12l2 2 4-4" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ), 
                title: "Secure execution layer", 
                desc: "Everything designed to minimize risk",
                glow: "bg-indigo-500/10",
                border: "border-indigo-100/50"
              },
              { 
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                        <defs>
                            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor:'#f59e0b', stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor:'#d97706', stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        <circle cx="12" cy="12" r="9" stroke="url(#grad2)" strokeWidth="2" strokeDasharray="4 4" />
                        <circle cx="12" cy="12" r="5" fill="url(#grad2)" opacity="0.2" />
                        <path d="M12 8v8M8 12h8" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                ), 
                title: "Authentication system", 
                desc: "State-of-the-art identity handling",
                glow: "bg-amber-500/10",
                border: "border-amber-100/50"
              },
              { 
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                        <defs>
                            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor:'#10b981', stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor:'#059669', stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        <rect x="3" y="3" width="7" height="7" rx="1" stroke="url(#grad3)" strokeWidth="2" fill="url(#grad3)" opacity="0.1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" stroke="url(#grad3)" strokeWidth="2" />
                        <rect x="3" y="14" width="7" height="7" rx="1" stroke="url(#grad3)" strokeWidth="2" />
                        <rect x="14" y="14" width="7" height="7" rx="1" stroke="url(#grad3)" strokeWidth="2" fill="url(#grad3)" opacity="0.1" />
                        <path d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" stroke="url(#grad3)" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                ), 
                title: "Ledger integrity", 
                desc: "Proper separation of user data",
                glow: "bg-emerald-500/10",
                border: "border-emerald-100/50"
              },
              { 
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                        <defs>
                            <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor:'#f43f5e', stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor:'#e11d48', stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        <path d="M4 20l4-4 4 4 8-8" stroke="url(#grad4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 4v4m-4-2h8" stroke="url(#grad4)" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                        <circle cx="20" cy="12" r="2" fill="url(#grad4)" />
                        <circle cx="4" cy="20" r="2" fill="url(#grad4)" />
                    </svg>
                ), 
                title: "Scalable financial backend", 
                desc: "System grows without bottlenecks",
                glow: "bg-rose-500/10",
                border: "border-rose-100/50"
              }
            ].map((point, i) => (
              <div key={i} className="flex items-center space-x-6 p-6 md:p-8 rounded-[2.5rem] bg-white border border-slate-100/40 hover:border-slate-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all group cursor-default">
                <div className={`relative p-5 rounded-[1.5rem] ${point.glow} border ${point.border} group-hover:scale-110 transition-all duration-700 shadow-sm`}>
                  <div className="relative z-10">{point.icon}</div>
                  <div className={`absolute inset-0 blur-2xl opacity-20 ${point.glow} rounded-full -z-10 group-hover:opacity-40 transition-opacity`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-slate-950">{point.title}</span>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">— {point.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Workflow Section */}
      <section className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-6 md:px-16 py-20 md:py-0 relative z-20 overflow-hidden snap-start group data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src="/wave-haikei2.svg" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.9] mb-16 uppercase text-slate-900">
            Institutional <br /> Financial Infrastructure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { icon: <UserCheck />, title: "Onboarding", step: "01" },
              { icon: <Layers />, title: "Setup", step: "02" },
              { icon: <Activity />, title: "Monitoring", step: "03" },
              { icon: <Play />, title: "Execution", step: "04" },
              { icon: <RefreshCw />, title: "Optimize", step: "05" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                    {React.cloneElement(item.icon as React.ReactElement, { className: "w-8 h-8" })}
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center border-4 border-slate-50">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Customization Section */}
      <section className="min-h-screen w-full flex items-center justify-center bg-white px-6 md:px-16 py-20 md:py-0 relative z-20 overflow-hidden snap-start group data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src="/wave-haikei3.svg" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { icon: <Settings />, title: "Strategy Engine", desc: "Custom investment logic." },
              { icon: <Puzzle />, title: "Modular Architecture", desc: "Plug-and-play expansion." },
              { icon: <Code2 />, title: "API Integrations", desc: "Automate complex ops." },
              { icon: <Box />, title: "Deployment Ready", desc: "Internal deployment." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all">
                <div className="mb-4 text-slate-400">{React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6" })}</div>
                <h4 className="text-lg font-black text-slate-950 mb-1">{item.title}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-[-0.05em] leading-[0.9] mb-8">
              System <br /> Extensibility
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-md mx-auto lg:mx-0">
              Designed for modular expansion, internal deployment, and integration with external financial systems.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Vision / Philosophy Section */}
      <section className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-6 md:px-16 py-20 md:py-0 relative z-20 overflow-hidden snap-start group data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16 md:gap-24">
          <div className="text-center lg:text-left lg:w-[45%]">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-[-0.05em] leading-[0.9] mb-10">
              Real-time <br /> Execution System
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mx-auto lg:mx-0 border-l-4 border-[#4A0E8A]/20 pl-6">
              Most investment platforms fail because they prioritize features over operators. We invert the paradigm to focus on human-centered infrastructure.
            </p>
          </div>
          <div className="w-full lg:w-[50%] flex flex-col space-y-10">
            {[
              { icon: <Target />, title: "Audit-ready Ledger", desc: "Ensuring every transaction is traceable and secure." },
              { icon: <Compass />, title: "Portfolio Operations", desc: "Secure management of diverse asset classes." },
              { icon: <Zap />, title: "Production Architecture", desc: "Built for today’s technology, not legacy assumptions." }
            ].map((point, index) => (
              <div key={index} className="flex items-start gap-6 group">
                <div className="mt-1 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:border-[#4A0E8A]/20 transition-all">
                  {React.cloneElement(point.icon as React.ReactElement, { className: "w-6 h-6 text-[#4A0E8A]" })}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{point.title}</h3>
                  <p className="mt-2 text-sm md:text-base text-slate-500 font-bold uppercase tracking-widest text-[10px]">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Invitation / CTA Section */}
      <section className="min-h-screen w-full flex items-center justify-center bg-[#000022] px-6 md:px-16 py-20 relative z-20 overflow-hidden snap-start group data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[60vh] bg-[#4A0E8A]/30 blur-[150px] rounded-full z-0 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
          <h2 className="text-6xl md:text-8xl font-black tracking-[-0.06em] leading-[0.85] mb-12 uppercase">
            Get <br /> Access.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth/signup-type" className="w-full sm:w-auto flex items-center justify-center gap-4 bg-white text-[#000022] px-12 py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all hover:bg-white/90 active:scale-95 shadow-2xl">
              Request Access <ArrowRight className="w-6 h-6" />
            </Link>
            <Link href="/auth/Login" className="w-full sm:w-auto text-white/50 hover:text-white px-12 py-6 text-lg font-black uppercase tracking-widest transition-colors border border-white/10 hover:border-white/20 rounded-2xl">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer className="w-full bg-[#000022] border-t border-white/5 px-6 md:px-16 py-16 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left space-y-4">
            <span className="text-2xl font-black tracking-tighter text-white italic uppercase">
              FORNIX
            </span>
            <p className="text-xs text-white/30 font-black uppercase tracking-[0.3em] max-w-sm">
              Institutional Portfolio Execution System • 2026 <br />
              Built for capital operators and financial engineers
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-8">
                {navItems.map(item => (
                    <Link key={item.label} href={item.href} className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                        {item.label}
                    </Link>
                ))}
            </div>
            <div className="flex items-center gap-6">
                <Link href="/auth/signup-type" className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest border-b border-white/10">Discuss Integration</Link>
                <Link href="/auth/Login" className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest border-b border-white/10">Sign In</Link>
            </div>
            <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">
              © 2026 FORNIX. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
