import { useEffect, useState } from "react";
import { getStockChart } from "@/lib/marketApi";

/**
 * Generates realistic synthetic candle data for demo purposes
 */
function generateMockData(symbol: string, count: number) {
  const data = [];
  let currentPrice = 150 + Math.random() * 100;
  const now = Date.now();
  const step = 60 * 60 * 24 * 1000; // 1 day

  for (let i = count; i >= 0; i--) {
    const volatility = (Math.random() - 0.5) * 5;
    currentPrice += volatility;
    data.push({
      time: now - (i * step),
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  return data;
}

export function useStockChart(symbol: string, resolution = "D") {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    if (!symbol) return;

    setLoading(true);
    setIsMock(false);

    getStockChart(symbol, resolution)
      .then((res) => {
        if (!res || res.length === 0) {
          // Fallback to synthetic data if API fails or returns 403
          setData(generateMockData(symbol, 30));
          setIsMock(true);
        } else {
          setData(res);
          setIsMock(false);
        }
      })
      .catch(() => {
        setData(generateMockData(symbol, 30));
        setIsMock(true);
      })
      .finally(() => setLoading(false));
  }, [symbol, resolution]);

  return { data, loading, isMock };
}
