# Portun.app - Smart Access Control Platform

**Version**: 1.0.0-MVP
**Status**: In Development
**Target Launch**: Q1 2026
**Stack**: Vue 3 + Vite + Vuetify 3 + Supabase

---

## 🎯 Project Overview

Portun.app is an accessible, secure QR-based access control platform for US and Latin American residential communities. We deliver enterprise-grade visitor management and payment tracking at value pricing.

**Mission**: Smart Access, Simple Living
**Positioning**: Best-in-class QR access control with transparent pricing ($2-3/unit/month)

---

## 📚 Documentation Index

All comprehensive documentation is located in `/docs/`:

### Planning & Strategy
1. **[01-competitive-analysis.md](./docs/01-competitive-analysis.md)**
   Deep dive on 5 competitors (Residentfy, Neivor, CondoVive, ComunidadFeliz, Residentia)
   _Read this first to understand the market landscape_

2. **[02-product-requirements.md](./docs/02-product-requirements.md)**
   Complete PRD with 50+ user stories, acceptance criteria, and success metrics
   _Core reference for what we're building_

3. **[11-brand-guidelines.md](./docs/11-brand-guidelines.md)**
   Brand identity, visual guidelines, voice & tone, marketing materials
   _Use this for all design and marketing decisions_

### Technical Architecture
4. **[03-technical-architecture.md](./docs/03-technical-architecture.md)**
   System design, tech stack, data flows, architecture diagrams
   _Start here for understanding the technical stack_

5. **[06-database-schema.md](./docs/06-database-schema.md)**
   Complete PostgreSQL schema with ERD, tables, indexes, RLS policies
   _Database reference for all backend work_

6. **[07-api-specification.md](./docs/07-api-specification.md)**
   REST API, Edge Functions, WebSocket specifications
   _API reference for frontend and mobile integration_

### Current System & Fixes
7. **[04-current-system-audit.md](./docs/04-current-system-audit.md)**
   46 issues identified across security, functionality, performance, technical debt
   _⚠️ Critical: Review before any code changes_

8. **[05-security-fixes-priority.md](./docs/05-security-fixes-priority.md)**
   Prioritized security vulnerabilities with implementation guides
   _🔒 Must fix before public launch_

### Feature Specifications
9. **[08-qr-access-spec.md](./docs/08-qr-access-spec.md)**
   Detailed QR code implementation, validation rules, offline mode
   _Core feature specification_

10. **[09-payment-tracking-spec.md](./docs/09-payment-tracking-spec.md)**
    Manual payment receipt tracking MVP specification
    _Phase 2 feature specification_

### UX & Deployment
11. **[10-user-flows.md](./docs/10-user-flows.md)**
    Complete user journeys for residents, guards, and admins
    _Reference for UX design and testing_

12. **[12-deployment-plan.md](./docs/12-deployment-plan.md)**
    Infrastructure, CI/CD, monitoring, disaster recovery, launch checklist
    _DevOps and deployment reference_

### Multilingual & SEO
13. **[MULTILINGUAL_SEO_IMPLEMENTATION.md](./docs/MULTILINGUAL_SEO_IMPLEMENTATION.md)**
    Complete multilingual implementation guide (EN/ES/PT) with SEO optimization
    _🌍 Full documentation on i18n, hreflang tags, structured data, and Google indexing_

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- VSCode + Volar extension

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Development

