"use client";

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { usePortfolioState } from '@/hooks/usePortfolioState';
import { usePortfolioInsights } from '@/hooks/usePortfolioInsights';

// ── Finor UI components (layout unchanged) ──────────────────
import TopGainers from '@/components/dashboard/finor/TopGainers';
import PortfolioValue from '@/components/dashboard/finor/PortfolioValue';
import TotalProfits from '@/components/dashboard/finor/TotalProfits';
import PortfolioDistribution from '@/components/dashboard/finor/PortfolioDistribution';
import MyAssets from '@/components/dashboard/finor/MyAssets';
import MarketInsight from '@/components/dashboard/finor/MarketInsight';
import InsightsPanel from '@/components/dashboard/insights/InsightsPanel';

// ─────────────────────────────────────────────────────────────
// LiveDashboardPage
// Institutional Investment Hub
// ─────────────────────────────────────────────────────────────
export default function LiveDashboardPage() {
    const { user } = useAuth();
    
    // ── Unified Financial State ──────────────────────────────
    const { 
        portfolio, 
        holdings, 
        transactions,
        depositRequests, 
        totalPnL, 
        totalRealizedPnL,
        totalDailyMovement,
        loading 
    } = usePortfolioState(user?.id);

    // ── Portfolio Intelligence ───────────────────────────────
    const insights = usePortfolioInsights(portfolio, holdings, transactions);

    // ── Render ───────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#f8fbff] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hydrating Financial Core...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20 w-full overflow-x-hidden">
            <div className="flex flex-col">
                <main className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto px-4 md:px-8 py-4 gap-4">
                    <InsightsPanel insights={insights} />
                    <TopGainers portfolioId={portfolio?.id} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Summary Metrics */}
                        <div className="lg:col-span-1 space-y-4">
                           <TotalProfits 
                               unrealizedPnL={totalPnL} 
                               realizedPnL={totalRealizedPnL} 
                               dailyMovement={totalDailyMovement} 
                           />
                        </div>
                        
                        {/* Main Portfolio Chart */}
                        <div className="lg:col-span-2">
                            <PortfolioValue amount={portfolio?.total_value ?? 0} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Below the Fold */}
            <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 py-10 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                        <PortfolioDistribution holdings={holdings} totalValue={portfolio?.total_value ?? 0} />
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                        <MyAssets holdings={holdings} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-3">
                        <MarketInsight transactions={transactions} depositRequests={depositRequests} />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
            `}</style>
        </div>
    );
}
