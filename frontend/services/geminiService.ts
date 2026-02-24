import { GoogleGenAI, Type } from '@google/genai';
import { Currency, MarketAnalysis } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey, vertexai: true });
};

export const analyzeMarket = async (currencies: Currency[]): Promise<MarketAnalysis> => {
  const ai = getClient();
  if (!ai) {
    throw new Error("API Key missing. Cannot perform analysis.");
  }

  // Prepare data for the model
  const marketSummary = currencies.map(c => 
    `${c.name} (${c.symbol}): $${c.price.toFixed(2)} (${c.change24h > 0 ? '+' : ''}${c.change24h.toFixed(2)}%)`
  ).join('\n');

  const prompt = `
    You are a senior crypto market analyst. Analyze the following real-time market data snapshot:
    
    ${marketSummary}
    
    Provide a concise market summary, determine the overall sentiment, and identify 3 key drivers or potential reasons for these movements (speculative is fine, based on typical crypto correlations).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A 2-3 sentence summary of the market state." },
            sentiment: { type: Type.STRING, enum: ["bullish", "bearish", "neutral"] },
            keyDrivers: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 short bullet points explaining potential reasons."
            }
          },
          required: ["summary", "sentiment", "keyDrivers"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text);
    
    return {
      summary: data.summary,
      sentiment: data.sentiment as 'bullish' | 'bearish' | 'neutral',
      keyDrivers: data.keyDrivers,
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