```bash
# Start dev server (auto-opens at http://localhost:5173)
pnpm dev

# Run type checking
pnpm typecheck

# Run linter
pnpm lint

# Fix linting issues
pnpm lint --fix
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## 📁 Project Structure

```
/PortunWeb
├── docs/                      # 📚 Complete project documentation
│   ├── 01-competitive-analysis.md
│   ├── 02-product-requirements.md
│   ├── 03-technical-architecture.md
│   ├── 04-current-system-audit.md
│   ├── 05-security-fixes-priority.md
│   ├── 06-database-schema.md
│   ├── 07-api-specification.md
│   ├── 08-qr-access-spec.md
│   ├── 09-payment-tracking-spec.md
│   ├── 10-user-flows.md
│   ├── 11-brand-guidelines.md
│   ├── 12-deployment-plan.md
│   └── MULTILINGUAL_SEO_IMPLEMENTATION.md
├── src/
│   ├── pages/                 # 📄 Vue pages (file-based routing)
│   │   ├── index.vue          # Landing page
│   │   ├── admin/             # Admin portal pages
│   │   ├── login.vue          # Authentication
│   │   └── ...
│   ├── components/            # 🧩 Reusable Vue components
│   ├── composables/           # 🎣 Vue composables (useApi, useAuth, etc.)
│   ├── stores/                # 🗄️ Pinia stores
│   ├── plugins/               # 🔌 Vue plugins (router, vuetify, etc.)
│   ├── assets/                # 🖼️ Static assets (images, fonts)
│   └── backend/
│       └── supabase/          # 🗃️ Supabase table types
├── public/                    # Static files
├── .claude/                   # 🤖 Claude AI configuration
│   ├── rules.md               # Development rules
│   └── claude.md              # AI conversation log
├── .github/                   # GitHub Actions CI/CD
├── themeConfig.ts             # 🎨 Vuexy theme configuration
├── vite.config.ts             # ⚡ Vite configuration
└── package.json               # Dependencies
```

---

## 🧰 Tech Stack

### Frontend (PortunWeb)
- **Framework**: Vue 3.5 (Composition API + `<script setup>`)
- **Build Tool**: Vite 7.x
- **UI Library**: Vuetify 3.10 (Material Design)
- **State**: Pinia 3.x
- **Routing**: Vue Router 4.x (typed routes via unplugin-vue-router)
- **i18n**: vue-i18n 11.x (English + Spanish)
- **HTTP**: ofetch (better than axios)
- **Charts**: ApexCharts

### Backend (Supabase)
- **Database**: PostgreSQL 15
- **API**: PostgREST (auto-generated REST)
- **Auth**: Supabase Auth (JWT-based)
- **Storage**: S3-compatible object storage
- **Realtime**: PostgreSQL CDC via WebSockets
- **Functions**: Edge Functions (Deno runtime)

### Mobile Apps (PortunMobile + PortunAccess)
- **Framework**: Flutter 3.x (Dart)
- **State**: Provider + FFAppState
- **Backend**: Supabase (shared with web)
- **QR**: barcode_widget, flutter_barcode_scanner
- **Notifications**: OneSignal + FCM

### External Services
- **Hosting**: Vercel (web), App Stores (mobile)
- **CDN**: Vercel Edge Network + Cloudflare
- **Monitoring**: Sentry (errors), Uptime Robot (uptime)
- **Notifications**: OneSignal
- **Device Control**: Shelly Cloud API (gate/door relays)

---

## 👥 User Roles

1. **Resident** (Host)
   Creates QR codes for visitors, uploads payment receipts

2. **Security Guard**
   Scans QR codes, validates access, logs entries with photos

3. **Property Manager/Admin**
   Manages residents, verifies payments, reviews entry logs

4. **Visitor** (Guest)
   Presents QR code at gate for entry

---

## 🎯 MVP Features (2-3 Month Timeline)

### ✅ Phase 1: QR Access Control
- [x] Resident creates visitor QR codes
- [x] Guard scans and validates QR codes
- [x] Server-side validation (expiry, limits, blacklist)
- [x] Entry logging with photo evidence
- [x] Real-time push notifications
- [x] Offline mode for guards
- [x] Biometric authentication (guards)

### ✅ Phase 2: Payment Tracking (Manual)
- [x] Residents upload payment receipts
- [x] Admins verify/reject receipts
- [x] Payment history tracking
- [x] Push notifications on verification
- [x] Export payment reports (CSV/PDF)

### 🚧 Phase 3: Admin Portal (In Progress)
- [ ] Dashboard with analytics
- [ ] Resident management (add, edit, import CSV)
- [ ] Property & community setup
- [ ] Visitor logs with filters
- [ ] Payment verification queue
- [ ] Settings & configuration

---

## 🔐 Security Checklist (Must Complete Before Launch)

From [05-security-fixes-priority.md](./docs/05-security-fixes-priority.md):

**Critical (P0)**:
- [ ] Move Supabase credentials to .env (2 hours)
- [ ] Implement server-side QR validation (8 hours)
- [ ] Add biometric auth to guard app (6 hours)
- [ ] Database-level entry limit enforcement (4 hours)

**High Priority (P1)**:
- [ ] Receipt hash validation (3 hours)
- [ ] Secure password reset flow (4 hours)
- [ ] Encrypt Shelly API credentials (3 hours)
- [ ] Implement API rate limiting (2 hours)

**Total Effort**: ~32 hours (1 week sprint)

---

## 🧪 Testing

```bash
# Run unit tests (when available)
pnpm test:unit

