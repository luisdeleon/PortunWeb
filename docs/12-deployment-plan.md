# Deployment & Infrastructure Plan

**Version**: 1.0
**Last Updated**: 2025-11-14
**Target Launch**: Q1 2026

---

## Overview

This document outlines the complete deployment strategy for Portun.app across all three platforms (Mobile, Web, Backend) including infrastructure setup, CI/CD pipelines, monitoring, and disaster recovery.

---

## 1. INFRASTRUCTURE ARCHITECTURE

### Production Environment

```
┌────────────────────────────────────────────────────────┐
│                    FRONTEND TIER                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────┐     ┌──────────────────────┐   │
│  │  PortunWeb       │     │  Static Assets       │   │
│  │  (Vue 3 + Vite)  │     │  (Images, Fonts)     │   │
│  │                  │     │                      │   │
│  │  Vercel CDN      │     │  Vercel Edge Network │   │
│  │  www.portun.app  │     │  cdn.portun.app      │   │
│  └──────────────────┘     └──────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   BACKEND TIER                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Supabase (Managed PostgreSQL + Services)       │ │
│  │                                                  │ │
│  │  • PostgreSQL 15 (Primary + Replica)            │ │
│  │  • PostgREST API (Auto-generated REST)          │ │
│  │  • Realtime (WebSocket CDC)                     │ │
│  │  • Storage (S3-compatible)                      │ │
│  │  • Auth (JWT-based)                             │ │
│  │  • Edge Functions (Deno runtime)                │ │
│  │                                                  │ │
│  │  Region: us-west-1 (Primary)                    │ │
│  │  Failover: us-east-1 (Replica)                  │ │
│  │  data.portun.app                                 │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 MOBILE APPS TIER                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────┐     ┌──────────────────────┐   │
│  │  PortunMobile    │     │  PortunAccess        │   │
│  │  (Resident App)  │     │  (Guard App)         │   │
│  │                  │     │                      │   │
│  │  iOS + Android   │     │  iOS + Android       │   │
│  │  App Stores      │     │  App Stores          │   │
│  └──────────────────┘     └──────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ OneSignal   │  │ Shelly Cloud │  │   Sentry    │  │
│  │ Push Notify │  │ Gate Control │  │ Error Track │  │
│  └─────────────┘  └──────────────┘  └─────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 2. ENVIRONMENTS

### Development Environment

**Purpose**: Local development and testing
**Access**: Developers only

**Components**:
- Local Vite dev server (PortunWeb): http://localhost:5173
- Supabase local emulator (optional)
- Supabase dev project: `portun-dev`
- Flutter dev builds (not uploaded to stores)

**Data**: Seed data, test accounts

---

### Staging Environment

**Purpose**: Pre-production testing, QA validation
**Access**: Team + beta testers

**Components**:
- Web: staging.portun.app (Vercel preview deployment)
- Backend: Supabase project `portun-staging`
- Mobile: TestFlight (iOS) + Internal Testing (Android)

**Data**: Anonymized copy of production (refreshed weekly)

**Deployment**:
- Automatic on merge to `develop` branch
- Runs full test suite before deploy
- Requires manual approval for database migrations

---

### Production Environment

**Purpose**: Live customer-facing system
**Access**: Public

**Components**:
- Web: www.portun.app, admin.portun.app
- Backend: Supabase project `portun-production`
- Mobile: App Store + Google Play Store

**Data**: Live customer data

**Deployment**:
- Manual trigger from `main` branch
- Requires CEO/CTO approval
- Blue-green deployment strategy
- Automated rollback on error rate > 1%

---

## 3. DOMAIN CONFIGURATION

### DNS Setup (via Cloudflare)

```
portun.app                 → Vercel (landing page)
www.portun.app             → Vercel (landing page)
admin.portun.app           → Vercel (admin portal)
staging.portun.app         → Vercel (staging)
data.portun.app            → Supabase (CNAME)
cdn.portun.app             → Vercel Edge Network
status.portun.app          → Statuspage.io
```

**SSL Certificates**: Automated via Cloudflare + Vercel (Let's Encrypt)
**CAA Records**: Configured to allow Let's Encrypt only

---

## 4. CI/CD PIPELINE

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linter
        run: pnpm lint
      
      - name: Type check
        run: pnpm typecheck
      
      - name: Run unit tests
        run: pnpm test:unit
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Build
        run: pnpm build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  security-scan:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      - name: Run OWASP dependency check
        run: npm audit --audit-level=high

  deploy-web:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "✅ PortunWeb deployed to production",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Deployment successful: https://www.portun.app"
                  }
                }
              ]
            }

  deploy-functions:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
      
      - name: Deploy Edge Functions
        run: |
          supabase functions deploy validate-qr --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          supabase functions deploy log-entry --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          supabase functions deploy payment-notification --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

  deploy-mobile:
    needs: [test, security-scan]
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
      
      - name: Build iOS
        run: |
          cd PortunMobile
          flutter build ios --release --no-codesign
      
      - name: Build Android
        run: |
          cd PortunMobile
          flutter build apk --release
      
      # Note: Actual app store submission done manually via Fastlane
      # due to complexity of certificates and provisioning profiles
```

