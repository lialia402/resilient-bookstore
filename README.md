# Resilient Bookstore

MVP bookstore demonstrating **server state management** with TanStack Query (React Query): async data lifecycles, cache sync, and optimistic UI.

## Tech Stack

| Layer    | Choice                |
| -------- | --------------------- |
| Frontend | React 18 + TypeScript (Strict Mode), TanStack Query |
| Backend  | Python Flask          |
| Data     | In-memory / JSON (TBD)|

**Code style:** Prefer modern patterns — React components and hooks use `export const Name = () => ...` (arrow functions), not `export function Name()`.

## Setup

### Backend (Flask)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

API runs at **http://localhost:5000**. Books are loaded from `backend/data/books.json`. To (re)generate 100+ books (overwrites `books.json`):

```bash
cd backend
python scripts/seed_books.py
```

**Endpoints:** `GET /books` (paginated: `?cursor=&limit=&q=&author=`), `GET /books/<id>`, `POST /books/<id>/favorite`, `GET /cart`, `POST /cart/items`, `POST /cart/clear`, `POST /cart/discount`.  
**Discount codes (for testing):** `SAVE10` (10% off), `SAVE20` (20% off), `FLAT5` ($5 off).

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. API requests are proxied from `/api` to `http://localhost:5000`.

### Quick check

- Backend: open http://localhost:5000/health → `{"status":"ok"}`
- Frontend: open http://localhost:5173 → "Resilient Bookstore" skeleton

## Project structure

```
resilient-bookstore/
├── backend/
│   ├── app.py              # Flask routes
│   ├── data_store.py       # Books, favorites, cart (in-memory)
│   ├── data/books.json     # Book catalog
│   ├── scripts/seed_books.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/            # Client + book/cart fetchers, types
│   │   ├── components/     # UI components
│   │   ├── context/        # SearchParamsProvider
│   │   ├── hooks/          # React Query + custom hooks
│   │   ├── queryKeys.ts
│   │   ├── queryClient.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── ARCHITECTURE.md         # Cache, optimistic flows, re-render, query keys
├── README.md
└── TASKS.md
```

## Environment

No environment variables are required for local development. The frontend dev server proxies `/api` to `http://localhost:5000` (see `frontend/vite.config.ts`). Ensure the backend is running on that port before using the app.

## Architecture & decisions

See **ARCHITECTURE.md** for cache strategy (staleTime/gcTime), optimistic favorite and clear-cart flows, re-render prevention and verification, conditional discount fetch, query key design, and the definition of “currently visible” for the inventory value widget.
