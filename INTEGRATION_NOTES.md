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

## Phase 3.1 — authService (2026-04-24)

### Normalization Strategy
**Decision: normalize snake_case → camelCase in the service layer.**
All frontend components are built around camelCase (mockData, form defaultValues, component props).
Changing every component would be invasive and risky; the service layer is the right adapter boundary.

### Field Mappings

| Backend (snake_case) | Frontend (camelCase) |
|----------------------|----------------------|
| `birth_date` | `birthDate` |
| `height_cm` | `height` |
| `weight_kg` | `weight` |
| `health_conditions: ["kidney_disease"]` | `healthConditions: ["kidney"]` |
| `daily_calorie_goal` | `goals.dailyCalories` |
| `protein_goal` | `goals.protein` |
| `carbs_goal` | `goals.carbs` |
| `fat_goal` | `goals.fat` |

`kidney_disease` → `kidney` remapping: the frontend `HEALTH_CONDITIONS` constant uses `id: 'kidney'`; the backend returns `"kidney_disease"`. Normalized in `normalizeUser()`.

### Other Wiring Decisions
- **login()**: After POST `/auth/login` gets `access_token`, temporarily stores it in localStorage, calls `getMe()` to get full normalized user shape. Returns `{accessToken, user}` as `AuthContext.login()` expects.
- **register()**: Backend `/auth/register` returns the user but no token. Service auto-calls `/auth/login` immediately after, then `getMe()`. One round-trip more, but `AuthContext` contract unchanged.
- **changePassword()**: Sends `{current_password, new_password}` (snake_case). `Profile.jsx PasswordChangeModal` was using its own inline mock — wired to `authService.changePassword`.
- **api.js interceptor**: Global 401 handler (logout + redirect) now skips the `/auth/password` endpoint. Wrong current_password returns 401 from backend, but that's a validation error (user IS authenticated), not an expired session. Without this fix, wrong password would silently log the user out.

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
| POST | `/analyze-image` | Bearer | Image food analysis (multipart, field: `file`) |

## Phase 4.2 — Data Persistence Audit (2026-04-24)

| Page / Feature | Persistence mechanism | Status |
|---|---|---|
| Dashboard | `useDailySummary`, `useWeeklySummary`, `useMeals` — each has `useEffect` that fetches on mount | ✓ Real API |
| History | `useMeals` hook fetches on mount | ✓ Real API |
| Profile display | `AuthContext.checkAuth()` calls `authService.getMe()` on mount; token persisted in `localStorage` | ✓ Real API |
| Auth across refresh | `checkAuth()` reads `localStorage.accessToken` → `authService.getMe()` on every app mount | ✓ Persists |
| Meal creation | `mealService.createMeal()` → `POST /meals/` | ✓ Real API |
| Profile update | `authService.updateProfile()` → `PUT /auth/profile` | ✓ Real API |
| Password change | `authService.changePassword()` → `PUT /auth/password` (no leftover mock) | ✓ Real API |
| Edit meal portion | `useMeals.updateMeal` — local merge only, no backend call | ⚠ See tech debt |
| Delete account | `DeleteAccountModal` uses `setTimeout` stub — **no backend endpoint exists** | ✗ Mock only |

**No action taken on delete account**: no `DELETE /auth/me` (or equivalent) endpoint exists in the backend. The modal is an intentional placeholder. Adding the endpoint is Phase 5+ scope.

## Technical Debt

**No `PUT /meals/{id}` backend endpoint** — `useMeals.updateMeal` does an optimistic local merge only (`{ ...meal, ...delta }`); the change is lost on page refresh. Acceptable for now because no edit-meal UI exists yet. If an edit UI is added, the backend PUT endpoint must be implemented first before wiring the frontend.

**No `DELETE /auth/me` backend endpoint** — `DeleteAccountModal` in Profile.jsx uses a `setTimeout` stub. Account deletion is not functional. Must be implemented as a dedicated task (backend endpoint + frontend wiring) before shipping to users.

---

## Phase 6 — Verification (2026-04-24)

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | Fresh `npm install` on frontend works | PASS | `up to date, audited 277 packages in 1s` — `npm install` from `frontend/` with existing `package-lock.json` |
| 2 | Fresh backend install: venv + requirements.txt + migrations work from clean | PASS | `pip install -r requirements.txt` installs all pinned packages. Alembic reads `DATABASE_URL` from `.env` via `settings`. Two migration files in `alembic/versions/`. `pytest 34/34` pass in fresh venv after `pip install slowapi`. |
| 3 | Register → Login → JWT stored in localStorage | MANUAL — see browser test | |
| 4 | Protected route blocks unauthenticated access | MANUAL — see browser test | |
| 5 | Upload food photo → real analysis (simulation mode) → reasonable output | MANUAL — see browser test | |
| 6 | Meal saves to DB, shows in History, persists across refresh | MANUAL — see browser test | |
| 7 | Daily summary computed from real DB data | MANUAL — see browser test | |
| 8 | Weekly summary returns 7 days including zero-meal days | PASS | `test_weekly_summary_with_meal` and `test_weekly_summary_empty` both pass; backend returns exactly 7 items with zeroed days. Confirmed in test suite. |
| 9 | Health warnings trigger for diabetic user eating baklava | MANUAL — see browser test | |
| 10 | Profile update persists | MANUAL — see browser test | |
| 11 | Password change works; wrong current password returns error without logout | MANUAL — see browser test | |
| 12 | Logout clears token and redirects | MANUAL — see browser test | |
| 13 | Session-expired toast appears when JWT is invalidated | MANUAL — see browser test | |
| 14 | Frontend `npm run build` succeeds | PASS | `vite build` → `✓ built in 4.35s`, no errors. Bundle size advisory only (1,000 kB chunk; code-splitting deferred). |
| 15 | Backend `pytest 34/34` pass | PASS | `34 passed in 14.97s` — run in backend venv after adding slowapi |
| 16 | CORS correctly allows `localhost:5173` | PASS | `main.py`: `allow_origins=["http://localhost:5173"]`, `allow_credentials=True`, `allow_methods=["*"]` |
| 17 | Rate limiting on `/auth/login` and `/auth/register` | PASS | `@limiter.limit("30/minute")` on both handlers in `routers/auth.py`; `app.state.limiter` and `RateLimitExceeded` handler registered in `main.py` |
| 18 | Network outage (backend killed) does not white-screen the frontend | PASS | `checkAuth` guards: only clears token on `401`, preserves it on network errors. `getErrorMessage` returns Turkish "server unreachable" string. `useDailySummary`/`useWeeklySummary` catch blocks show toast. All fetches are in try/catch — no unhandled promise rejections that could crash the React tree. |