---

## 5. DATABASE MIGRATIONS

### Migration Strategy

**Tool**: Supabase CLI + SQL migration files
**Location**: `/supabase/migrations/`
**Naming**: `YYYYMMDDHHMMSS_description.sql`

**Process**:
1. Developer creates migration locally
2. Test migration on local Supabase
3. Commit migration file to git
4. Staging: Auto-apply on deploy (if no data loss)
5. Production: Manual apply after review

**Example Migration**:
```sql
-- /supabase/migrations/20251114120000_add_blacklist_table.sql

BEGIN;

CREATE TABLE blacklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_uid TEXT REFERENCES visitor_records_uid(record_uid) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  blacklisted_by UUID REFERENCES profile(id),
  blacklisted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blacklist_record_uid ON blacklist(record_uid);

COMMIT;
```

**Apply to Production**:
```bash
# Review migration
supabase db diff --linked

# Apply with transaction safety
supabase db push --linked
```

**Rollback Plan**:
```sql
-- Keep rollback script with every migration
-- /supabase/migrations/20251114120000_add_blacklist_table_rollback.sql

BEGIN;
DROP TABLE IF EXISTS blacklist CASCADE;
COMMIT;
```

---

## 6. SECRETS MANAGEMENT

### Environment Variables

**Never commit to git**: `.env`, `.env.local`, etc.

**Storage**: GitHub Secrets (CI/CD) + Vercel Environment Variables (runtime)

**Required Secrets**:

```bash
# Supabase
SUPABASE_URL=https://data.portun.app
SUPABASE_ANON_KEY=<public anon key>
SUPABASE_SERVICE_ROLE_KEY=<secret service role key>

# OneSignal
ONESIGNAL_APP_ID=<app id>
ONESIGNAL_API_KEY=<api key>

# Shelly Cloud
SHELLY_API_BASE_URL=https://shelly-144-eu.shelly.cloud
SHELLY_DEFAULT_AUTH_KEY=<encrypted in DB per community>

# Vercel
VERCEL_TOKEN=<deployment token>

# Monitoring
SENTRY_DSN=<sentry dsn>

# Email (future)
SENDGRID_API_KEY=<api key>
```

**Rotation Schedule**:
- Supabase keys: Annually or on suspected compromise
- API keys: Quarterly
- Passwords: Every 90 days

---

## 7. MONITORING & OBSERVABILITY

### Application Performance Monitoring (APM)

**Sentry** (Error Tracking):
- JavaScript errors (Web)
- Dart exceptions (Mobile)
- Edge Function errors (Backend)
- Performance metrics (LCP, FID, CLS)

**Configuration**:
```typescript
// Web
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event, hint) {
    // Filter out PII
    if (event.user) {
      delete event.user.email
    }
    return event
  }
})
```

