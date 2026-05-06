"use client";

import { useState } from "react";
import { SoilInputForm } from "@/components/SoilInputForm";
import { RecommendationResult } from "@/components/RecommendationResult";
import { PredictionRequest, PredictionResponse, getRecommendation } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (data: PredictionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRecommendation(data);
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred while fetching the recommendation.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-4">
            <Leaf size={14} /> Smart Farming
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Maximize Your Yield with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">AI Insights</span>
          </h2>
          <p className="text-lg text-slate-600">
            Harness the power of machine learning to discover the most suitable crops for your soil and local climate conditions.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className={`${result ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-3'} w-full transition-all duration-500`}>
          <SoilInputForm onSubmit={handlePredict} isLoading={isLoading} />
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {result && (
            <div className="lg:col-span-7 w-full h-full">
              <RecommendationResult data={result} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
