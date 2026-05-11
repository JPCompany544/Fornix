import { useMemo } from 'react';
import { Holding, Transaction, Portfolio } from '@/hooks/usePortfolioState';

export type InsightType = 'concentration' | 'performance' | 'allocation' | 'activity';
export type InsightSeverity = 'info' | 'warning' | 'critical';

export interface Insight {
    id: string;
    type: InsightType;
    severity: InsightSeverity;
    message: string;
    value?: number;
}

export function usePortfolioInsights(
    portfolio: Portfolio | null, 
    holdings: Holding[], 
    transactions: Transaction[]
): Insight[] {
    
    return useMemo(() => {
        if (!portfolio || holdings.length === 0) return [];

        const insights: Insight[] = [];
        const totalValue = portfolio.total_value;

        // ==========================================
        // 1. CONCENTRATION & ALLOCATION INTELLIGENCE
        // ==========================================
        let highestConcentration = 0;
        let highestConcentrationSymbol = '';

        holdings.forEach(holding => {
            if (totalValue <= 0) return;
            
            const allocationPercent = (holding.position_value / totalValue) * 100;

            if (allocationPercent > highestConcentration) {
                highestConcentration = allocationPercent;
                highestConcentrationSymbol = holding.symbol;
            }

            // Concentration Thresholds (Default limit: 25%)
            if (allocationPercent >= 40) {
                insights.push({
                    id: `conc_crit_${holding.symbol}`,
                    type: 'concentration',
                    severity: 'critical',
                    message: `${holding.symbol} represents ${allocationPercent.toFixed(1)}% of your portfolio risk.`,
                    value: allocationPercent
                });
            } else if (allocationPercent >= 25) {
                insights.push({
                    id: `conc_warn_${holding.symbol}`,
                    type: 'concentration',
                    severity: 'warning',
                    message: `${holding.symbol} exceeds target allocation threshold (${allocationPercent.toFixed(1)}%).`,
                    value: allocationPercent
                });
            }
        });

        // ==========================================
        // 2. PERFORMANCE INTELLIGENCE
        // ==========================================
        if (holdings.length > 0) {
            // Sort by daily movement (absolute dollar contribution)
            const sortedByDaily = [...holdings].sort((a, b) => b.daily_movement - a.daily_movement);
            const topContributor = sortedByDaily[0];
            const bottomContributor = sortedByDaily[sortedByDaily.length - 1];

            if (topContributor && topContributor.daily_movement > 0) {
                insights.push({
                    id: `perf_top_${topContributor.symbol}`,
                    type: 'performance',
                    severity: 'info',
                    message: `${topContributor.symbol} is your top performing asset today.`,
                    value: topContributor.daily_movement
                });
            }

            if (bottomContributor && bottomContributor.daily_movement < 0) {
                insights.push({
                    id: `perf_bot_${bottomContributor.symbol}`,
                    type: 'performance',
                    severity: 'warning',
                    message: `${bottomContributor.symbol} is dragging portfolio performance today.`,
                    value: bottomContributor.daily_movement
                });
            }
        }

        // ==========================================
        // 3. ACTIVITY INTELLIGENCE
        // ==========================================
        if (transactions.length > 0) {
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            const recentTransactions = transactions.filter(tx => new Date(tx.created_at) >= oneWeekAgo);
            const recentTrades = recentTransactions.filter(tx => tx.type === 'buy' || tx.type === 'sell');

            if (recentTrades.length >= 10) {
                insights.push({
                    id: 'act_freq_high',
                    type: 'activity',
                    severity: 'info',
                    message: `High velocity: You executed ${recentTrades.length} trades this week.`,
                    value: recentTrades.length
                });
            } else if (recentTrades.length > 0) {
                insights.push({
                    id: 'act_freq_norm',
                    type: 'activity',
                    severity: 'info',
                    message: `You executed ${recentTrades.length} trades this week.`,
                    value: recentTrades.length
                });
            }
        }

        // ==========================================
        // 4. INTELLIGENCE FILTERING ENGINE
        // ==========================================
        
        // Priority Score mapping
        const priorityScore: Record<InsightSeverity, number> = {
            'critical': 3,
            'warning': 2,
            'info': 1
        };

        // Deduplicate and Sort
        const uniqueInsights = Array.from(new Map(insights.map(item => [item.id, item])).values());
        
        const sortedInsights = uniqueInsights.sort((a, b) => {
            return priorityScore[b.severity] - priorityScore[a.severity];
        });

        // Max 5 insights
        return sortedInsights.slice(0, 5);
        
    }, [portfolio, holdings, transactions]);
}
