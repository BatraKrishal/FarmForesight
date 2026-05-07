import pandas as pd
import os

class DatasetAnalysisService:
    def __init__(self, csv_path: str = "data/crop_cleaned.csv"):
        self.csv_path = csv_path
        try:
            self.df = pd.read_csv(self.csv_path)
            # Ensure proper column names if needed, but assuming standard format
        except Exception as e:
            print(f"Error loading CSV: {e}")
            self.df = pd.DataFrame() # Fallback empty dataframe

    def get_total_records(self) -> dict:
        return {"total_records": len(self.df)}

    def get_most_frequent_crop(self) -> dict:
        if self.df.empty or "label" not in self.df.columns:
            return {"error": "Dataset empty or label column missing"}
        most_frequent = self.df["label"].value_counts().idxmax()
        count = int(self.df["label"].value_counts().max())
        return {"most_frequent_crop": most_frequent, "count": count}

    def get_average_rainfall(self) -> dict:
        if self.df.empty or "rainfall" not in self.df.columns:
            return {"error": "Dataset empty or rainfall column missing"}
        avg_rain = float(self.df["rainfall"].mean())
        return {"average_rainfall_mm": round(avg_rain, 2)}

    def get_feature_impact(self) -> dict:
        """Simple analysis of standard deviation to see which feature varies the most."""
        if self.df.empty:
            return {"error": "Dataset empty"}
        
        numeric_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        available_cols = [col for col in numeric_cols if col in self.df.columns]
        
        if not available_cols:
            return {"error": "No numeric columns found"}
            
        std_devs = self.df[available_cols].std().to_dict()
        max_feature = max(std_devs, key=std_devs.get)
        
        return {
            "most_variable_feature": max_feature,
            "variance_explanation": f"{max_feature} has the highest variance ({round(std_devs[max_feature], 2)}), meaning it differs most significantly across different crops."
        }

    def get_crops_by_condition(self, condition_type: str, threshold: float) -> dict:
        """Find crops suitable for a specific condition (e.g., rainfall > 200)."""
        if self.df.empty:
            return {"error": "Dataset empty"}
            
        # condition_type e.g. "high_rainfall", "high_humidity", "low_ph"
        # We'll map them dynamically or just expect a column and operator
        
        col_map = {
            "humidity": "humidity",
            "rainfall": "rainfall",
            "temperature": "temperature",
            "ph": "ph",
            "n": "N",
            "p": "P",
            "k": "K"
        }
        
        # very simple filtering for demonstration
        col = condition_type.lower()
        actual_col = col_map.get(col, col)
        
        if actual_col not in self.df.columns:
            return {"error": f"Column {actual_col} not found in dataset."}
            
        # Example: we want crops where this value is >= threshold
        filtered = self.df[self.df[actual_col] >= threshold]
        crops = filtered["label"].unique().tolist()
        
        return {
            "condition": f"{actual_col} >= {threshold}",
            "matching_crops": crops
        }

    def get_trends(self) -> dict:
        """Returns average values for top crops to show a trend."""
        if self.df.empty or "label" not in self.df.columns:
             return {"error": "Dataset empty"}
             
        # Group by label and get means for N, P, K
        cols_to_mean = [c for c in ["N", "P", "K"] if c in self.df.columns]
        if not cols_to_mean:
            return {"error": "No trend columns found"}
            
        trends = self.df.groupby("label")[cols_to_mean].mean().head(5).to_dict(orient="index")
        return {"trends": trends}
        
    def execute_query(self, query_type: str, params: dict = None) -> dict:
        """Router for analytics queries."""
        if query_type == "count":
            return self.get_total_records()
        elif query_type == "frequent_crop":
            return self.get_most_frequent_crop()
        elif query_type == "average_rainfall":
            return self.get_average_rainfall()
        elif query_type == "feature_impact":
            return self.get_feature_impact()
        elif query_type == "filter_condition":
            if not params or "feature" not in params or "threshold" not in params:
                return {"error": "Missing parameters 'feature' or 'threshold'"}
            return self.get_crops_by_condition(params["feature"], float(params["threshold"]))
        elif query_type == "trends":
            return self.get_trends()
        else:
            return {"error": f"Unknown query type: {query_type}"}
