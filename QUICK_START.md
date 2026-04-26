# DevTest - Quick Start Guide

## ⚡ 30-Second Setup

### **Windows Users:**
1. Double-click `start.bat`
2. Wait for "DevTest server running on http://localhost:3001"
3. Browser opens automatically
4. Done! 🎉

### **Mac/Linux Users:**
```bash
chmod +x start.sh
./start.sh
```

---

## 📋 Manual Setup (if needed)

### **Step 1: Prerequisites**
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Docker (for PostgreSQL + Redis)

### **Step 2: Start Database**
```bash
# Terminal 1
pnpm docker:up

# Wait for containers to start (~30 seconds)
```

### **Step 3: Setup Backend**
```bash
# Terminal 2
cd backend
cp .env.example .env

# Update .env with your settings:
# DATABASE_URL=postgresql://devtest:devtest@localhost:5432/devtest
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=your-secret-key
# etc.

pnpm install
pnpm db:generate
pnpm db:migrate
```

### **Step 4: Build & Start**
```bash
# From root directory
pnpm --filter frontend build
pnpm --filter backend build

cd backend
node dist/index.js
```

**App opens at:** http://localhost:3001

---

## 🧪 Test Account

Use any email/password to register:
- Email: `test@example.com`
- Password: `password123`

---

## 🚀 Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://devtest:devtest@localhost:5432/devtest
REDIS_URL=redis://localhost:6379

# Server
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:3001

# Auth
JWT_SECRET=your-super-secret-key-here
REFRESH_SECRET=your-refresh-secret-here

# Stripe (optional for testing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Storage (optional for file upload)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=devtest-uploads
```

---

## 📊 Available Endpoints

**Public:**
- `GET /` - Landing page
- `GET /login` - Login
- `GET /register` - Register
- `GET /pricing` - Pricing page

**Protected (need login):**
- `GET /dashboard` - Main dashboard
- `POST /api/analyses/upload` - Upload app file
- `GET /api/analyses` - List analyses
- `GET /api/analyses/:id` - Get analysis report
- `GET /reports/:id` - View report detail

**Admin:**
- `GET /health` - API health check

---

## 🐛 Troubleshooting

**Port 3001 already in use?**
```bash
# Change port in backend/.env
PORT=3002
```

**Database connection error?**
```bash
# Check if Docker containers are running
docker ps

# Restart containers
pnpm docker:down
pnpm docker:up
```

**Frontend not building?**
```bash
# Clear cache and rebuild
rm -rf frontend/dist frontend/node_modules
pnpm --filter frontend install
pnpm --filter frontend build
```

---

## 📱 Features to Test

1. **Register & Login**
   - Create account
   - Login with email/password
   - JWT token stored in localStorage

2. **Upload Analysis**
   - Drag & drop file
   - File validation (format, size)
   - Status tracking (queued → processing → completed)

3. **View Reports**
   - Click analysis to open report
   - See health score (0-100)
   - View metadata, security, dependencies tabs

4. **Pricing**
   - View pricing page
   - See Free/Pro/Plus plans
   - Stripe checkout (test mode)

5. **Logout**
   - Click profile → Logout
   - Redirects to landing page

---

## 🎯 Next Steps

1. **Get Test Files:**
   - Download sample .ipa from Apple Developer
   - Download sample .apk from Android samples
   - Upload to DevTest to test analysis

2. **Configure Stripe:**
   - Get test API keys from stripe.com
   - Add to backend/.env
   - Test subscription flow

3. **Deploy:**
   - Railway (backend)
   - Vercel (frontend)
   - Supabase (PostgreSQL)
   - Upstash (Redis)

4. **Polish:**
   - Add PDF export
   - Implement share links
   - Email notifications

---

## 📞 Support

- GitHub: https://github.com/omerde971-cloud/devtest
- Issues: Create an issue on GitHub
- Docs: See SETUP.md and MARKET_ANALYSIS_REPORT.md

Happy testing! 🚀
