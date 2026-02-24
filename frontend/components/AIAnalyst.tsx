import React, { useState } from 'react';
import { BrainCircuit, RefreshCw, AlertTriangle } from 'lucide-react';
import { MarketAnalysis, Currency } from '../types';
import { analyzeMarket } from '../services/geminiService';

interface AIAnalystProps {
  currencies: Currency[];
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ currencies }) => {
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMarket(currencies);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to generate analysis. Please check your API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-primary-400" size={24} />
          <h2 className="text-xl font-bold text-white">Gemini Market Analyst</h2>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
          {loading ? 'Analyzing...' : 'Generate Insight'}
        </button>
      </div>

      <div className="relative z-10 min-h-[120px]">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {!analysis && !loading && !error && (
          <div className="text-center text-gray-500 py-8">
            <p>Click "Generate Insight" to get real-time AI analysis of the current market data.</p>
          </div>
        )}

        {loading && !analysis && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
        )}

        {analysis && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-gray-400 text-sm uppercase tracking-wider">Sentiment:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                analysis.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                analysis.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
                {analysis.sentiment}
              </span>
              <span className="text-gray-600 text-xs ml-auto">
                {new Date(analysis.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed border-l-2 border-primary-500 pl-4">
              {analysis.summary}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Key Drivers</h4>
              <ul className="space-y-2">
                {analysis.keyDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-primary-500 mt-1">•</span>
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalyst;
