import React, { useState, useEffect, useCallback } from 'react';
import { initializeMarket, updateMarket } from './services/marketService';
import { Currency } from './types';
import CryptoCard from './components/CryptoCard';
import AIAnalyst from './components/AIAnalyst';
import { Activity, Zap, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [isLive, setIsLive] = useState(true);

  // Initialize Data
  useEffect(() => {
    setCurrencies(initializeMarket());
  }, []);

  // Real-time simulation loop
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCurrencies(prev => {
        const updated = updateMarket(prev);
        // If a currency is selected, update its reference so the detail view updates
        if (selectedCurrency) {
          const updatedSelected = updated.find(c => c.id === selectedCurrency.id);
          if (updatedSelected) setSelectedCurrency(updatedSelected);
        }
        return updated;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isLive, selectedCurrency]);

  const handleCardClick = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-primary-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Activity size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              NovaCrypto <span className="text-primary-500">Live</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                isLive 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse' 
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              {isLive ? 'Live Feed' : 'Paused'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Market Overview & Detail */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Featured / Detail View */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
              {selectedCurrency ? (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-white">{selectedCurrency.name}</h2>
                        <span className="px-2 py-1 bg-gray-800 rounded text-sm text-gray-400 font-mono">{selectedCurrency.symbol}</span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-white">
                          ${selectedCurrency.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-lg font-medium ${selectedCurrency.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedCurrency.change24h >= 0 ? '+' : ''}{selectedCurrency.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-gray-400 text-sm">Market Cap</p>
                      <p className="text-white font-medium">${(selectedCurrency.marketCap / 1e9).toFixed(2)}B</p>
                      <p className="text-gray-400 text-sm mt-2">Volume (24h)</p>
                      <p className="text-white font-medium">${(selectedCurrency.volume24h / 1e6).toFixed(2)}M</p>
                    </div>
                  </div>

                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedCurrency.history}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={selectedCurrency.color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={selectedCurrency.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          stroke="#9ca3af" 
                          tick={{fontSize: 12}} 
                          tickMargin={10}
                          minTickGap={30}
                        />
                        <YAxis 
                          domain={['auto', 'auto']} 
                          stroke="#9ca3af" 
                          tick={{fontSize: 12}}
                          tickFormatter={(val) => `$${val.toLocaleString()}`}
                          width={80}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }}
                          itemStyle={{ color: '#f3f4f6' }}
                          formatter={(value: number) => [`$${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 'Price']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={selectedCurrency.color} 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-gray-500">
                  <BarChart3 size={48} className="mb-4 opacity-50" />
                  <p className="text-lg">Select a currency to view detailed analytics</p>
                </div>
              )}
            </div>

            {/* Grid of Cards */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-500" />
                Market Movers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currencies.map(currency => (
                  <CryptoCard 
                    key={currency.id} 
                    currency={currency} 
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: AI & Stats */}
          <div className="space-y-8">
            <AIAnalyst currencies={currencies} />

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Market Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Total Market Cap</span>
                  <span className="text-white font-mono">$2.45T</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-white font-mono">$84.2B</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">BTC Dominance</span>
                  <span className="text-white font-mono">52.1%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">ETH Gas</span>
                  <span className="text-white font-mono">15 Gwei</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-900/20 to-gray-900 border border-primary-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Pro Tip</h3>
              <p className="text-gray-400 text-sm">
                Use the Gemini Analyst to detect subtle market correlations that traditional indicators might miss.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
