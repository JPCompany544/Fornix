"use client";

import React from 'react';
import Link from 'next/link';
import { Zap, BarChart2 } from 'lucide-react';

interface TopGainersProps {
    portfolioId?: string;
}

const TopGainers: React.FC<TopGainersProps> = ({ portfolioId }) => {

    const gainers = [
        { name: 'Apple', symbol: 'AAPL', image: '/AppleLogo.svg', price: 182.63, change: '+1.24%' },
        { name: 'AirBnb', symbol: 'ABNB', image: '/AirBnbIcon.jpeg', price: 144.12, change: '+2.45%' },
        { name: 'Nvidia', symbol: 'NVDA', image: '/NvidiaSymbol.svg', price: 726.13, change: '+4.02%' },
        { name: 'Spotify', symbol: 'SPOT', image: '/spotifySymbol.svg', price: 231.18, change: '+1.88%' },
        { name: 'Tesla', symbol: 'TSLA', image: '/TeslaSymbol.svg', price: 193.57, change: '-0.42%' },
        { name: 'Amazon', symbol: 'AMZN', image: '/Amasonlogo.jpg', price: 174.45, change: '+0.95%' },
    ];

    const infiniteGainers = [...gainers, ...gainers, ...gainers];

    return (
        <div className="relative flex items-center bg-white h-16 md:h-20 rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
            {/* Label - Collapses on Mobile */}
            <div className="absolute left-0 z-20 bg-white h-full flex items-center px-4 md:px-8 border-r border-slate-50">
                <BarChart2 className="w-4 h-4 text-slate-900 md:hidden" />
                <span className="hidden md:block text-sm font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Market Hub</span>
            </div>

            {/* Scrolling Track - Responsive Offset */}
            <div className="flex items-center animate-scroll-slow hover:[animation-play-state:paused] whitespace-nowrap pl-[60px] md:pl-[180px]">
                {infiniteGainers.map((gainer, i) => (
                    <div key={i} className="flex items-center shrink-0">
                        <Link 
                            href={`/Dashboard/Market/${gainer.symbol}`}
                            className="flex items-center space-x-3 md:space-x-4 px-6 md:px-10 group/item transition-opacity hover:opacity-80"
                        >
                            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-100 overflow-hidden p-1.5 md:p-2 group-hover/item:scale-110 transition-transform">
                                <img src={gainer.image} alt={gainer.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col text-left">
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <span className="text-[11px] md:text-[13px] font-black text-slate-950 uppercase tracking-tight leading-none">{gainer.symbol}</span>
                                    <span className={`text-[9px] md:text-[11px] font-black ${gainer.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {gainer.change}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 mt-0.5">
                                    <span className="text-[10px] md:text-[12px] text-slate-400 font-bold tracking-tight">${gainer.price}</span>
                                </div>
                            </div>
                        </Link>
                        <div className="h-4 w-[1px] bg-slate-100" />
                    </div>
                ))}
            </div>

            {/* Floating Action Hint */}
            <div className="absolute right-4 z-20 hidden lg:group-hover:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-right-4">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Market Analysis</span>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-scroll-slow {
                    animation: scroll 40s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default TopGainers;
