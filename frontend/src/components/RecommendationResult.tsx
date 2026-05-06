"use client";

import { motion } from "framer-motion";
import { PredictionResponse } from "@/lib/api";
import { Droplets, ThermometerSun, CloudRain, CheckCircle2, Leaf, BarChart3, AlertTriangle, Sprout } from "lucide-react";
import Image from "next/image";

interface RecommendationResultProps {
  data: PredictionResponse;
}

const CROP_IMAGES: Record<string, string> = {
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop",
  maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&auto=format&fit=crop",
  coffee: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
  cotton: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800&auto=format&fit=crop",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?q=80&w=800&auto=format&fit=crop",
  banana: "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=800&auto=format&fit=crop",
  mango: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=800&auto=format&fit=crop",
  orange: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=800&auto=format&fit=crop",
  grapes: "https://images.unsplash.com/photo-1596369018448-433a04efcff8?q=80&w=800&auto=format&fit=crop",
  watermelon: "https://images.unsplash.com/photo-1587049352847-4d4b1263d893?q=80&w=800&auto=format&fit=crop",
  papaya: "https://images.unsplash.com/photo-1617112848505-8919f2bdc173?q=80&w=800&auto=format&fit=crop",
  coconut: "https://images.unsplash.com/photo-1532055047814-1e0e8e6047aa?q=80&w=800&auto=format&fit=crop",
};

export function RecommendationResult({ data }: RecommendationResultProps) {
  const cropImage = CROP_IMAGES[data.recommended_crop.toLowerCase()] || 
    `https://images.unsplash.com/photo-random?query=${data.recommended_crop}&w=800`;

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
            src={cropImage}
            alt={data.recommended_crop}
            fill
            className="object-cover"
            unoptimized // Using unoptimized for external random images if needed
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