---

### Infrastructure Monitoring

**Supabase Built-in Dashboards**:
- Database performance (queries/sec, latency)
- Storage usage
- API request rate
- Error rate
- Realtime connections

**Custom Metrics** (via Edge Functions):
```typescript
// Track QR validation metrics
await supabase.from('metrics').insert({
  metric_name: 'qr_validation',
  value: result.access_granted ? 1 : 0,
  tags: { reason: result.reason },
  timestamp: new Date()
})
```

---

### Uptime Monitoring

**Uptime Robot** (Free tier):
- Monitor: www.portun.app (HTTP 200 check every 5 min)
- Monitor: data.portun.app/rest/v1 (API health check)
- Monitor: admin.portun.app (Admin portal)
- Alert: Email + SMS on downtime > 5 minutes

**Status Page**: status.portun.app (Statuspage.io)
- Shows real-time uptime
- Incident history
- Scheduled maintenance announcements

---

### Log Aggregation

**Supabase Logs** (7-day retention on Pro):
- API request logs
- Edge Function logs
- Database query logs

**Log Forwarding** (future):
- Ship logs to LogDNA or Papertrail for long-term retention
- Set up alerts on error patterns

---

## 8. BACKUP & DISASTER RECOVERY

### Database Backups

**Automated** (Supabase):
- Full backup: Daily at 2 AM UTC
- Retention: 7 days (Pro plan)
- Point-in-time recovery (PITR): Available for last 7 days

**Manual Backups**:
```bash
# Weekly manual backup to S3 (Sundays at midnight)
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
aws s3 cp backup_*.sql.gz s3://portun-backups/database/
```

**Retention**:
- Daily: 7 days
- Weekly: 4 weeks
- Monthly: 12 months

---

### Storage Backups

**Supabase Storage**:
- Versioning enabled (30-day retention)
- Daily snapshots to separate S3 bucket

---

### Recovery Procedures

**RTO (Recovery Time Objective)**: 4 hours
**RPO (Recovery Point Objective)**: 1 hour (via PITR)

**Disaster Scenarios**:

1. **Database Corruption**:
   - Use PITR to restore to pre-corruption state
   - Estimated time: 30 minutes

2. **Region Outage** (us-west-1 down):
   - Failover to read replica in us-east-1
   - Promote replica to primary
   - Update DNS: data.portun.app → us-east-1
   - Estimated time: 2 hours

3. **Complete Data Loss**:
   - Restore from latest S3 backup
   - Replay WAL logs to minimize data loss
   - Estimated time: 4 hours

**Testing**: Disaster recovery drill quarterly

---

## 9. SECURITY HARDENING

### Web Application Firewall (WAF)

**Cloudflare WAF**:
- OWASP Top 10 protection
- DDoS mitigation (unlimited)
- Rate limiting: 100 req/min per IP
- Bot detection and challenge
- Geo-blocking (if needed)

---

### SSL/TLS Configuration

**Minimum TLS Version**: 1.3
**HSTS**: Enabled (max-age: 31536000, includeSubDomains, preload)
**Certificate**: Automated via Let's Encrypt
**OCSP Stapling**: Enabled

---

### API Security

