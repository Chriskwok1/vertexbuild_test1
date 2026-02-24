import { Currency } from './types';

export const INITIAL_CURRENCIES: Omit<Currency, 'history'>[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 64230.50,
    change24h: 2.4,
    volume24h: 35000000000,
    marketCap: 1200000000000,
    color: '#f59e0b',
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3450.20,
    change24h: -1.2,
    volume24h: 15000000000,
    marketCap: 400000000000,
    color: '#6366f1',
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 145.80,
    change24h: 5.7,
    volume24h: 4000000000,
    marketCap: 65000000000,
    color: '#10b981',
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    change24h: 0.5,
    volume24h: 400000000,
    marketCap: 16000000000,
    color: '#3b82f6',
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.20,
    change24h: -3.4,
    volume24h: 200000000,
    marketCap: 10000000000,
    color: '#ec4899',
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.16,
    change24h: 8.2,
    volume24h: 2000000000,
    marketCap: 23000000000,
    color: '#fbbf24',
  }
];

export const HISTORY_LENGTH = 30; // Number of data points in sparkline
