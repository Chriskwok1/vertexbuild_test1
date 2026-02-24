export interface PricePoint {
  time: string;
  value: number;
}

export interface Currency {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number; // Percentage
  volume24h: number;
  marketCap: number;
  history: PricePoint[];
  color: string;
}

export interface MarketAnalysis {
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  keyDrivers: string[];
  timestamp: number;
}
