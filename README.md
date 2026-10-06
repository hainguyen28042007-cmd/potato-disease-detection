# PotatoCare

Smart plant health monitoring for potato growers, powered by AI.

PotatoCare is a lightweight computer vision project that helps identify common potato leaf diseases from a single photo. By combining a trained deep learning model with a simple web interface, the system can quickly classify an image as early blight, late blight, or healthy, giving growers a fast, affordable way to detect crop issues before they spread.

## Why this project matters

Potato diseases can reduce yield and threaten food security when they are not detected early. Traditional inspection relies on manual observation, which is time-consuming and often inconsistent. PotatoCare brings AI-assisted disease detection to the field and the farm office, enabling farmers, agronomists, and agricultural teams to:

- detect plant stress from leaf images in seconds
- reduce crop losses through early intervention
- make faster, more informed field decisions
- improve accessibility for small and medium growers

## Key features

- AI-powered classification of potato leaf health
- Detects three classes:
  - Potato___Early_blight
  - Potato___Late_blight
  - Potato___healthy
- FastAPI backend for image upload and prediction
- Browser-based upload interface for easy use
- Confidence scoring for each prediction
- Docker support for quick deployment

## Project overview

This project combines:

- a TensorFlow/Keras model trained for potato leaf disease recognition
- a FastAPI service for serving predictions
- a static web frontend for uploading photos and viewing results

The system accepts an image of a potato leaf, preprocesses it, runs it through the model, and returns the predicted class with a confidence score.

## Tech stack

- Python
- FastAPI
- TensorFlow / Keras
- NumPy
- Pillow
- Uvicorn
- Docker

## Model details

The model is stored at:

- `training/potato_model.keras`

It is designed to classify potato leaf images into the most common disease states and healthy plants.

## Project structure

```text
potato-disease-detection/
├── api/
│   ├── main.py
│   └── static/
│       ├── index.html
│       ├── styles.css
│       └── app.js
├── training/
│   ├── potato_model.keras
│   └── potato training.ipynb
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── README.md
```

## Getting started

### Option 1: Run locally

1. Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```bash
pip install fastapi==0.142.2 uvicorn==0.54.0 numpy==1.26.4 pillow==10.4.0 python-multipart==0.0.20 tensorflow==2.16.2
```

3. Start the API:

```bash
cd api
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

4. Open the app in the browser:

```text
http://127.0.0.1:8000/
```

### Option 2: Run with Docker

```bash
docker-compose up --build
```

Then visit:

```text
http://localhost:8000/
```

## API usage

### Health check

```bash
curl http://127.0.0.1:8000/ping
```

Example response:

```json
{
  "message": "Hello"
}
```

### Prediction endpoint

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/leaf-image.jpg"
```

Example response:

```json
{
  "predicted_class": "Potato___Late_blight",
  "confidence": 0.9824,
  "probabilities": {
    "Potato___Early_blight": 0.0123,
    "Potato___Late_blight": 0.9824,
    "Potato___healthy": 0.0053
  }
}
```

## Use cases

- quick field scouting by farmers
- crop monitoring by agronomy teams
- extension services and agricultural consulting
- educational tools for plant disease recognition
- integration into broader smart farming systems

## Future improvements

- support for more crop diseases and leaf varieties
- mobile-friendly app experience
- model improvement with larger, more diverse datasets
- regional disease severity estimation
- dashboard analytics for farm-level monitoring

## License

This project is currently provided as an open learning and research project. Please review the repository license before production or commercial use.

## Acknowledgements

This project is built around the idea of making AI accessible for agriculture and plant health monitoring. It is designed to help farmers and agronomists act earlier, with more confidence, and with less guesswork.

PotatoCare turns a simple leaf image into actionable insight — making modern crop protection more practical, scalable, and human-centered.
