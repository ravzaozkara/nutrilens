# NutriLens

A food-tracking web app for Turkish cuisine. Users photograph a meal, get an AI-generated nutritional breakdown, log it, and see daily/weekly summaries. Health warnings are surfaced for users with diabetes, hypertension, or kidney disease.

**Team:** N. Ravza Özkara

## Tech stack

- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2, Alembic, bcrypt, python-jose (JWT), slowapi
- **Frontend:** React 18, Vite, Tailwind CSS, react-hook-form + Zod, axios, react-hot-toast
- **Database:** PostgreSQL 15 (Docker) or local install; SQLite for tests
- **AI model:** EfficientNet-B0 (`.pt` file not included — falls back to simulation mode automatically)

## Prerequisites

- Python 3.12+
- Node 20+
- PostgreSQL 14+ (or Docker for the included `docker-compose.yml`)

## Setup from scratch

### 1. Database

```bash
# Option A — Docker (recommended)
cd backend
docker-compose up -d db

# Option B — local Postgres
createdb nutrilens
```

### 2. Backend

```bash
cd backend

# Create venv and install deps
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env:
#   DATABASE_URL — point to your Postgres instance
#   SECRET_KEY   — generate with: python -c "import secrets; print(secrets.token_urlsafe(48))"

# Run migrations
alembic upgrade head

# (Optional) seed 30 Turkish foods
curl -X GET http://localhost:8000/setup-database
```

### 3. Frontend

```bash
cd frontend
npm install

# Optional — only needed if backend is not on localhost:8000
cp .env.example .env
# Edit VITE_API_URL if needed
```

## Running in development

```bash
# Terminal 1 — backend (from backend/)
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 — frontend (from frontend/)
npm run dev
```

Frontend: http://localhost:5173  
Backend API docs: http://localhost:8000/docs

## Running tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

Expected: **34 passed**. Tests use an in-memory SQLite database; no Postgres required.

## Known limitations

- **AI model in simulation mode:** `model/food_model.pt` is not included in the repo. The backend falls back to `_simulate_prediction()`, which returns a random food label with random confidence. Results are plausible-looking but not real predictions.
- **Edit meal:** `PUT /meals/{id}` backend endpoint is not implemented. Portion edits in the UI are optimistic-local only and reset on refresh.
- **Delete account:** `DELETE /auth/me` backend endpoint is not implemented. The "Hesabı Sil" button in Profile shows a stub modal that does nothing.
- **Nutrition goals:** Daily calorie/macro goals are static defaults set at registration. Mifflin-St Jeor BMR-based calculation is deferred.
- **Weekly summary zero-days:** Days with no meals are included in the 7-day chart as zeros, but they show weekday labels derived from UTC date parsing — local timezone offset may shift labels by one day near midnight.

## Internal history

See [INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md) for phase-by-phase integration decisions, endpoint table, field mapping reference, and the Phase 6 verification checklist.
