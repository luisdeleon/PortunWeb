# Technical Architecture - Portun.app

**Date**: 2025-11-14
**Version**: 1.0

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  PortunWeb (Vue 3)    PortunMobile (Flutter)   PortunAccess │
│  Admin Dashboard      Resident App             Guard App     │
│  Vite + Vuetify      Provider + FFAppState    Flutter 3.x   │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                          │
├─────────────────────────────────────────────────────────────┤
│         Supabase PostgREST (Auto-generated REST)            │
│         + Edge Functions (Deno) for custom logic            │
│         + Realtime (WebSocket for live updates)             │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 15 (Supabase)                                   │
│  - 12 tables with Row Level Security (RLS)                  │
│  - Database functions for atomic operations                 │
│  - Indexes on foreign keys and common queries               │
│  + Object Storage (S3-compatible) for images                │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────┤
│  OneSignal (Push)   Shelly API (Gates)   Sentry (Errors)   │
│  Vercel (Hosting)   Stripe (Future)      Uptime Robot      │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend - PortunWeb (Admin Dashboard)
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue | 3.5+ | UI framework |
| Vite | 7.x | Build tool |
| Vuetify | 3.10+ | UI components |
| Pinia | 3.x | State management |
| Vue Router | 4.x | Routing |
| TypeScript | 5.x | Type safety |
| ofetch | 1.x | HTTP client |

### Frontend - Mobile Apps (Flutter)
| Technology | Version | Purpose |
|------------|---------|---------|
| Flutter | 3.24+ | Cross-platform framework |
| Dart | 3.x | Programming language |
| Provider | 6.x | State management |
| supabase_flutter | 2.5+ | Backend SDK |
| mobile_scanner | 3.x | QR scanning |
| local_auth | 2.x | Biometric auth |
| hive_flutter | 1.x | Local storage |

### Backend - Supabase
| Component | Purpose |
|-----------|---------|
| PostgreSQL 15 | Primary database |
| PostgREST | Auto-generated REST API |
| GoTrue | Authentication |
| Realtime | WebSocket subscriptions |
| Storage | S3-compatible file storage |
| Edge Functions | Custom serverless logic (Deno) |

### External Services
| Service | Purpose |
|---------|---------|
| Vercel | Web hosting + CDN |
| Cloudflare | DNS + DDoS protection |
| OneSignal | Push notifications |
| Sentry | Error tracking |
| Uptime Robot | Uptime monitoring |

---

## Data Flow Diagrams

### QR Code Validation Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Guard      │     │    Edge      │     │   Database   │
│   App        │     │   Function   │     │  PostgreSQL  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ 1. Scan QR         │                    │
       │ "VIS-12345-ABC"    │                    │
       │────────────────────>                    │
       │                    │                    │
       │                    │ 2. Query visitor   │
       │                    │────────────────────>
       │                    │                    │
       │                    │ 3. Return record   │
       │                    │<────────────────────
       │                    │                    │
       │                    │ 4. Validate:       │
       │                    │ - Expiry check     │
       │                    │ - Entry limit      │
       │                    │ - Blacklist        │
       │                    │                    │
       │ 5. Return result   │                    │
       │<────────────────────                    │
       │                    │                    │
       │ 6. Guard logs entry│                    │
       │────────────────────>                    │
       │                    │                    │
       │                    │ 7. Insert entry    │
       │                    │ 8. Increment count │
       │                    │────────────────────>
       │                    │                    │
       │                    │ 9. Send push       │
       │                    │────────> OneSignal │
       │                    │                    │
```

### Payment Receipt Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Resident   │     │   Supabase   │     │    Admin     │
│   App        │     │   Backend    │     │   Portal     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ 1. Upload receipt  │                    │
       │ (compressed image) │                    │
       │────────────────────>                    │
       │                    │                    │
       │                    │ 2. Store in bucket │
       │                    │ 3. Insert record   │
       │                    │ (status: pending)  │
       │                    │                    │
       │ 4. Confirmation    │                    │
       │<────────────────────                    │
       │                    │                    │
       │                    │ 5. Admin sees      │
       │                    │    pending queue   │
       │                    │────────────────────>
       │                    │                    │
       │                    │ 6. Admin verifies  │
       │                    │<────────────────────
       │                    │                    │
       │                    │ 7. Update status   │
       │                    │ 8. Send push       │
       │                    │                    │
       │ 9. Notification    │                    │
       │<────────────────────                    │
```

---

## Security Architecture

### Authentication Flow

```
1. User enters email/password
2. Supabase Auth validates credentials
3. JWT token issued (expires in 1 hour)
4. Refresh token stored securely (expires in 30 days)
5. All API calls include JWT in Authorization header
6. RLS policies enforce data access based on JWT claims
```

### Row Level Security (RLS)

All tables have RLS enabled with policies based on:
- `auth.uid()` - Current user's ID
- `community_id` - User's community membership
- `role` - User's role (resident, guard, admin, owner)

Example policy:
```sql
-- Residents can only see their own visitors
CREATE POLICY "Residents view own visitors"
ON visitor_records_uid FOR SELECT
USING (auth.uid() = host_uid);
```

### Security Layers

1. **Network**: Cloudflare DDoS protection, HTTPS only
2. **Authentication**: Supabase Auth with JWT tokens
3. **Authorization**: RLS policies on all tables
4. **Validation**: Server-side validation via Edge Functions
5. **Encryption**: Data encrypted at rest (Supabase managed)
6. **Monitoring**: Sentry for error tracking, audit logs

---

## Scalability Considerations

### Current Capacity (Supabase Pro)
- 8GB database storage
- 250GB bandwidth
- 500K Edge Function invocations
- Supports ~5,000 active users

### Scaling Path
1. **Vertical**: Upgrade Supabase plan (Team → Enterprise)
2. **Horizontal**: Read replicas for reporting queries
3. **Caching**: Redis layer for frequent queries
4. **CDN**: Static assets via Vercel/Cloudflare edge

### Performance Optimizations
- Database indexes on foreign keys and common queries
- Image compression before upload (< 1MB)
- Pagination on all list queries
- Realtime subscriptions only where needed

---

## Deployment Architecture

### Environments
| Environment | URL | Purpose |
|-------------|-----|---------|
| Production | www.portun.app | Live users |
| Staging | staging.portun.app | Pre-release testing |
| Development | localhost:3000 | Local development |

### CI/CD Pipeline
1. Push to `develop` → Deploy to Staging
2. PR to `main` → Run tests, lint, type check
3. Merge to `main` → Deploy to Production

### Infrastructure Costs (Monthly)
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| OneSignal | Free | $0 |
| Sentry | Free | $0 |
| Cloudflare | Free | $0 |
| **Total** | | **$45** |

---

## Disaster Recovery

### Backup Strategy
- **Database**: Daily automated backups (Supabase)
- **Storage**: S3 cross-region replication
- **Code**: Git repository (GitHub)

### Recovery Objectives
- **RTO** (Recovery Time): 4 hours
- **RPO** (Recovery Point): 1 hour

### Incident Response
1. Alert received (Sentry/Uptime Robot)
2. On-call engineer investigates (< 15 min)
3. StatusPage updated (< 30 min)
4. Fix deployed (< 4 hours)
5. Post-mortem written (within 48 hours)

---

*Document maintained by Portun.app Engineering Team*
