"use client";

import { motion } from "framer-motion";
import { PredictionResponse } from "@/lib/api";
import { Droplets, ThermometerSun, CloudRain, CheckCircle2, Leaf, BarChart3, AlertTriangle, Sprout } from "lucide-react";
import Image from "next/image";

interface RecommendationResultProps {
  data: PredictionResponse;
}

const jpgCrops = ["mothbeans"];

const getCropImage = (cropName: string) => {
  if (!cropName) return "/crops/default.jpg";
  const formatted = cropName.toLowerCase().replace(/\s+/g, "");
  
  if (jpgCrops.includes(formatted)) {
    return `/crops/${formatted}.jpg`;
  }
  
  return `/crops/${formatted}.webp`;
};

export function RecommendationResult({ data }: RecommendationResultProps) {

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="glass-panel overflow-hidden">
        <div className="relative h-48 w-full bg-brand-100">
          <Image
            src={getCropImage(data.recommended_crop)}
            alt={data.recommended_crop}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-6 text-white">
            <p className="text-sm font-medium text-brand-300 mb-1 flex items-center gap-1">
              <CheckCircle2 size={14} /> Highly Recommended
            </p>
            <h2 className="text-4xl font-bold capitalize">{data.recommended_crop}</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {data.reason}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
              <ThermometerSun className="text-accent-500 mb-1" size={20} />
              <span className="text-xs text-slate-500">Temp</span>
              <span className="font-semibold text-slate-800">{data.temperature.toFixed(1)}°C</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
              <Droplets className="text-blue-500 mb-1" size={20} />
              <span className="text-xs text-slate-500">Humidity</span>
              <span className="font-semibold text-slate-800">{data.humidity.toFixed(0)}%</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
              <CloudRain className="text-cyan-500 mb-1" size={20} />
              <span className="text-xs text-slate-500">Rainfall</span>
              <span className="font-semibold text-slate-800">{data.rainfall_last_30_days.toFixed(0)}mm</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-brand-100 bg-brand-50 rounded-xl p-4">
              <h3 className="font-semibold text-brand-900 flex items-center gap-2 mb-3">
                <Droplets size={18} /> Irrigation Plan
              </h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                <p className="text-sm text-brand-800"><span className="font-medium">Method:</span> {data.irrigation.method}</p>
                <p className="text-sm text-brand-800"><span className="font-medium">Frequency:</span> {data.irrigation.frequency}</p>
                <p className="text-sm text-brand-800"><span className="font-medium">Priority:</span> {data.irrigation.priority}</p>
                <p className="text-sm text-brand-800 col-span-2"><span className="font-medium">Water Req:</span> {data.irrigation.water_requirement}</p>
              </div>
              
              {data.irrigation.water_saved_liters_per_hectare && (
                <div className="mt-3 bg-white p-3 rounded-lg border border-brand-200">
                  <p className="text-sm font-semibold text-brand-600 flex items-center gap-2">
                    💧 Estimated Water Saved
                  </p>
                  <p className="text-2xl font-bold text-brand-700 mt-1">
                    {data.irrigation.water_saved_liters_per_hectare.toLocaleString()} <span className="text-sm font-medium text-brand-500">L/ha</span>
                  </p>
                  <p className="text-xs text-brand-500 mt-1">
                    Compared to traditional flood irrigation.
                  </p>
                </div>
              )}
              
              {data.irrigation.warning && (
                <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <p>{data.irrigation.warning}</p>
                </div>
              )}
            </div>

            {data.sustainability && data.sustainability.length > 0 && (
              <div className="border border-slate-100 bg-white rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                  <Sprout size={18} className="text-brand-500" /> Sustainability Tips
                </h3>
                <ul className="space-y-2">
                  {data.sustainability.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="text-brand-400 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.top_crops.length > 1 && (
              <div className="pt-2">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3 text-sm">
                  <BarChart3 size={16} /> Alternative Options
                </h3>
                <div className="space-y-2">
                  {data.top_crops.slice(1).map((crop, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-3">
                      <span className="capitalize font-medium text-slate-700 flex items-center gap-2">
                        <Leaf size={14} className="text-brand-500" /> {crop.crop}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 bg-brand-100 text-brand-700 rounded-full">
                        {crop.confidence}% match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
