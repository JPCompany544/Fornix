export const MARKET_UNIVERSE = [
  'AAPL',
  'MSFT',
  'TSLA',
  'NVDA',
  'AMZN',
  'META',
  'GOOGL',
  'AMD',
  'NFLX',
  'INTC',
  'SPOT',
  'ABNB'
];

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}
