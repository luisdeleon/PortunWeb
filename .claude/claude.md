# Portun.app - Development Guidelines

**Version**: 1.0 | **Last Updated**: 2025-11-14

---

## Project Overview

**Portun.app** is a QR-based access control platform for US and Latin American residential communities. The platform consists of:

- **PortunWeb** (Vue 3) - Admin Dashboard
- **PortunMobile** (Flutter) - Resident App (`~/Development/PortunMobile`)
- **PortunAccess** (Flutter) - Guard App (`~/Development/Access`)

### Key Features
1. **QR Access Control** - Residents create QR codes for visitors, guards scan to validate
2. **Payment Tracking** - Manual receipt upload with admin verification (MVP)

### Target Market
- **Geography**: US + LATAM (Hybrid)
- **Positioning**: Value/Accessible ("Residentia killer")
- **Pricing**: $2-3 per unit/month

---

## Development Rules

### Theme Integrity
- ❌ **NEVER** modify `themeConfig.ts` or core theme files
- ❌ **NEVER** change Vuexy design patterns or color schemes
- ✅ Use existing Vuetify components from the theme
- ✅ Follow established patterns in existing pages

### Code Standards
- ✅ Vue 3 Composition API with `<script setup>`
- ✅ TypeScript for all new files
- ✅ Use Pinia for state management
- ✅ Use ofetch for HTTP requests
- ✅ Follow existing file/folder conventions

### Security Requirements
- ❌ Never hardcode API keys or credentials
- ✅ Use environment variables (`.env` files)
- ✅ Server-side validation for all sensitive operations
- ✅ Row Level Security (RLS) on all Supabase tables

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3.5, Vite 7, Vuetify 3.10, Pinia 3 |
| Backend | Supabase (PostgreSQL 15, PostgREST, Edge Functions) |
| Mobile | Flutter 3.24+, Dart 3 |
| Hosting | Vercel (web), Cloudflare (DNS/CDN) |
| Push | OneSignal |
| Monitoring | Sentry, Uptime Robot |

---

## Documentation Index

All detailed documentation is in `/docs/`:

| Doc | Description |
|-----|-------------|
| [01-competitive-analysis.md](../docs/01-competitive-analysis.md) | Competitor research, market positioning |
| [02-product-requirements.md](../docs/02-product-requirements.md) | User stories, personas, success metrics |
| [03-technical-architecture.md](../docs/03-technical-architecture.md) | System design, data flows |
| [04-current-system-audit.md](../docs/04-current-system-audit.md) | 46 issues found in existing codebase |
| [05-security-fixes-priority.md](../docs/05-security-fixes-priority.md) | P0/P1 security fix implementations |
| [06-database-schema.md](../docs/06-database-schema.md) | Tables, RLS policies, functions |
| [07-api-specification.md](../docs/07-api-specification.md) | REST endpoints, Edge Functions |
| [08-qr-access-spec.md](../docs/08-qr-access-spec.md) | QR generation, validation, offline mode |
| [09-payment-tracking-spec.md](../docs/09-payment-tracking-spec.md) | Receipt upload, verification flow |
| [10-user-flows.md](../docs/10-user-flows.md) | Step-by-step user journeys |
| [11-brand-guidelines.md](../docs/11-brand-guidelines.md) | Colors, typography, voice |
| [12-deployment-plan.md](../docs/12-deployment-plan.md) | CI/CD, environments, costs |

---

## Quick Reference

### Supabase Tables
- `communities` - Community records
- `profile` - User profiles (residents, guards, admins)
- `visitor_records_uid` - Visitor QR codes
- `entry_logs` - Entry/exit records
- `payment_receipts` - HOA payment receipts
- `visitor_blacklist` - Blocked visitors

### Key Edge Functions
- `validate-qr` - Server-side QR validation
- `log-entry` - Atomic entry logging with counter
- `payment-notification` - Push on payment status change

### Environment Variables
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_ONESIGNAL_APP_ID=xxx
```

---

## Priority Fixes (P0)

These must be completed before launch:

1. **VULN-001**: Move credentials to env vars (2h)
2. **VULN-002**: Server-side QR validation (8h)
3. **VULN-003**: Biometric auth for guards (6h)
4. **GAP-002**: Database-level entry limits (4h)

See [05-security-fixes-priority.md](../docs/05-security-fixes-priority.md) for full details.

---

## Roadmap

### Phase 1: MVP (Weeks 1-10)
- Security hardening
- Admin portal (PortunWeb)
- Mobile app improvements
- Beta launch (5 communities)

### Phase 2: Growth (Months 4-6)
- Automated payments (Stripe)
- Hardware gate integrations
- Advanced analytics

### Phase 3: Scale (Months 7-12)
- Multi-property dashboard
- White-label options
- API for integrations

---

## Success Metrics (30 Days Post-Launch)

| Metric | Target |
|--------|--------|
| Communities | 10+ |
| Residents | 500+ |
| QR codes generated | 1,000+ |
| MRR | $2,000+ |
| App store rating | 4.0+ |

---

*For questions, check the docs folder or ask in the team chat.*
