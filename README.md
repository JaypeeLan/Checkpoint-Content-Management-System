# EduCMS Monorepo

EduCMS is an educational CMS with a Node.js/Express backend and a React + TypeScript admin frontend.

## Workspaces
- `backend`: REST API, auth/RBAC, Redis cache, Elasticsearch, S3 upload, Socket.IO, Swagger, analytics.
- `frontend`: TypeScript React admin panel (Vite + MUI).

## Quick Start
1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Deployment
- Frontend: Vercel
- Backend: Render

Use `ENV_VARS.md` for exact env variable setup.
