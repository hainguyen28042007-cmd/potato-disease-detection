FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir \
        fastapi==0.142.2 \
        uvicorn==0.54.0 \
        numpy==1.26.4 \
        pillow==10.4.0 \
        python-multipart==0.0.20 \
        tensorflow==2.16.2

COPY api ./api
COPY training/potato_model.keras ./training/potato_model.keras

WORKDIR /app/api

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
