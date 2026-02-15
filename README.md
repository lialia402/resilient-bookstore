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

API runs at **http://localhost:5000**.

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
│   ├── app.py              # Flask app entry
│   ├── requirements.txt
│   └── (data, routes TBD)
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