# Run E2E tests (when available)
pnpm test:e2e

# Type checking
pnpm typecheck

# Lint checking
pnpm lint
```

---

## 📦 Deployment

### Staging
```bash
# Push to develop branch triggers auto-deploy to staging
git push origin develop

# Staging URL: https://staging.portun.app
```

### Production
```bash
# Manual deployment from main branch
git push origin main

# Vercel auto-deploys to https://www.portun.app
# Requires approval from CEO/CTO
```

See [12-deployment-plan.md](./docs/12-deployment-plan.md) for complete deployment procedures.

---

## 🌍 Localization & SEO

**Supported Languages**:
- **English (en_US)** - Primary, United States market
- **Spanish (es_MX)** - Full support, Mexico & Latin America
- **Portuguese (pt_BR)** - Full support, Brazil market

**Translation Files**:
- `/src/plugins/i18n/locales/en.json`
- `/src/plugins/i18n/locales/es.json`
- `/src/plugins/i18n/locales/pt.json`

**SEO Features**:
- ✅ Dynamic meta tags per language
- ✅ Hreflang tags for international SEO
- ✅ Open Graph & Twitter Cards
- ✅ JSON-LD structured data (SoftwareApplication, Organization)
- ✅ Sitemap with language alternates (`/public/sitemap.xml`)
- ✅ Robots.txt configuration (`/public/robots.txt`)

**Language Switching**:
- Automatic detection from browser settings
- Manual switcher in navigation (top right)
- URL parameter: `?lang=en`, `?lang=es`, `?lang=pt`
- Language preference saved in cookie

**📚 Detailed Documentation**: See [MULTILINGUAL_SEO_IMPLEMENTATION.md](./docs/MULTILINGUAL_SEO_IMPLEMENTATION.md) for:
- Complete implementation guide
- SEO optimization strategies
- Structured data schemas
- Google Search Console setup
- Testing procedures
- Content update guide

---

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `develop`
2. Make changes following `.claude/rules.md`
3. Run linter and type check
4. Commit with descriptive message
5. Push and create Pull Request
6. Request review from team lead
7. Merge after approval

### Code Style
- Follow ESLint rules (`.eslintrc.cjs`)
- Use Composition API with `<script setup>`
- TypeScript for all new files
- Never modify theme configuration without approval

---

## 🐛 Known Issues

See [04-current-system-audit.md](./docs/04-current-system-audit.md) for complete list of 46 identified issues.

**Top Priority Fixes**:
1. VULN-001: Exposed Supabase credentials
2. VULN-002: Client-side only QR validation
3. VULN-003: No biometric protection on guard app
4. GAP-003: Payment verification workflow incomplete

---

## 📞 Support & Resources

- **Documentation**: `/docs/` folder
- **Design System**: Vuexy theme (do not modify without approval)
- **API Docs**: See [07-api-specification.md](./docs/07-api-specification.md)
- **User Flows**: See [10-user-flows.md](./docs/10-user-flows.md)

---

## 📄 License

Proprietary - All rights reserved
Copyright © 2025 Portun.app

---

## 🎯 Success Metrics (30 Days Post-Launch)

From [02-product-requirements.md](./docs/02-product-requirements.md):

**Adoption**:
- [ ] 10+ communities signed up
- [ ] 500+ residents registered
- [ ] 1,000+ visitor QR codes generated

**Engagement**:
- [ ] 70%+ resident app installation rate
- [ ] 50%+ monthly active residents
- [ ] < 10% uninstall rate

**Quality**:
- [ ] < 2% crash rate
- [ ] 4.0+ app store rating
- [ ] < 5% support ticket rate

**Revenue**:
- [ ] $2,000+ MRR
- [ ] 15+ paying communities

---

## 🚦 Project Status

**Current Phase**: MVP Development (Week 1/12)
**Next Milestone**: Security fixes complete (Week 2)
**Launch Target**: Q1 2026

See [.claude/claude.md](./.claude/claude.md) for complete planning conversation and context.

---

**Last Updated**: 2025-11-14
**Maintained By**: Portun.app Engineering Team
