from fastapi import FastAPI, File, UploadFile, HTTPException
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
import io
import os

app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = tf.keras.models.load_model("model.keras") 

# Food classes
food_classes = [
    "burger", "butter_naan", "chai", "chapati", "chole_bhature",
    "dal_makhani", "dhokla", "fried_rice", "idli", "jalebi",
    "kaathi_rolls", "kadai_paneer", "kulfi", "masala_dosa", "momos",
    "paani_puri", "pakode", "pav_bhaji", "pizza", "samosa"
]

# Directory to save uploaded images
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Stores classification results
classified_results = {}

# Example nutrition values (make sure this matches the food_classes list)
nutrition_values = {
    "burger": {"Calories": 354, "Protein": 17, "Carbs": 30, "Fat": 15},
    "butter_naan": {"Calories": 260, "Protein": 7, "Carbs": 35, "Fat": 10},
    "chai": {"Calories": 120, "Protein": 4, "Carbs": 20, "Fat": 5},
    "chapati": {"Calories": 70, "Protein": 3, "Carbs": 15, "Fat": 1},
    "chole_bhature": {"Calories": 450, "Protein": 12, "Carbs": 50, "Fat": 18},
    "dal_makhani": {"Calories": 320, "Protein": 14, "Carbs": 35, "Fat": 20},
    "dhokla": {"Calories": 150, "Protein": 6, "Carbs": 20, "Fat": 4},
    "fried_rice": {"Calories": 280, "Protein": 6, "Carbs": 40, "Fat": 10},
    "idli": {"Calories": 39, "Protein": 2, "Carbs": 10, "Fat": 0.5},
    "jalebi": {"Calories": 150, "Protein": 1, "Carbs": 30, "Fat": 8},
    "kaathi_rolls": {"Calories": 380, "Protein": 15, "Carbs": 40, "Fat": 20},
    "kadai_paneer": {"Calories": 360, "Protein": 14, "Carbs": 30, "Fat": 25},
    "kulfi": {"Calories": 200, "Protein": 5, "Carbs": 20, "Fat": 10},
    "masala_dosa": {"Calories": 250, "Protein": 5, "Carbs": 35, "Fat": 10},
    "momos": {"Calories": 45, "Protein": 2, "Carbs": 10, "Fat": 1},
    "paani_puri": {"Calories": 180, "Protein": 3, "Carbs": 25, "Fat": 6},
    "pakode": {"Calories": 250, "Protein": 4, "Carbs": 20, "Fat": 15},
    "pav_bhaji": {"Calories": 400, "Protein": 8, "Carbs": 50, "Fat": 18},
    "pizza": {"Calories": 285, "Protein": 12, "Carbs": 35, "Fat": 10},
    "samosa": {"Calories": 260, "Protein": 5, "Carbs": 30, "Fat": 16},
}

# Define preprocessing function
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((256, 256))  
    image_array = np.array(image)  
    image_array = np.expand_dims(image_array, axis=0)  
    return image_array.astype(np.float32)  

@app.post("/predict/")
async def predict_food(file: UploadFile = File(...)):
    try:
        # Read image bytes
        image_bytes = await file.read()

        # Save the uploaded image
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(image_bytes)

        # Preprocess the image
        processed_image = preprocess_image(image_bytes)

        # Get model predictions
        predictions = model.predict(processed_image)[0]
        predicted_class_idx = np.argmax(predictions)  
        confidence = float(predictions[predicted_class_idx])  # Confidence score (0-1 range)
        food_name = food_classes[predicted_class_idx]

        # Convert confidence to percentage (0-100%)
        confidence_percentage = round(confidence * 100, 2)

        # Get nutritional values for the predicted food
        nutrition = nutrition_values.get(food_name, {})

        # Store classification result
        classified_results[file.filename] = {
            "food_name": food_name,
            "confidence": confidence_percentage,  
            "nutritional_value": nutrition
        }

        return classified_results[file.filename]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/classify/")
async def classify_food(data: dict):
    """Fetch stored classification result using image name."""
    image_name = data.get("image_name")

    if not image_name or image_name not in classified_results:
        raise HTTPException(status_code=404, detail="Classification result not found.")

    return classified_results[image_name]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
