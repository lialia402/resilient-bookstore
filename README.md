# Resilient Bookstore

MVP bookstore demonstrating **server state management** with TanStack Query (React Query): async data lifecycles, cache sync, and optimistic UI.

## Tech Stack

| Layer    | Choice                |
| -------- | --------------------- |
| Frontend | React 18 + TypeScript (Strict Mode), TanStack Query |
| Backend  | Python Flask          |
| Data     | In-memory / JSON (TBD)|

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

API runs at **http://localhost:5000**. Books are loaded from `backend/data/books.json`.

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
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/            # API client + book/cart fetchers
│   │   ├── components/     # UI components
│   │   ├── hooks/          # React Query hooks
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── TASKS.md               # Task breakdown
```

## Architecture & decisions

Will be documented in **ARCHITECTURE.md** (cache strategy, optimistic updates, re-render prevention, conditional fetching, query keys).
