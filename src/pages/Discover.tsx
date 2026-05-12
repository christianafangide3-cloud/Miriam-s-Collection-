import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Loader2, Search, Heart, ShoppingBag } from "lucide-react";
import { useProducts, Product } from "../contexts/ProductsContext";
import { GoogleGenAI, Type } from "@google/genai";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const Discover = () => {
  const { products, loading: productsLoading } = useProducts();
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || productsLoading || products.length === 0) return;

    setIsSearching(true);
    setRecommendations([]);
    setAiMessage("");

    try {
      // Create a inventory summary for Gemini
      const inventorySummary = products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        price: p.price
      }));

      const prompt = `User's style/needs: "${query}"
      Based on our sustainable inventory: ${JSON.stringify(inventorySummary)}
      
      Suggest the most relevant 2-4 products. Explain why they fit in 1-2 short sentences each.
      Return the response in JSON format.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING, description: "A summary message from the AI styler." },
              recommendedProductIds: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "The IDs of the recommended products."
              }
            },
            required: ["explanation", "recommendedProductIds"]
          }
        }
      });

      const result = JSON.parse(response.text);
      setAiMessage(result.explanation);
      
      const suggested = products.filter(p => result.recommendedProductIds.includes(p.id));
      setRecommendations(suggested);
    } catch (err) {
      console.error("AI Error:", err);
      setAiMessage("I couldn't process your style request right now. Try describing something else!");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full text-primary text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3 h-3" />
            AI Stylist
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 italic">Personalized Sustainablity</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Describe what you're looking for, or your style preferences, and our curator will find the perfect sustainable matches.
          </p>
        </div>

        <form onSubmit={handleDiscover} className="relative mb-24 max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="e.g. 'I need a minimalist look for a coastal wedding' or 'Best eco-friendly bags for work'"
            className="w-full bg-white border border-border rounded-[2rem] py-6 px-8 pl-16 text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
          <button 
            type="submit" 
            disabled={isSearching}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {isSearching && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="inline-block animate-bounce mb-4">
                <Sparkles className="w-12 h-12 text-primary/30" />
              </div>
              <p className="text-xl font-serif italic text-muted-foreground">Curating your selection...</p>
            </motion.div>
          )}

          {aiMessage && !isSearching && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="bg-white border rounded-[2.5rem] p-8 md:p-12 shadow-sm text-center">
                <p className="text-2xl font-serif italic leading-relaxed text-balance">
                  "{aiMessage}"
                </p>
              </div>

              {recommendations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recommendations.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white rounded-[2rem] overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-serif mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium">₦{product.price.toLocaleString()}</span>
                          <Link to={`/product/${product.id}`}>
                            <Button variant="outline" className="rounded-full px-6">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!isSearching && !aiMessage && (
          <div className="text-center py-24 opacity-30">
             <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
             <p className="font-serif italic text-lg">Your curated discovery starts here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
