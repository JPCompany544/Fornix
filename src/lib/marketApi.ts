/**
 * Market Data API Layer
 * Provider: Finnhub
 */

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_KEY || 'REPLACE_WITH_YOUR_FINNHUB_API_KEY';
const BASE_URL = 'https://finnhub.io/api/v1';

export async function searchStocks(query: string) {
  if (!query) return [];
  const response = await fetch(`${BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`);
  const data = await response.json();
  return data.result || [];
}

export async function getStockQuote(symbol: string) {
  const response = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
  const data = await response.json();
  return {
    current: data.c ?? 0,
    high: data.h ?? 0,
    low: data.l ?? 0,
    open: data.o ?? 0,
    pc: data.pc ?? 0,
    d: data.d ?? 0,
    dp: data.dp ?? 0,
    t: data.t ?? 0
  };
}

/**
 * Batch Quote Fetcher
 */
export async function getBatchQuotes(symbols: string[]) {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await res.json();

        return {
          symbol,
          price: data.c ?? 0,
          change: data.d ?? 0,
          percent: data.dp ?? 0
        };
      } catch (err) {
        return {
          symbol,
          price: 0,
          change: 0,
          percent: 0
        };
      }
    })
  );

  return results;
}

/**
 * Stock Chart Data Fetcher
 * Returns candle data normalized for Recharts.
 */
export async function getStockChart(symbol: string, resolution = "D") {
  const to = Math.floor(Date.now() / 1000);
  
  // Resolution Mapping:
  // D -> 1 Month of Daily data
  // 60 -> 1 Week of 60m data
  // W -> 6 Months of Weekly data
  // M -> 2 Years of Monthly data
  
  let from;
  switch(resolution) {
    case '60': from = to - (60 * 60 * 24 * 7); break; 
    case 'W':  from = to - (60 * 60 * 24 * 180); break; 
    case 'M':  from = to - (60 * 60 * 24 * 730); break; 
    default:   from = to - (60 * 60 * 24 * 30); break; // Default to 30 days for Daily resolution
  }

  const res = await fetch(
    `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
  );

  const data = await res.json();

  if (data.s !== "ok" || !data.t) return [];

  return data.t.map((t: number, i: number) => ({
    time: t * 1000,
    price: data.c[i]
  }));
}

export async function getStockProfile(symbol: string) {
  const response = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
  return await response.json();
}
