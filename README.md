# DevTest 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-MVP%20Ready-success)]()

> **iOS & Android app analysis platform** — Upload app binaries (IPA, APK) and get instant insights on metadata, security, performance, and health scores.

## ✨ Key Features

### 🔍 Multi-Format Analysis
- **iOS:** `.ipa`, `.app`, `.xcarchive`, `.dSYM`
- **Android:** `.apk`, `.aab`
- Metadata extraction, security scanning, dependency analysis

### 📊 Health Score System
- Automated scoring (0-100) based on best practices
- Risk level assessment (Low/Medium/High)
- Security findings & recommendations
- Performance insights

### 💻 Developer-First Experience
- **One-click startup** — `start.bat` on Windows
- Drag & drop file upload
- Real-time processing status
- Beautiful, responsive UI
- Zero configuration needed

### 💰 SaaS Ready
- Free tier: IPA/APK unlimited, others 2/month
- Pro ($2.99/mo): Unlimited all formats, 50K crashes/month
- Plus ($9.99/mo): 250K crashes, performance monitoring
- Stripe integration built-in

## 🚀 Quick Start

### Windows (One-Click! 👇)
```bash
start.bat
```
✓ Auto-installs dependencies
✓ Auto-builds frontend & backend
✓ Opens http://localhost:3001 in browser
✓ Ready to use!

### Mac/Linux
```bash
chmod +x start.sh
./start.sh
```

### Manual Setup
```bash
# Prerequisites: Node.js 18+, Docker

# 1. Start database
pnpm docker:up

# 2. Install all deps
pnpm install

# 3. Setup backend
cd backend
cp .env.example .env
pnpm db:migrate

# 4. Run development servers
cd ..
pnpm dev
```

**Access:** http://localhost:3001

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Queue** | Bull (Redis) |
| **Storage** | AWS S3 / Cloudflare R2 |
| **Auth** | JWT + bcrypt |
| **Payments** | Stripe |
| **Deployment** | Railway, Vercel, Docker |

## 📁 Project Structure

```
devtest/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   │   ├── analyzers/    # IPA/APK parsers
│   │   │   ├── queue.service.ts
│   │   │   └── report.generator.ts
│   │   ├── routes/       # API endpoints
│   │   └── middleware/   # Auth, errors
│   └── prisma/
│
├── frontend/             # React SPA
│   └── src/
│       ├── pages/        # Landing, Dashboard, Reports
│       ├── components/   # FileUpload, ReportViewer
│       ├── api/          # API client
│       └── stores/       # Zustand state
│
├── start.bat / start.sh  # One-click startup
└── docker-compose.yml    # Local dev environment
```

## 🔌 API Overview

```
Authentication
├── POST   /api/auth/register
├── POST   /api/auth/login
└── POST   /api/auth/logout

Analyses
├── POST   /api/analyses/upload
├── GET    /api/analyses
├── GET    /api/analyses/:id
└── DELETE /api/analyses/:id

Reports
├── GET    /api/reports/:id
├── GET    /api/reports/:id/pdf
└── POST   /api/reports/:id/share

Billing
├── POST   /api/billing/checkout
└── POST   /api/billing/webhook
```

See [SETUP.md](SETUP.md) for full API documentation.

## 🧪 Test Drive

1. **Register:** Create account with any email
2. **Upload:** Drag & drop an `.ipa` or `.apk` file
3. **Analyze:** Wait 30-60 seconds for report
4. **Explore:** View health score, security findings, dependencies
5. **Share:** Copy public link to share with team

## 🚢 Deployment

### One-Command Deploy
```bash
# Railway (Backend)
railway up

# Vercel (Frontend)
vercel --prod
```

### Docker
```bash
docker-compose up -d
```

See [SETUP.md](SETUP.md) for detailed deployment guide.

## 🔐 Security

- ✅ JWT authentication + refresh tokens
- ✅ bcrypt password hashing
- ✅ CORS + Helmet.js
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma)
- ✅ Rate limiting on API
- ✅ File upload validation
- ✅ HTTPS ready

## 📈 Performance Targets

| Metric | Target |
|--------|--------|
| API Response | < 1 second |
| File Upload (50MB) | < 30 seconds |
| Analysis Processing | 30-60 seconds |
| Report Generation | < 5 seconds |
| Page Load | < 3 seconds |

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** — 30-second setup guide
- **[SETUP.md](SETUP.md)** — Detailed configuration & API docs
- **[MARKET_ANALYSIS_REPORT.md](MARKET_ANALYSIS_REPORT.md)** — Market research & strategy

## 🤝 Contributing

Contributions welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/your-feature`)
5. Open Pull Request

## 📝 License

MIT License — see [LICENSE](LICENSE) file.

## 🗺️ Roadmap

- [ ] PDF export
- [ ] Shareable links
- [ ] Email notifications
- [ ] Team features
- [ ] CI/CD integrations
- [ ] Advanced security scanning
- [ ] Mobile apps

## 📞 Get Help

- 📧 Email: omerde971@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/omerde971-cloud/devtest/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/omerde971-cloud/devtest/discussions)

---

**Built with ❤️ by DevTest Team**

⭐ **Star us on GitHub!**
