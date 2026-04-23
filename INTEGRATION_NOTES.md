# NutriLens — Integration Notes

## Phase 2 Backend Decisions (2026-04-24)

### 2.1 — Baseline Verification
- venv shebang was pointing to old `Nutrilens-Backend-main/venv` path (project was reorganized). Recreated with `python3 -m venv venv --clear`.
- All 5 checks passed: uvicorn starts, health check OK, register/login/protected endpoint all functional.

### 2.2 — CORS
- Already present in `main.py` from previous session: `allow_origins=["http://localhost:5173"]`, `allow_credentials=True`.
- Verified with `OPTIONS` preflight: `Access-Control-Allow-Origin: http://localhost:5173` ✓

### 2.3 — Dual Login
- **Decision:** `/auth/login` now accepts `{email, password}` JSON (frontend path). OAuth2 form moved to `/auth/token`.
- **Why:** Frontend sends JSON; keeping OAuth2 at `/auth/token` preserves the FastAPI `/docs` "Authorize" button without changing the frontend-facing contract.
- `OAuth2PasswordBearer(tokenUrl="auth/token")` updated accordingly.
- Both variants return `{access_token, token_type: "bearer"}` — shape unchanged.

### 2.4 — GET /auth/me
- Returns full 9-column profile + `health_conditions: list[str]` derived from the three booleans.
- Mapping: `is_diabetic → "diabetes"`, `is_hypertensive → "hypertension"`, `is_kidney_disease → "kidney_disease"`.
- Helper `_build_health_conditions()` shared by `/me`, `/profile` responses — single source of truth.

### 2.5 — PUT /auth/profile
- Accepts partial `UserUpdate` body; `crud.update_user` (already existed) handles partial updates via `model_dump(exclude_none=True)`.
- Response shape mirrors `/me` (includes `health_conditions` array).
- `birth_date` validator (1900-01-01 ≤ date ≤ today) exists on both `UserCreate` and `UserUpdate` in `schemas.py`.
- `TODO` comment for Mifflin-St Jeor in `models.py` (goals remain static defaults).

### 2.6 — PUT /auth/password
- Verifies `current_password` against bcrypt hash before updating.
- Wrong current password → 401.
- Success → `{success: true, message: "..."}`.

### 2.7 — GET /meals/weekly-summary
- Returns exactly 7 items (last 7 days, oldest first).
- Days with no meals return zeros — no skipping.
- **Route order note:** `/weekly-summary` registered BEFORE `/{meal_id}` in meals router to prevent FastAPI treating "weekly-summary" as a meal ID.

### 2.8 — Test Suite
- `conftest.py`: removed stale `is_high_cholesterol` / `is_celiac` fields; `auth_headers` fixture updated to use JSON login.
- `test_auth.py`: fully rewritten — covers JSON login, OAuth2 form login, `/me`, `/profile` (partial update, health_conditions derivation, birth_date validation), `/password` (wrong + correct).
- `test_meals.py`: added `test_weekly_summary_empty`, `test_weekly_summary_with_meal`, `test_weekly_summary_unauthorized`.
- **Bug fixed:** `Meal.created_at` was `server_default=func.now()` only. In SQLite tests, the Python ORM did not set the value before INSERT, leaving `created_at=NULL`. Date filters then found 0 meals. Fix: added `default=datetime.now` (local time, consistent with `date.today()` used in filters). `server_default` kept as DB-level fallback.
- Final result: **34/34 tests pass**.

## Endpoints Live After Phase 2

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/` | No | Health check |
| POST | `/auth/register` | No | JSON body |
| POST | `/auth/login` | No | JSON `{email, password}` — frontend path |
| POST | `/auth/token` | No | OAuth2 form — for /docs |
| GET | `/auth/me` | Bearer | Full profile + health_conditions |
| PUT | `/auth/profile` | Bearer | Partial update |
| PUT | `/auth/password` | Bearer | `{current_password, new_password}` |
| GET | `/meals/` | Bearer | List with optional date filter |
| POST | `/meals/` | Bearer | Create meal |
| GET | `/meals/summary` | Bearer | Daily totals |
| GET | `/meals/weekly-summary` | Bearer | 7-day array |
| DELETE | `/meals/{id}` | Bearer | Delete own meal |
| POST | `/analyze/text` | Bearer | Text food analysis |
| POST | `/analyze/image` | Bearer | Image food analysis |
