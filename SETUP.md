# DevTest - Development Setup Guide

## Prerequisites

- **Node.js 18+** - Download from https://nodejs.org/
- **pnpm** - `npm install -g pnpm@8`
- **Docker & Docker Compose** - https://www.docker.com/products/docker-desktop
- **Git** - Already initialized ✅

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

This installs all dependencies for both backend and frontend using pnpm workspaces.

### 2. Setup Environment Variables

**Backend:**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://devtest:devtest@localhost:5432/devtest
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key-change-this
REFRESH_SECRET=your-refresh-secret-change-this
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
```

### 3. Start Database & Redis

```bash
pnpm docker:up
```

This starts PostgreSQL and Redis containers using Docker Compose.

### 4. Setup Database

```bash
cd backend
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run migrations
cd ..
```

### 5. Start Development Servers

**Option A: Both servers in one command (concurrent)**
```bash
pnpm dev
```

**Option B: Separate terminals**

Terminal 1 (Backend - http://localhost:3001):
```bash
pnpm --filter backend dev
```

Terminal 2 (Frontend - http://localhost:5173):
```bash
pnpm --filter frontend dev
```

## Project Structure

```
devtest/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── routes/         # API routes
│   │   ├── db/             # Database (Prisma)
│   │   └── types/          # TypeScript types
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── frontend/                # React + TypeScript SPA
│   ├── src/
│   │   ├── pages/          # Route components
│   │   ├── components/     # Reusable UI
│   │   ├── api/            # API client
│   │   ├── stores/         # Zustand state
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml      # PostgreSQL + Redis
├── pnpm-workspace.yaml     # Monorepo config
└── package.json            # Root scripts

```

## Development Commands

```bash
# Development
pnpm dev                           # Start both servers

# Building
pnpm build                         # Build both packages

# Linting
pnpm lint                          # Lint all packages
pnpm lint:fix                      # Fix linting issues

# Testing
pnpm test                          # Run tests

# Database
pnpm db:setup                      # Generate + migrate
cd backend && pnpm db:migrate      # Run Prisma migrations
cd backend && pnpm db:generate     # Generate Prisma client

# Docker
pnpm docker:up                     # Start containers
pnpm docker:down                   # Stop containers
```

## API Endpoints (Phase 1)

### Authentication

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Response
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "username": "testuser"
  },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Health Check

```bash
curl http://localhost:3001/health
```

## GitHub Setup (Next Step)

When ready to push to GitHub:

```bash
# 1. Create a new repository on GitHub (don't initialize with README)

# 2. Add remote
git remote add origin https://github.com/YOUR_USERNAME/devtest.git

# 3. Push initial code
git branch -M main
git push -u origin main
```

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is in use:
```bash
# Find process using port 3001
lsof -i :3001

# Kill process (macOS/Linux)
kill -9 <PID>

# Or change port in backend/.env
PORT=3002
```

### Database Connection Error

```bash
# Check if containers are running
docker ps

# View Docker logs
docker logs <container_id>

# Restart containers
pnpm docker:down
pnpm docker:up
```

### Prisma Migration Issues

```bash
# Reset database (⚠️ deletes all data)
cd backend && pnpm prisma migrate reset

# Generate Prisma client
pnpm db:generate
```

## Phase 1: Authentication (Current)

**Status:** ✅ Setup complete
**Todo:**
- [ ] Implement register & login endpoints (auth.controller.ts)
- [ ] Test auth flows with API client
- [ ] Create login/register pages (frontend)
- [ ] Setup protected routes
- [ ] Add email verification (optional for MVP)

**Estimated time:** 1-2 weeks

## Next Steps

1. **Frontend Auth Pages** → Login, Register, Password Reset
2. **File Upload Handler** → IPA/APK upload endpoint
3. **iOS Analysis Engine** → IPA parser implementation
4. **Android Analysis Engine** → APK parser implementation

---

## Notes

- This is a development setup. For production, use proper hosting (Railway, Vercel, AWS).
- Never commit `.env` files - use `.env.example` for reference
- Database migrations are version-controlled in `prisma/migrations/`
- TypeScript strict mode is enabled
- ESLint and Prettier for code quality

---

For questions, check `/plans/joyful-coalescing-pie.md` for the implementation plan.
