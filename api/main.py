from io import BytesIO
from pathlib import Path

import numpy as np
import tensorflow as tf
import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image

MODEL_PATH = Path(__file__).resolve().parent.parent / "training" / "potato_model.keras"
CLASS_NAMES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
]

app = FastAPI()
STATIC_DIR = Path(__file__).resolve().parent / "static"

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", include_in_schema=False)
async def home():
    return FileResponse(STATIC_DIR / "index.html")


try:
    model = tf.keras.models.load_model(str(MODEL_PATH))
except Exception as exc:
    model = None
    model_load_error = exc
else:
    model_load_error = None



@app.get("/ping")
async def ping():
    return {"message": "Hello"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(
            status_code=500,
            detail=f"Model could not be loaded: {model_load_error}",
        )

    if not file.filename or not file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".bmp")):
        raise HTTPException(status_code=400, detail="Please upload an image file.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {exc}") from exc

    image_array = np.asarray(image, dtype=np.float32)
    if image_array.ndim == 2:
        image_array = np.repeat(image_array[:, :, None], 3, axis=2)

    image_array = tf.image.resize(image_array[None, ...], size=(256, 256))

    probabilities = model.predict(image_array, verbose=0)[0]
    predicted_index = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_index])

    return {
        "predicted_class": CLASS_NAMES[predicted_index],
        "confidence": round(confidence, 4),
        "probabilities": {
            class_name: round(float(probability), 4)
            for class_name, probability in zip(CLASS_NAMES, probabilities)
        },
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)