import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface PredictionRequest {
  n: number;
  p: number;
  k: number;
  ph: number;
  city: string;
  use_custom_weather?: boolean;
  temperature?: number;
  humidity?: number;
  rainfall?: number;
}

export interface CropRecommendation {
  crop: string;
  confidence: number;
  confidence_level: string;
}

export interface IrrigationData {
  method: string;
  frequency: string;
  priority: string;
  crop_stage: string;
  water_requirement: string;
  warning: string;
  water_saved_liters_per_hectare?: number;
  water_baseline_liters_per_hectare?: number;
  water_optimized_liters_per_hectare?: number;
}

export interface PredictionResponse {
  recommended_crop: string;
  top_crops: CropRecommendation[];
  temperature: number;
  humidity: number;
  rainfall_last_30_days: number;
  irrigation: IrrigationData;
  sustainability: string[];
  reason: string;
}

export interface ChatbotResponse {
  response: string;
  parsed_data: any;
  crop_data: PredictionResponse;
}

export const getRecommendation = async (data: PredictionRequest): Promise<PredictionResponse> => {
  const response = await axios.post<PredictionResponse>(`${API_URL}/predict`, data);
  return response.data;
};

export const sendChatMessage = async (message: string): Promise<ChatbotResponse> => {
  const response = await axios.post<ChatbotResponse>(`${API_URL}/chatbot`, { message });
  return response.data;
};
