import { Currency, PricePoint } from '../types';
import { INITIAL_CURRENCIES, HISTORY_LENGTH } from '../constants';

// Helper to generate initial history
const generateHistory = (basePrice: number, count: number): PricePoint[] => {
  const history: PricePoint[] = [];
  let currentPrice = basePrice;
  const now = Date.now();
  
  for (let i = count; i > 0; i--) {
    // Random walk
    const change = (Math.random() - 0.5) * (basePrice * 0.02);
    currentPrice += change;
    history.push({
      time: new Date(now - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: currentPrice
    });
  }
  return history;
};

export const initializeMarket = (): Currency[] => {
  return INITIAL_CURRENCIES.map(c => ({
    ...c,
    history: generateHistory(c.price, HISTORY_LENGTH)
  }));
};

export const updateMarket = (currentMarket: Currency[]): Currency[] => {
  return currentMarket.map(currency => {
    // Simulate price movement
    const volatility = 0.002; // 0.2% max move per tick
    const move = (Math.random() - 0.5) * 2 * volatility;
    const newPrice = currency.price * (1 + move);
    
    // Update history
    const newHistory = [...currency.history.slice(1)];
    newHistory.push({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: newPrice
    });

    // Update 24h change slightly to make it feel alive
    const newChange = currency.change24h + (move * 100);

    return {
      ...currency,
      price: newPrice,
      change24h: newChange,
      history: newHistory
    };
  });
};
