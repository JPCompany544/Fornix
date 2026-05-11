import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useMarketData } from '@/context/MarketProvider';

export interface Holding {
  id: string;
  portfolio_id: string;
  symbol: string;
  quantity: number;
  avg_cost: number;
  current_price?: number;
  position_value: number;
  pnl: number;
  pnl_percent: number;
  daily_movement: number;
  isHydrating: boolean;
}

export interface Transaction {
  id: string;
  portfolio_id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  quantity: number;
  price: number;
  total: number;
  cost_basis?: number;
  realized_pnl?: number;
  created_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  cash_balance: number;
  total_value: number;
}

export function usePortfolioState(userId: string | undefined) {
  const { supabase } = useAuth();
  const { prices, subscribeToSymbol } = useMarketData();
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [rawHoldings, setRawHoldings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositRequests, setDepositRequests] = useState<any[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(false);

  const fetchTimeout = useRef<NodeJS.Timeout | null>(null);

  const performFetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setSyncError(false);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      const { data: pPortfolios, error: pError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId);

      if (!pError && pPortfolios && pPortfolios.length > 0) {
        const pData = pPortfolios[0];

        setPortfolio({
          id: pData.id,
          user_id: pData.user_id,
          cash_balance: Number(pData.cash_balance),
          total_value: Number(pData.total_value)
        });

        const { data: hData } = await supabase
          .from('holdings')
          .select('*')
          .eq('portfolio_id', pData.id);
        
        setRawHoldings(hData || []);

        const { data: tData } = await supabase
          .from('transactions')
          .select('*')
          .eq('portfolio_id', pData.id)
          .order('created_at', { ascending: false });
        
        setTransactions(tData || []);

        const { data: dData } = await supabase
          .from('deposit_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        setDepositRequests(dData || []);

        const { data: wData } = await supabase
          .from('withdrawal_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        setWithdrawalRequests(wData || []);

        setLoading(false);
        return; // Success
      }

      if (pError) {
        console.error("[Fornix] Authoritative Context Error:", pError);
        break; 
      }

      // If we reach here, it means 0 rows found. 
      // This might be a race condition with the signup trigger.
      attempts++;
      if (attempts < maxAttempts) {
        console.log(`[Fornix] Context missing. Retry attempt ${attempts}/${maxAttempts}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        // FINAL FALLBACK: Create a portfolio if it truly doesn't exist
        console.log("[Fornix] Retries exhausted. Attempting proactive provisioning...");
        const { data: newPortfolio, error: createError } = await supabase
          .from('portfolios')
          .insert([{ 
            user_id: userId,
            cash_balance: 0,
            total_value: 0
          }])
          .select()
          .single();

        if (!createError && newPortfolio) {
          console.log("[Fornix] Proactive provisioning successful.");
          setPortfolio({
            id: newPortfolio.id,
            user_id: newPortfolio.user_id,
            cash_balance: 0,
            total_value: 0
          });
          setRawHoldings([]);
          setTransactions([]);
          setDepositRequests([]);
          setWithdrawalRequests([]);
          setLoading(false);
          return;
        } else if (createError) {
          console.error("[Fornix] Provisioning Error:", createError);
        }
      }
    }

    console.warn("[Fornix] Portfolio hydration failed or missing context after retries.");
    setSyncError(true);
    setLoading(false);
  }, [userId, supabase]);

  const fetchDataDebounced = useCallback(() => {
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    fetchTimeout.current = setTimeout(() => {
      performFetch();
    }, 300); // 300ms debounce
  }, [performFetch]);

  useEffect(() => {
    performFetch();
  }, [performFetch]);

  // Real-time Stabilization
  useEffect(() => {
    if (!userId || !portfolio) return;

    // Use a unique ID for this hook instance to prevent channel collisions
    const instanceId = Math.random().toString(36).substring(7);
    const channel = supabase
      .channel(`portfolio-sync-${userId}-${instanceId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolios', filter: `user_id=eq.${userId}` }, () => fetchDataDebounced())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'holdings', filter: `portfolio_id=eq.${portfolio.id}` }, () => fetchDataDebounced())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `portfolio_id=eq.${portfolio.id}` }, () => fetchDataDebounced())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deposit_requests', filter: `user_id=eq.${userId}` }, () => fetchDataDebounced())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawal_requests', filter: `user_id=eq.${userId}` }, () => fetchDataDebounced())
      .subscribe();

    return () => { 
        supabase.removeChannel(channel); 
        if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    };
  }, [userId, portfolio?.id, supabase, fetchDataDebounced]);

  // Dynamic Market Subscription for missing symbols
  useEffect(() => {
    rawHoldings.forEach(h => {
      subscribeToSymbol(h.symbol);
    });
  }, [rawHoldings, subscribeToSymbol]);

  // Valuation Engine
  const processedHoldings = useMemo(() => {
    return rawHoldings.map(h => {
      const quantity = Number(h.quantity);
      const avgCost = Number(h.avg_cost);
      
      const marketData = prices[h.symbol];
      const isHydrating = !marketData;

      const currentPrice = marketData?.price;
      const previousClose = marketData?.previousClose;
      
      // Strict Valuation Logic:
      const positionValue = isHydrating ? (quantity * avgCost) : (quantity * currentPrice!);
      const pnl = isHydrating ? 0 : ((currentPrice! - avgCost) * quantity);
      const pnlPercent = isHydrating ? 0 : (avgCost > 0 ? ((currentPrice! - avgCost) / avgCost) * 100 : 0);
      const dailyMovement = (isHydrating || !previousClose) ? 0 : ((currentPrice! - previousClose) * quantity);

      return {
        ...h,
        quantity,
        avg_cost: avgCost,
        current_price: currentPrice,
        position_value: positionValue,
        pnl,
        pnl_percent: pnlPercent,
        daily_movement: dailyMovement,
        isHydrating
      } as Holding;
    });
  }, [rawHoldings, prices]);

  const totalHoldingsValue = useMemo(() => {
    return processedHoldings.reduce((sum, h) => sum + h.position_value, 0);
  }, [processedHoldings]);

  const liveTotalValue = useMemo(() => {
    if (!portfolio) return 0;
    return Number(portfolio.cash_balance) + totalHoldingsValue;
  }, [portfolio, totalHoldingsValue]);

  const totalPnL = useMemo(() => {
    return processedHoldings.reduce((sum, h) => sum + h.pnl, 0);
  }, [processedHoldings]);

  // Daily Movement Aggregation
  const totalDailyMovement = useMemo(() => {
    return processedHoldings.reduce((sum, h) => sum + h.daily_movement, 0);
  }, [processedHoldings]);

  const totalDailyMovementPercent = useMemo(() => {
    if (totalHoldingsValue === 0) return 0;
    const previousHoldingsValue = totalHoldingsValue - totalDailyMovement;
    if (previousHoldingsValue <= 0) return 0;
    return (totalDailyMovement / previousHoldingsValue) * 100;
  }, [totalDailyMovement, totalHoldingsValue]);

  // Realized P/L Aggregation
  const totalRealizedPnL = useMemo(() => {
    return transactions.reduce((sum, tx) => {
      if (tx.type === 'sell' && tx.realized_pnl) {
        return sum + Number(tx.realized_pnl);
      }
      return sum;
    }, 0);
  }, [transactions]);

  const pendingWithdrawalsTotal = useMemo(() => {
    return withdrawalRequests
      .filter(r => r.status === 'pending' || r.status === 'processing')
      .reduce((sum, r) => sum + Number(r.amount), 0);
  }, [withdrawalRequests]);

  const availableToWithdraw = useMemo(() => {
    if (!portfolio) return 0;
    return Math.max(0, Number(portfolio.cash_balance) - pendingWithdrawalsTotal);
  }, [portfolio, pendingWithdrawalsTotal]);

  return {
    portfolio: portfolio ? { ...portfolio, total_value: liveTotalValue } : null,
    holdings: processedHoldings,
    transactions,
    depositRequests,
    withdrawalRequests,
    availableToWithdraw,
    pendingWithdrawalsTotal,
    totalPnL,
    totalRealizedPnL,
    totalDailyMovement,
    totalDailyMovementPercent,
    loading,
    syncError,
    refresh: performFetch
  };
}
