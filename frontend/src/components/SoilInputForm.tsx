"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PredictionRequest } from "@/lib/api";
import { Leaf, Droplets, FlaskConical, MapPin, Loader2, CloudRain, Thermometer } from "lucide-react";

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
    use_custom_weather: false,
    temperature: 25,
    humidity: 60,
    rainfall: 100,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "city" ? value : parseFloat(value) || 0,
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
          
          <div className="sm:col-span-2 flex items-center gap-3 bg-brand-50 p-4 rounded-xl border border-brand-100">
            <input
              type="checkbox"
              id="use_custom_weather"
              name="use_custom_weather"
              checked={formData.use_custom_weather}
              onChange={handleChange}
              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
            />
            <label htmlFor="use_custom_weather" className="text-sm font-semibold text-brand-800">
              Provide custom weather data (instead of real-time fetch)
            </label>
          </div>

          {formData.use_custom_weather && (
            <>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  <Thermometer size={16} className="text-orange-500 shrink-0" /> Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="input-field"
                  required={formData.use_custom_weather}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  <Droplets size={16} className="text-blue-500 shrink-0" /> Humidity (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  className="input-field"
                  required={formData.use_custom_weather}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  <CloudRain size={16} className="text-blue-600 shrink-0" /> Rainfall (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="input-field"
                  required={formData.use_custom_weather}
                />
              </div>
            </>
          )}
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