**Rate Limiting** (Supabase):
- /auth/v1/token: 5 req/min per IP
- /rest/v1/*: 1000 req/min per user
- /functions/v1/*: 200 req/min per user

**CORS**:
```typescript
// Allowed origins
allowed_origins: [
  'https://www.portun.app',
  'https://admin.portun.app',
  'portun://*' // Mobile deep links
]
```

**Content Security Policy (CSP)**:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://data.portun.app;
  img-src 'self' data: https:;
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://data.portun.app wss://data.portun.app;
```

---

### Penetration Testing

**Schedule**: Annually or before major releases
**Provider**: External security firm (budget: $5,000-10,000)
**Scope**: Web app, API, mobile apps
**Report**: Shared with engineering team, issues tracked in Jira

---

## 10. PERFORMANCE OPTIMIZATION

### Web Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.8s | TBD |
| Largest Contentful Paint (LCP) | < 2.5s | TBD |
| Time to Interactive (TTI) | < 3.8s | TBD |
| Total Blocking Time (TBT) | < 200ms | TBD |
| Cumulative Layout Shift (CLS) | < 0.1 | TBD |

**Optimization Strategies**:
- Code splitting (route-based)
- Image optimization (WebP, lazy loading)
- CDN for static assets (Vercel Edge)
- Compression (Brotli, gzip)
- Resource hints (preconnect, dns-prefetch)

---

### API Performance Targets

| Endpoint | p50 | p95 | p99 |
|----------|-----|-----|-----|
| GET /visitor_records_uid | < 50ms | < 100ms | < 200ms |
| POST /visitor_records_uid | < 100ms | < 200ms | < 500ms |
| POST /functions/v1/validate-qr | < 500ms | < 1s | < 2s |
| POST /functions/v1/log-entry | < 1s | < 2s | < 3s |

---

### Database Performance

**Indexing Strategy**: See `06-database-schema.md`
**Connection Pooling**: PgBouncer (transaction mode, 500 max connections)
**Query Optimization**: Monitor slow queries (> 1s), add indexes as needed
**Partitioning**: Partition `visitor_record_logs` by month when > 10M rows

---

## 11. MOBILE APP DEPLOYMENT

### iOS Deployment

**Requirements**:
- Apple Developer Account ($99/year)
- Xcode on macOS
- Provisioning profiles and certificates

**Process**:
1. Increment build number in `pubspec.yaml`
2. Run `flutter build ios --release`
3. Archive in Xcode
4. Upload to App Store Connect
5. Submit for review (1-3 day review time)

**App Store Listing**:
- Name: "Portun - Smart Access"
- Category: Productivity
- Age rating: 4+
- Privacy policy: https://www.portun.app/privacy
- Support URL: https://www.portun.app/support

---

### Android Deployment

**Requirements**:
- Google Play Developer Account ($25 one-time)
- Keystore for signing (stored in GitHub Secrets)

**Process**:
1. Increment version code in `pubspec.yaml`
2. Run `flutter build appbundle --release`
3. Upload to Google Play Console
4. Release to production (or staged rollout)

**Play Store Listing**:
- Same as iOS

**Staged Rollout**:
- Day 1: 10% of users
- Day 3: 50% of users
- Day 7: 100% of users
- Monitor crash rate (<< 1%) and reviews

---

## 12. LAUNCH CHECKLIST

### Pre-Launch (T-1 Week)

- [ ] All P0 and P1 bugs fixed
- [ ] Security audit passed (no critical vulnerabilities)
- [ ] Performance benchmarks met
- [ ] 10 beta communities tested for 2+ weeks
- [ ] Documentation complete (user guides, API docs)
- [ ] Support email configured (support@portun.app)
- [ ] Status page live (status.portun.app)
- [ ] Monitoring and alerts configured
- [ ] Backups automated and tested
- [ ] Disaster recovery plan documented and drilled
- [ ] Privacy policy and terms of service published
- [ ] App Store listings ready (screenshots, descriptions)

---

### Launch Day (T-0)

- [ ] Deploy web app to production (Vercel)
- [ ] Deploy Edge Functions to production (Supabase)
- [ ] Run database migrations (if any)
- [ ] Submit mobile apps to stores
- [ ] Enable production monitoring (Sentry, Uptime Robot)
- [ ] Send launch email to early access list
- [ ] Post on social media (LinkedIn, Twitter)
- [ ] Monitor error rate (< 1%)
- [ ] Monitor performance (meet targets)
- [ ] On-call engineer available 24/7 for first 48 hours

---

### Post-Launch (T+1 Week)

- [ ] Review error logs (Sentry) and fix critical issues
- [ ] Analyze user feedback (app reviews, support tickets)
- [ ] Monitor key metrics:
  - Sign-ups: Target 10+ communities
  - Resident adoption: Target 70%+ installation rate
  - App rating: Target 4.0+ stars
  - Crash rate: Target < 2%
- [ ] Adjust marketing based on conversion data
- [ ] Plan first post-launch sprint (bug fixes + quick wins)

---

## 13. COST ESTIMATES

### Monthly Infrastructure Costs (Production)

| Service | Plan | Cost |
|---------|------|------|
| **Supabase** | Pro | $25 |
| **Vercel** | Pro | $20 |
| **Cloudflare** | Free | $0 |
| **OneSignal** | Free (< 10K users) | $0 |
| **Sentry** | Developer | $26 |
| **Uptime Robot** | Free | $0 |
| **Statuspage.io** | Free | $0 |
| **Domain** | portun.app | $12/year ($1/mo) |
| **Apple Developer** | Account | $99/year ($8.25/mo) |
| **Google Play** | Account | $25 one-time |
| **S3 Backups** | Storage | ~$5 |
| **Total** | | **~$85/month** |

**At Scale** (1,000 communities):
- Supabase: $100/month (Pro + usage)
- Vercel: $50/month (usage-based)
- OneSignal: $99/month (Growth plan)
- Sentry: $75/month (Team plan)
- **Total: ~$350/month**

---

## 14. ON-CALL ROTATION

**Schedule**: 24/7 coverage after launch
**Rotation**: Weekly (Mon 9 AM - Mon 9 AM)
**Team**: 3 engineers minimum

**Escalation Path**:
1. Level 1: On-call engineer (respond within 15 minutes)
2. Level 2: Engineering lead (if not resolved in 1 hour)
3. Level 3: CTO (if production down > 4 hours)

**Alerts**:
- **P0 (Critical)**: Production down, data loss
  - Response time: 15 minutes
  - Fix time: 4 hours
  
- **P1 (High)**: Feature broken, error rate > 5%
  - Response time: 1 hour
  - Fix time: 24 hours
  
- **P2 (Medium)**: Performance degradation
  - Response time: 4 hours
  - Fix time: 72 hours

---

## 15. INCIDENT RESPONSE PLAN

### Incident Severity Levels

**SEV-1 (Critical)**:
- Production completely down
- Data loss or corruption
- Security breach
- **Response**: Immediate (all hands on deck)

**SEV-2 (High)**:
- Core feature broken (QR validation, payment upload)
- Error rate > 5%
- Performance degradation > 50%
- **Response**: Within 1 hour

**SEV-3 (Medium)**:
- Non-critical feature broken
- Error rate 1-5%
- **Response**: Within 4 hours

---

### Incident Response Process

1. **Detection**: Alert fires or user report
2. **Triage**: On-call engineer assesses severity
3. **Communication**:
   - Post to #incidents Slack channel
   - Update status.portun.app
   - Email affected customers (if SEV-1)
4. **Investigation**: Gather logs, reproduce issue
5. **Mitigation**: Quick fix or rollback
6. **Resolution**: Permanent fix deployed
7. **Post-Mortem**: Document root cause, action items

**Post-Mortem Template**: See `/docs/incident-postmortem-template.md`

---

## APPENDIX A: Useful Commands

### Deployment

```bash
# Deploy web to production
vercel --prod

# Deploy Edge Functions
supabase functions deploy <function-name>

# Run database migration
supabase db push --linked

# Build mobile apps
cd PortunMobile && flutter build ios --release
cd PortunMobile && flutter build appbundle --release
```

---

### Monitoring

```bash
# View real-time logs
supabase functions logs validate-qr --tail

# Check database performance
supabase db inspect slow-queries

# View error rate
sentry-cli releases deploys <version> list
```

---

### Backup & Recovery

```bash
# Manual database backup
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip < backup_20251114.sql.gz | psql $DATABASE_URL

# Point-in-time recovery
supabase db restore --pitr "2025-11-14 10:30:00 UTC"
```

---

**Deployment Plan Status**: Ready for MVP launch
**Next Review**: After 30 days in production
