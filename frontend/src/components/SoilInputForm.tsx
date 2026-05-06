"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PredictionRequest } from "@/lib/api";
import { Leaf, Droplets, FlaskConical, MapPin, Loader2 } from "lucide-react";

interface SoilInputFormProps {
  onSubmit: (data: PredictionRequest) => void;
  isLoading: boolean;
}

export function SoilInputForm({ onSubmit, isLoading }: SoilInputFormProps) {
  const [formData, setFormData] = useState<PredictionRequest>({
    n: 90,
    p: 42,
    k: 43,
    ph: 6.5,
    city: "Pune",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "city" ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-8 w-full max-w-xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Soil Analysis Form</h2>
        <p className="text-slate-500 text-sm">Enter your soil metrics and location to receive a tailored crop recommendation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
              <Leaf size={16} className="text-brand-500 shrink-0" /> Nitrogen (N)
            </label>
            <input
              type="number"
              name="n"
              value={formData.n}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
              <Leaf size={16} className="text-brand-500 shrink-0" /> Phosphorus (P)
            </label>
            <input
              type="number"
              name="p"
              value={formData.p}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
              <Leaf size={16} className="text-brand-500 shrink-0" /> Potassium (K)
            </label>
            <input
              type="number"
              name="k"
              value={formData.k}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
              <FlaskConical size={16} className="text-brand-500 shrink-0" /> Soil pH
            </label>
            <input
              type="number"
              step="0.1"
              name="ph"
              value={formData.ph}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
              <MapPin size={16} className="text-brand-500 shrink-0" /> City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Pune"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing Data...
            </>
          ) : (
            "Get Recommendation"
          )}
        </button>
      </form>
    </motion.div>
  );
}
