"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Database, 
  BrainCircuit, 
  Droplets, 
  ArrowRight,
  Server,
  MonitorSmartphone,
  Bot
} from "lucide-react";
import Image from "next/image";

export default function DocsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-4">
            <BookOpen size={16} /> Technical Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            System Architecture & Models
          </h1>
          <p className="text-lg text-slate-600">
            A comprehensive overview of how FarmForesight processes agricultural data, implements machine learning, and calculates water sustainability metrics.
          </p>
        </div>

        {/* System Architecture Flow */}
        <section className="glass-panel p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <MonitorSmartphone className="text-brand-500" /> End-to-End Architecture Flow
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-brand-200 via-accent-300 to-emerald-200 -z-10 -translate-y-1/2 rounded-full"></div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center w-full md:w-48 z-10">
              <MonitorSmartphone size={32} className="text-slate-700 mb-3" />
              <h3 className="font-bold text-slate-800">React Client</h3>
              <p className="text-xs text-slate-500 mt-2">Next.js UI & Forms</p>
            </div>

            <ArrowRight className="text-brand-300 md:hidden rotate-90 my-2" />

            <div className="bg-brand-500 text-white p-6 rounded-2xl shadow-md shadow-brand-500/20 flex flex-col items-center text-center w-full md:w-48 z-10">
              <Server size={32} className="mb-3" />
              <h3 className="font-bold">FastAPI Backend</h3>
              <p className="text-xs text-brand-100 mt-2">Python REST API</p>
            </div>

            <ArrowRight className="text-brand-300 md:hidden rotate-90 my-2" />

            <div className="flex flex-col gap-4 w-full md:w-56 z-10">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <BrainCircuit className="text-accent-500 shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 text-sm">Scikit-Learn</h3>
                  <p className="text-xs text-slate-500">RandomForest Model</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <Bot className="text-blue-500 shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 text-sm">Google Gemini</h3>
                  <p className="text-xs text-slate-500">Intent & Chatbot LLM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t border-slate-100 pt-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <ArrowRight className="text-brand-500" /> Detailed Request Flowcharts
            </h3>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Form Flow */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="text-lg font-bold text-slate-700 mb-6 text-center border-b border-slate-100 pb-4">
                  1. Form Submission Pipeline
                </h4>
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 text-xs">1. User Form Input</span>
                    <p className="text-[10px] text-slate-500">React Client captures parameters (N, P, K, pH, City)</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <span className="font-bold text-blue-700 text-xs">2. API POST /predict</span>
                    <p className="text-[10px] text-blue-600">JSON sent to FastAPI Backend</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
                    <span className="font-bold text-sky-700 text-xs">3. Weather Fetching</span>
                    <p className="text-[10px] text-sky-600">Calls `get_weather_smart()` &rarr; Nominatim API &rarr; Open-Meteo API</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-700 text-xs">4. ML Inference</span>
                    <p className="text-[10px] text-emerald-600">Calls `model.predict_proba()` &rarr; Random Forest outputs top 3 crops</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-emerald-100/50 p-3 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-700 text-xs">5. Regional Filtering</span>
                    <p className="text-[10px] text-emerald-600">Calls `filter_crops_by_region()` to eliminate unsuitable crops</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <span className="font-bold text-purple-700 text-xs">6. Irrigation Technique</span>
                    <p className="text-[10px] text-purple-600">Calls `recommend_irrigation()` based on crop, weather, and soil</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-purple-100/50 p-3 rounded-lg border border-purple-200">
                    <span className="font-bold text-purple-700 text-xs">7. Water Calculation</span>
                    <p className="text-[10px] text-purple-600">Calls `calculate_water_savings()` &rarr; Baseline vs Optimized (L/ha)</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-purple-200/40 p-3 rounded-lg border border-purple-200">
                    <span className="font-bold text-purple-700 text-xs">8. Sustainability Practices</span>
                    <p className="text-[10px] text-purple-600">Calls `get_sustainability()` &rarr; Adds eco-friendly farming tips</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-700 text-xs">9. Reasoning Generation</span>
                    <p className="text-[10px] text-amber-600">Calls `generate_reason()` to compile a summary of why the crop was picked</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-brand-50 p-3 rounded-lg border border-brand-200">
                    <span className="font-bold text-brand-700 text-xs">10. Frontend Render</span>
                    <p className="text-[10px] text-brand-600">React fetches crop image via Unsplash API and displays report blocks</p>
                  </div>
                </div>
              </div>

              {/* Chatbot Flow */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="text-lg font-bold text-slate-700 mb-6 text-center border-b border-slate-100 pb-4">
                  2. Chatbot Analytics Pipeline
                </h4>
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 text-xs">1. Natural Language Query</span>
                    <p className="text-[10px] text-slate-500">User asks query via chat interface</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>
                  
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <span className="font-bold text-indigo-700 text-xs">2. API POST /chatbot</span>
                    <p className="text-[10px] text-indigo-600">Message sent to FastAPI</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <span className="font-bold text-blue-700 text-xs">3. Intent Classification</span>
                    <p className="text-[10px] text-blue-600">Gemini LLM parses query &rarr; outputs JSON (`recommendation` or `analytics`)</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-2 relative">
                    <div className="absolute top-0 left-1/4 w-1/2 h-4 border-t-2 border-slate-200 -mt-2"></div>
                    <div className="absolute top-0 left-1/4 w-0.5 h-2 bg-slate-200 -mt-2"></div>
                    <div className="absolute top-0 right-1/4 w-0.5 h-2 bg-slate-200 -mt-2"></div>

                    {/* Left Path */}
                    <div className="flex flex-col gap-2">
                      <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                        <span className="font-bold text-emerald-700 text-[10px] block border-b border-emerald-100 mb-1">Path A: Recommendation</span>
                        <p className="text-[9px] text-emerald-600">1. LLM Extracts N,P,K params</p>
                      </div>
                      <div className="flex justify-center text-emerald-300"><ArrowRight className="rotate-90" size={12} /></div>
                      <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                        <p className="text-[9px] text-emerald-600">2. Calls `full_recommendation()`</p>
                      </div>
                      <div className="flex justify-center text-emerald-300"><ArrowRight className="rotate-90" size={12} /></div>
                      <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                        <p className="text-[9px] text-emerald-600">3. ML Inf &rarr; Irrigation &rarr; Water &rarr; Sustain</p>
                      </div>
                    </div>

                    {/* Right Path */}
                    <div className="flex flex-col gap-2">
                      <div className="bg-sky-50 p-2 rounded border border-sky-200">
                        <span className="font-bold text-sky-700 text-[10px] block border-b border-sky-100 mb-1">Path B: Analytics</span>
                        <p className="text-[9px] text-sky-600">1. Parse Query Type (e.g., 'count')</p>
                      </div>
                      <div className="flex justify-center text-sky-300"><ArrowRight className="rotate-90" size={12} /></div>
                      <div className="bg-sky-50 p-2 rounded border border-sky-200">
                        <p className="text-[9px] text-sky-600">2. Call `DatasetAnalysisService`</p>
                      </div>
                      <div className="flex justify-center text-sky-300"><ArrowRight className="rotate-90" size={12} /></div>
                      <div className="bg-sky-50 p-2 rounded border border-sky-200">
                        <p className="text-[9px] text-sky-600">3. Pandas aggregates `crop_cleaned.csv`</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center text-slate-300 mt-2"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-700 text-xs">4. LLM Response Generation</span>
                    <p className="text-[10px] text-amber-600">Raw JSON payload passed to Gemini to generate conversational summary text</p>
                  </div>
                  <div className="flex justify-center text-slate-300"><ArrowRight className="rotate-90" size={14} /></div>

                  <div className="bg-brand-50 p-3 rounded-lg border border-brand-200">
                    <span className="font-bold text-brand-700 text-xs">5. Final Client Render</span>
                    <p className="text-[10px] text-brand-600">Chat UI renders streaming text alongside the raw data tables</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Model Specification */}
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <BrainCircuit className="text-accent-500" /> Machine Learning Model
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Algorithm</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We utilize a <strong className="text-slate-800">Random Forest Classifier</strong> (`sklearn.ensemble.RandomForestClassifier`) configured with `n_estimators=100`. This ensemble method builds multiple decision trees and merges them together to get a more accurate and stable crop prediction.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Input Features</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div> Nitrogen (N)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div> Phosphorus (P)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div> Potassium (K)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div> Soil pH</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div> Temperature (°C)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div> Humidity (%)</li>
                  <li className="flex items-center gap-2 col-span-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div> Rainfall (mm)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Model Performance</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-medium">Train Acc</p>
                    <p className="text-lg font-bold text-emerald-700">100%</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-medium">Test Acc</p>
                    <p className="text-lg font-bold text-emerald-700">99.25%</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-medium">5-Fold CV</p>
                    <p className="text-lg font-bold text-emerald-700">99.25%</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Feature Importance</h3>
                <div className="relative w-full aspect-[5/3] rounded-lg overflow-hidden border border-slate-100 mt-2">
                  <Image 
                    src="/docs/feature_importance.png" 
                    alt="Feature Importance Graph" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                <h3 className="font-semibold text-slate-700 mb-2 text-sm flex items-center gap-2">
                  <Database size={16} className="text-slate-500" /> Data Pipeline & Cleaning
                </h3>
                <ul className="text-xs text-slate-500 leading-relaxed space-y-1 list-disc pl-4">
                  <li><strong>Raw Dataset:</strong> `Crop_recommendation_messy.csv`</li>
                  <li><strong>Cleaning Steps:</strong> Standardized column names (stripped whitespace, converted to lowercase).</li>
                  <li>Dropped all missing values (`NaN`) and duplicate rows to ensure data integrity.</li>
                  <li>Target labels were stripped and lowercased for consistency.</li>
                  <li><strong>Export:</strong> Resulted in a pristine `crop_cleaned.csv` ready for Scikit-Learn.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Water Saving Logic */}
          <section className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-5">
              <Droplets size={200} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Droplets className="text-emerald-500" /> Water Savings Calculation
            </h2>

            <div className="space-y-6 relative z-10">
              <p className="text-slate-600 text-sm leading-relaxed">
                The AI calculates theoretical water savings by comparing the traditional flood irrigation technique against our optimized precision recommendation.
              </p>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Step 1: Baseline Need</h4>
                  <p className="font-mono text-sm text-slate-700 bg-slate-50 p-2 rounded">
                    Baseline (mm) = Crop_Need_mm / 0.50
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Assuming traditional flood irrigation operates at a 50% application efficiency.</p>
                </div>

                <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 shadow-sm">
                  <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">Step 2: Optimized AI Need</h4>
                  <p className="font-mono text-sm text-brand-800 bg-brand-100/50 p-2 rounded break-words">
                    Optimized = (Crop_Need - Rainfall) / Efficiency
                  </p>
                  <p className="text-xs text-brand-600 mt-2">
                    We subtract natural rainfall. Efficiency depends on the AI recommendation: <b>Drip (90%)</b>, <b>Sprinkler (75%)</b>.
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Step 3: Conversion to Liters</h4>
                  <p className="text-sm text-emerald-800">
                    <span className="font-semibold text-emerald-600">Saved_Liters_per_Hectare</span> = (Baseline - Optimized) × 10,000
                  </p>
                  <p className="text-xs text-emerald-600 mt-2">
                    1 mm of water depth applied over 1 hectare of land equals precisely 10,000 liters of water volume.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* API Specifications */}
              <section className="glass-panel p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Database className="text-blue-500" /> API Specifications
                </h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-1">
                      <Bot size={16} className="text-blue-500" /> Google Gemini (2.5 Flash)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Used for intent classification (`recommendation` vs `analytics`) and generating natural language conversational responses from structured JSON payloads.</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-1">
                      <Droplets size={16} className="text-cyan-500" /> Open-Meteo API
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Provides free, high-resolution weather data without API keys. Fetches real-time humidity and historical 30-day averages for rainfall and temperature.</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-1">
                      <Database size={16} className="text-emerald-500" /> Nominatim (OpenStreetMap)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Geocoding API used to instantly convert the user's requested District/City into strict Latitude and Longitude coordinates for the weather API.</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-1">
                      <MonitorSmartphone size={16} className="text-slate-500" /> Unsplash API / Remote Fetching
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Dynamically fetches high-quality, professional photographs of the recommended crops for a premium frontend UI experience.</p>
                  </div>
                </div>
              </section>

              {/* Future Expansions */}
              <section className="glass-panel p-8 bg-gradient-to-br from-brand-50 to-white">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <BrainCircuit className="text-brand-500" /> Future Expansions
                </h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-brand-100 shadow-sm flex gap-4">
                    <div className="bg-brand-100 p-2 rounded-lg h-fit text-brand-600 font-bold">01</div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-sm mb-1">Real-Time IoT Hardware Integration</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">Integrate physical ESP32/Arduino sensors directly in the fields to push live N, P, K, and soil moisture data to the FastAPI backend, eliminating manual form entry.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-brand-100 shadow-sm flex gap-4">
                    <div className="bg-brand-100 p-2 rounded-lg h-fit text-brand-600 font-bold">02</div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-sm mb-1">Market Economics & MSP Integration</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">Scrape or ingest live agricultural APIs to provide current Minimum Selling Price (MSP) and market average price predictions for recommended crops.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-brand-100 shadow-sm flex gap-4">
                    <div className="bg-brand-100 p-2 rounded-lg h-fit text-brand-600 font-bold">03</div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-sm mb-1">Multi-Lingual Outreach</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">Expand the chatbot and UI to natively support Hindi, Marathi, Punjabi, and other regional languages to drastically increase outreach to rural Indian farmers.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-brand-100 shadow-sm flex gap-4">
                    <div className="bg-brand-100 p-2 rounded-lg h-fit text-brand-600 font-bold">04</div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-sm mb-1">Scale Dataset & Crop Variety</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">Train the Random Forest model on a drastically larger, more complex real-world dataset covering thousands of distinct crop varieties tailored to specialized micro-climates.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
