import React from 'react';
import { Currency } from '../types';
import Sparkline from './Sparkline';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CryptoCardProps {
  currency: Currency;
  onClick: (currency: Currency) => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ currency, onClick }) => {
  const isPositive = currency.change24h >= 0;

  return (
    <div 
      onClick={() => onClick(currency)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-primary-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: currency.color }}>
            {currency.symbol[0]}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{currency.name}</h3>
            <span className="text-gray-400 text-xs font-mono">{currency.symbol}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(currency.change24h).toFixed(2)}%
        </div>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-white flex items-center">
          <span className="text-gray-500 text-lg mr-1">$</span>
          {currency.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <Sparkline data={currency.history} color={currency.color} isPositive={isPositive} />
    </div>
  );
};

export default CryptoCard;
