# Portun.app - Development Rules

## Project Overview

Portun.app is a QR-based access control platform for residential communities (US + LATAM).

**Apps**:
- **PortunWeb** (this repo): Admin dashboard (Vue 3 + Vuexy theme)
- **PortunMobile**: Resident app (Flutter)
- **PortunAccess**: Guard app (Flutter)

## Critical Rules

### Theme Protection
- **NEVER** modify `themeConfig.ts` or theme design
- **NEVER** change Vuexy component styling without explicit approval
- Maintain theme integrity at all costs

### Code Standards
- Use Vue 3 Composition API with `<script setup>`
- TypeScript for all new files
- Follow existing Vuexy component patterns
- Use Pinia for state management
- Use `ofetch` for API calls (not axios)

### File Structure
```
src/
├── pages/           # File-based routing (unplugin-vue-router)
├── views/           # Reusable view components
├── components/      # Shared components
├── composables/     # Composition functions
├── stores/          # Pinia stores
├── plugins/         # Vue plugins
└── @core/           # Theme core (DO NOT MODIFY)
```

### Routing
- Pages use `definePage()` macro for meta
- Public pages: `meta: { layout: 'blank', public: true }`
- Protected pages: Default layout with auth required

### Internationalization
- Use vue-i18n for translations
- Support: English (en), Spanish (es)
- Translation files: `src/plugins/i18n/locales/`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3.5 + Vite + Vuetify 3.10 |
| Theme | Vuexy (DO NOT MODIFY) |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (S3-compatible) |
| Hosting | Vercel + Cloudflare |

## Documentation

Detailed planning and specifications are in `/docs/`:

| Document | Description |
|----------|-------------|
| [Planning Session](../docs/PLANNING_SESSION.md) | Complete planning conversation and decisions |
| [Competitive Analysis](../docs/01-competitive-analysis.md) | Market research |
| [Product Requirements](../docs/02-product-requirements.md) | PRD with user stories |
| [Technical Architecture](../docs/03-technical-architecture.md) | System design |
| [System Audit](../docs/04-current-system-audit.md) | 46 issues found |
| [Security Fixes](../docs/05-security-fixes-priority.md) | Priority fixes |
| [Database Schema](../docs/06-database-schema.md) | Tables + RLS policies |
| [API Specification](../docs/07-api-specification.md) | REST + Edge Functions |
| [QR Access Spec](../docs/08-qr-access-spec.md) | QR feature details |
| [Payment Tracking](../docs/09-payment-tracking-spec.md) | Payment module |
| [User Flows](../docs/10-user-flows.md) | UX journeys |
| [Brand Guidelines](../docs/11-brand-guidelines.md) | Design system |
| [Deployment Plan](../docs/12-deployment-plan.md) | Infrastructure |

## Quick Reference

### Strategic Decisions
- **Target Market**: US + LATAM hybrid
- **Positioning**: Value/Accessible ("Residentia killer")
- **Pricing**: $2-3/unit/month
- **MVP Timeline**: 2-3 months

### Key Commands
```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm typecheck    # Type checking
pnpm lint         # Linting
```

### Environment Variables
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Security Notes

- Never hardcode credentials
- Use environment variables for all secrets
- All API calls must go through Supabase RLS
- Server-side validation for critical operations (QR, payments)
