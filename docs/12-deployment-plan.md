# Deployment Plan - Portun.app

**Date**: 2025-11-14
**Version**: 1.0

---

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION STACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │   Vercel     │   │   Supabase   │   │  Cloudflare  │     │
│  │   (Web)      │   │   (Backend)  │   │  (DNS/CDN)   │     │
│  └──────────────┘   └──────────────┘   └──────────────┘     │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │  App Store   │   │ Google Play  │   │  OneSignal   │     │
│  │   (iOS)      │   │  (Android)   │   │   (Push)     │     │
│  └──────────────┘   └──────────────┘   └──────────────┘     │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐                        │
│  │   Sentry     │   │ Uptime Robot │                        │
│  │  (Errors)    │   │ (Monitoring) │                        │
│  └──────────────┘   └──────────────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| Production | www.portun.app | `main` | Live users |
| Staging | staging.portun.app | `develop` | Pre-release testing |
| Preview | *.vercel.app | PR branches | PR review |
| Local | localhost:3000 | - | Development |

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  deploy-staging:
    needs: lint-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          alias-domains: staging.portun.app

  deploy-production:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Vercel Configuration

### vercel.json
```json
{
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### Environment Variables (Vercel Dashboard)
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_ONESIGNAL_APP_ID=xxx
```

---

## Cloudflare Configuration

### DNS Records
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | www | cname.vercel-dns.com | Yes |
| CNAME | staging | cname.vercel-dns.com | Yes |
| CNAME | @ | cname.vercel-dns.com | Yes |

### Page Rules
1. `*portun.app/*` → Always Use HTTPS
2. `*portun.app/static/*` → Cache Level: Cache Everything, Edge TTL: 1 month

### Security Settings
- SSL: Full (Strict)
- Always Use HTTPS: On
- Minimum TLS: 1.2
- Automatic HTTPS Rewrites: On

---

## Supabase Deployment

### Database Migrations
```bash
# Apply migrations
supabase db push

# Or via CLI
supabase migration up
```

### Edge Functions
```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy validate-qr
```

### Environment Secrets
```bash
supabase secrets set ONESIGNAL_REST_API_KEY=xxx
supabase secrets set SHELLY_AUTH_KEY=xxx
```

---

## Mobile App Deployment

### iOS (App Store)
1. Update version in `pubspec.yaml`
2. Build: `flutter build ios --release`
3. Open Xcode, archive, and upload
4. Submit for review in App Store Connect

### Android (Google Play)
1. Update version in `pubspec.yaml`
2. Build: `flutter build appbundle --release`
3. Upload to Google Play Console
4. Submit for review (internal → production)

### Version Strategy
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

Example: `1.2.3` → `1.2.4` (bug fix)

---

## Monitoring & Alerts

### Sentry (Error Tracking)
```typescript
// src/plugins/sentry.ts
import * as Sentry from "@sentry/vue";

export function initSentry(app: App, router: Router) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
    ],
    tracesSampleRate: 0.2,
  });
}
```

### Uptime Robot
- Monitor: https://www.portun.app
- Type: HTTP(s)
- Interval: 5 minutes
- Alert: Email + SMS on downtime

### Alert Channels
| Event | Channel |
|-------|---------|
| Error spike | Slack #alerts |
| Downtime | SMS + Email |
| Deploy success | Slack #deploys |
| High latency | Slack #alerts |

---

## Rollback Procedures

### Web (Vercel)
1. Go to Vercel Dashboard
2. Select project → Deployments
3. Find last stable deployment
4. Click "..." → "Promote to Production"

### Database (Supabase)
1. Go to Supabase Dashboard
2. Database → Backups
3. Select backup point
4. Restore to new database
5. Update connection strings

### Mobile Apps
- iOS: Previous version remains available until new version approved
- Android: Use staged rollout (10% → 50% → 100%), pause if issues

---

## Cost Estimates

### Monthly Costs (Startup Phase)
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby → Pro | $0 - $20 |
| Supabase | Pro | $25 |
| Cloudflare | Free | $0 |
| OneSignal | Free | $0 |
| Sentry | Free | $0 |
| Uptime Robot | Free | $0 |
| Apple Developer | Annual | $8.25/mo |
| Google Play | One-time | - |
| **Total** | | **~$55/mo** |

### Scale Phase (1K+ users)
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Supabase | Team | $250 |
| Cloudflare | Pro | $20 |
| OneSignal | Starter | $50 |
| Sentry | Team | $26 |
| **Total** | | **~$366/mo** |

---

## Launch Checklist

### Pre-Launch (1 week before)
- [ ] All P0 security fixes deployed
- [ ] Staging environment fully tested
- [ ] Database migrations verified
- [ ] Mobile apps submitted to stores
- [ ] Monitoring configured
- [ ] SSL certificates valid
- [ ] Environment variables set
- [ ] Backup strategy tested

### Launch Day
- [ ] Deploy to production
- [ ] Verify all services healthy
- [ ] Publish mobile apps
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Announce to beta users

### Post-Launch (1 week after)
- [ ] Review error logs
- [ ] Collect user feedback
- [ ] Monitor performance
- [ ] Plan iteration sprint

---

## Disaster Recovery

### Backup Schedule
| Data | Frequency | Retention |
|------|-----------|-----------|
| Database | Daily | 7 days |
| Storage | Continuous | 30 days |
| Code | Git | Permanent |

### Recovery Objectives
- **RTO** (Recovery Time): 4 hours
- **RPO** (Recovery Point): 1 hour

### Incident Response
1. Detect (Monitoring alerts)
2. Assess (Determine severity)
3. Communicate (Status page update)
4. Resolve (Fix or rollback)
5. Review (Post-mortem within 48h)

---

*Document maintained by Portun.app DevOps Team*
