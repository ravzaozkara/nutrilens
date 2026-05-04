FROM python:3.12-slim

WORKDIR /app

# Sistem bağımlılıkları (psycopg2 için)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend kodu
COPY backend/ .

# Uploads klasörünü oluştur
RUN mkdir -p /app/uploads

EXPOSE ${PORT:-8000}

# NOTE: alembic upgrade head was here; removed temporarily because the
# Railway-hosted DB has already been migrated by the previous deploy.
# Re-enable once we're sure new migrations run cleanly.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
