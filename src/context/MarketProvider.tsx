"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getStockQuote } from '@/lib/marketApi';

interface StockData {
  price: number;
  changePercent: number;
  previousClose: number;
}

interface MarketContextType {
  prices: Record<string, StockData>;
  loading: boolean;
  refreshPrices: (symbols: string[]) => Promise<void>;
  subscribeToSymbol: (symbol: string) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, StockData>>({
    'AAPL': { price: 182.63, changePercent: 0.45, previousClose: 181.81 },
    'ABNB': { price: 144.12, changePercent: -1.2, previousClose: 145.87 },
    'NVDA': { price: 726.13, changePercent: 2.3, previousClose: 709.80 },
    'SPOT': { price: 231.18, changePercent: 1.1, previousClose: 228.66 },
    'TSLA': { price: 193.57, changePercent: -0.8, previousClose: 195.13 },
    'AMZN': { price: 174.45, changePercent: 0.1, previousClose: 174.28 },
    'USD': { price: 1.00, changePercent: 0, previousClose: 1.00 }
  });
  
  const [loading, setLoading] = useState(false);
  
  // Track requested subscriptions that aren't yet in prices
  const activeSubscriptions = useRef(new Set<string>(Object.keys(prices)));

  const fetchPrices = useCallback(async (symbols: string[]) => {
    if (symbols.length === 0) return;
    
    try {
      const newPrices = { ...prices };
      const promises = symbols.map(async (symbol) => {
        if (symbol === 'USD') return;
        const quote = await getStockQuote(symbol);
        if (quote.current !== undefined) {
          newPrices[symbol] = {
            price: quote.current,
            changePercent: quote.dp ?? 0,
            previousClose: quote.pc ?? quote.current
          };
        }
      });

      await Promise.all(promises);
      setPrices(newPrices);
    } catch (err) {
      console.warn("[MarketProvider] Price fetch failed, using fallback/cache");
    }
  }, [prices]);

  const subscribeToSymbol = useCallback((symbol: string) => {
    const normalized = symbol.toUpperCase().trim();
    if (normalized === 'USD') return;
    
    if (!activeSubscriptions.current.has(normalized)) {
      activeSubscriptions.current.add(normalized);
      // Immediately fetch for the new symbol
      fetchPrices([normalized]);
    }
  }, [fetchPrices]);

  // Global polling for active symbols (30s)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices(Array.from(activeSubscriptions.current));
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPrices]);

  return (
    <MarketContext.Provider value={{ prices, loading, refreshPrices: fetchPrices, subscribeToSymbol }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarketData = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketProvider');
  }
  return context;
};
