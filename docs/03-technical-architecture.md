# Technical Architecture: Portun.app

**Document Version**: 1.0
**Last Updated**: 2025-11-14
**Author**: Engineering Team
**Status**: Active

---

## 1. SYSTEM OVERVIEW

### 1.1 Architecture Style
**Serverless, Mobile-First, API-Driven**

Portun.app follows a modern serverless architecture with:
- **Mobile-first clients** (Flutter/Dart)
- **Backend-as-a-Service** (Supabase/PostgreSQL)
- **Edge Functions** for business logic
- **Cloud storage** for files/images
- **Push notifications** (OneSignal/FCM)
- **Smart device integration** (Shelly Cloud API)

### 1.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐│
│  │PortunMobile  │  │PortunAccess  │  │ PortunWeb (Admin)      ││
│  │(Resident App)│  │(Guard App)   │  │(Vue 3 + Vuetify)       ││
│  │Flutter/Dart  │  │Flutter/Dart  │  │Vite + TypeScript       ││
│  │iOS + Android │  │iOS + Android │  │Desktop + Mobile Web    ││
│  └──────┬───────┘  └──────┬───────┘  └───────────┬────────────┘│
│         │                  │                      │              │
└─────────┼──────────────────┼──────────────────────┼──────────────┘
          │                  │                      │
          └──────────────────┼──────────────────────┘
                             │
          ┌──────────────────▼──────────────────────┐
          │          API GATEWAY LAYER              │
          │      (Supabase Auto-generated REST)     │
          │      https://data.portun.app/rest/v1    │
          └──────────────────┬──────────────────────┘
                             │
          ┌──────────────────▼──────────────────────┐
          │         BUSINESS LOGIC LAYER            │
          ├─────────────────────────────────────────┤
          │  ┌────────────────────────────────────┐ │
          │  │ Supabase Edge Functions (Deno)    │ │
          │  │ - validate-qr                     │ │
          │  │ - log-entry                       │ │
          │  │ - payment-notification            │ │
          │  └────────────────────────────────────┘ │
          │  ┌────────────────────────────────────┐ │
          │  │ Database Functions (PL/pgSQL)     │ │
          │  │ - Entry limit validation          │ │
          │  │ - Atomic counter increment        │ │
          │  └────────────────────────────────────┘ │
          └──────────────────┬──────────────────────┘
                             │
          ┌──────────────────▼──────────────────────┐
          │           DATA LAYER                    │
          ├─────────────────────────────────────────┤
          │  ┌────────────────────────────────────┐ │
          │  │ Supabase PostgreSQL                │ │
          │  │ - visitor_records_uid              │ │
          │  │ - visitor_record_logs              │ │
          │  │ - payment_receipts                 │ │
          │  │ - profile, property, community     │ │
          │  │ - Row Level Security (RLS) enabled │ │
          │  └────────────────────────────────────┘ │
          │  ┌────────────────────────────────────┐ │
          │  │ Supabase Storage                   │ │
          │  │ - QR code images                   │ │
          │  │ - Visitor photos                   │ │
          │  │ - Payment receipts                 │ │
          │  └────────────────────────────────────┘ │
          │  ┌────────────────────────────────────┐ │
          │  │ Supabase Realtime                  │ │
          │  │ - PostgreSQL CDC                   │ │
          │  │ - WebSocket connections            │ │
          │  └────────────────────────────────────┘ │
          └──────────────────┬──────────────────────┘
                             │
          ┌──────────────────▼──────────────────────┐
          │      EXTERNAL INTEGRATIONS              │
          ├─────────────────────────────────────────┤
          │  ┌─────────────┐  ┌──────────────────┐ │
          │  │OneSignal    │  │Shelly Cloud API  │ │
          │  │Push Notify  │  │Gate/Door Control │ │
          │  └─────────────┘  └──────────────────┘ │
          └─────────────────────────────────────────┘
```

---

## 2. CLIENT APPLICATIONS

### 2.1 PortunMobile (Resident App)

**Technology Stack**:
- **Framework**: Flutter 3.x (Dart)
- **State Management**: Provider + FFAppState (FlutterFlow)
- **Routing**: GoRouter 12.x
- **Local Storage**: Hive (offline data) + SharedPreferences (app state)
- **HTTP Client**: Dio
- **Authentication**: Supabase Auth (email/password + JWT)
- **Notifications**: OneSignal 5.x + FCM
- **QR Generation**: barcode_widget 2.x
- **Image Handling**: image_picker, file_picker

**Key Features**:
- Visitor invitation with QR generation
- Entry history timeline
- Payment receipt upload
- Push notifications
- Offline QR generation

**Build Configuration**:
```yaml
# pubspec.yaml
environment:
  sdk: ">=3.0.0 <4.0.0"
  flutter: ">=3.0.0"

dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^2.9.0
  provider: ^6.1.5
  go_router: ^12.1.3
  hive: ^2.2.3
  shared_preferences: ^2.2.0
  onesignal_flutter: ^5.3.4
  barcode_widget: ^2.0.3
  image_picker: ^1.0.0
```

---

### 2.2 PortunAccess (Guard App)

**Technology Stack**:
- **Framework**: Flutter 3.x (Dart)
- **State Management**: Provider + FFAppState
- **Barcode Scanning**: flutter_barcode_scanner
- **Camera**: camera plugin
- **Biometrics**: local_auth (Face ID, Touch ID, Fingerprint)
- **Geolocation**: geolocator

**Key Features**:
- QR code scanning
- Biometric authentication
- Offline mode (last 100 visitors cached)
- Photo capture at entry
- Shelly device control
- Real-time entry logging

**Offline Strategy**:
```dart
// Cache structure in Hive
class CachedVisitorRecord {
  String recordUid;
  String visitorName;
  DateTime validityEnd;
  int entriesAllowed;
  int entriesUsed;
  bool isBlacklisted;
  DateTime cachedAt;
}

// Sync queue for offline entries
class PendingEntryLog {
  String recordUid;
  DateTime timestamp;
  String photoLocalPath;
  String guardId;
  bool synced;
}
```

---

### 2.3 PortunWeb (Admin Portal)

**Technology Stack**:
- **Framework**: Vue 3.5 (Composition API)
- **Build Tool**: Vite 7.x
- **UI Library**: Vuetify 3.10
- **State**: Pinia 3.x
- **Routing**: Vue Router 4.x (typed routes)
- **HTTP**: ofetch (auto-retry, better DX than axios)
- **i18n**: vue-i18n 11.x
- **Auth**: Supabase Auth (same as mobile)
- **Charts**: ApexCharts (for dashboard analytics)

**Project Structure**:
```
/src
├── pages/
│   ├── index.vue                 # Landing page
│   ├── admin/
│   │   ├── dashboard.vue         # Admin home
│   │   ├── residents/
│   │   │   ├── index.vue         # Residents list
│   │   │   ├── add.vue           # Add resident form
│   │   │   └── [id].vue          # Resident details
│   │   ├── visitors/
│   │   │   └── index.vue         # Visitor logs
│   │   ├── payments/
│   │   │   ├── index.vue         # Payment queue
│   │   │   └── verify.vue        # Verify receipt
│   │   ├── properties/
│   │   │   └── index.vue         # Property management
│   │   └── settings/
│   │       └── index.vue         # Community settings
│   ├── login.vue                 # Admin login
│   └── register.vue              # Admin signup
├── components/
│   ├── admin/
│   │   ├── Navbar.vue
│   │   ├── Sidebar.vue
│   │   └── Stat Card.vue
├── composables/
│   ├── useApi.ts                 # Supabase client wrapper
│   └── useAuth.ts                # Auth state management
├── stores/
│   ├── auth.ts                   # Pinia auth store
│   └── community.ts              # Active community state
└── backend/
    └── supabase/
        └── database/
            └── tables/           # TypeScript types for DB tables
```

**Authentication Flow**:
1. Admin logs in via `/login`
2. Supabase Auth generates JWT
3. JWT stored in localStorage (httpOnly not possible in SPA)
4. Every API request includes JWT in Authorization header
5. Supabase RLS policies enforce access control
6. JWT expires after 24 hours, auto-refresh

---

## 3. BACKEND ARCHITECTURE

### 3.1 Supabase Stack

**Core Services**:
- **PostgreSQL 15**: Primary database with extensions (uuid-ossp, pgcrypto)
- **PostgREST**: Auto-generated REST API from database schema
- **Realtime**: PostgreSQL CDC (Change Data Capture) via WebSockets
- **Storage**: S3-compatible object storage for files
- **Auth**: JWT-based authentication with multiple providers
- **Edge Functions**: Deno runtime for custom business logic

**Configuration**:
```
Project: portun-production
URL: https://data.portun.app
Region: us-west-1 (primary US), eu-west-1 (LATAM/Europe option)
Pricing Tier: Pro ($25/month)
Database: db.t4g.small (2 vCPU, 8GB RAM) - auto-scales
Storage: 100GB included, pay-as-you-go
```

### 3.2 Database Schema (PostgreSQL)

**Core Tables** (see `06-database-schema.md` for full ERD):

```sql
-- Visitor Records (QR codes)
CREATE TABLE visitor_records_uid (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_uid UUID REFERENCES profile(id) NOT NULL,
  record_uid TEXT UNIQUE NOT NULL,          -- Encoded in QR
  rand_record_uid TEXT UNIQUE,              -- Alternative UID
  visitor_name TEXT NOT NULL,
  visitor_type TEXT CHECK (visitor_type IN ('Guest', 'Delivery', 'Service', 'Family', 'Party')),
  qrcode_image_url TEXT,                    -- Pre-generated QR image
  validity_start TIMESTAMPTZ DEFAULT NOW(),
  validity_end TIMESTAMPTZ NOT NULL,
  property_id UUID REFERENCES property(id),
  community_id UUID REFERENCES community(id),
  entries_used INT DEFAULT 0,
  entries_allowed INT DEFAULT 9999,
  document_num TEXT,                        -- Visitor ID number
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entry Logs
CREATE TABLE visitor_record_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_uid TEXT REFERENCES visitor_records_uid(record_uid),
  host_uid UUID REFERENCES profile(id),
  visitor_name TEXT,
  in_time TIMESTAMPTZ NOT NULL,
  out_time TIMESTAMPTZ,
  guard_id UUID REFERENCES profile(id),
  photo_url TEXT,                           -- Entry photo
  photo_hash TEXT,                          -- SHA-256 for integrity
  geolocation POINT,                        -- PostGIS point
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Receipts
CREATE TABLE payment_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profile(id) NOT NULL,
  property_id UUID REFERENCES property(id),
  community_id UUID REFERENCES community(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  reference_number TEXT,
  receipt_image_url TEXT NOT NULL,
  receipt_hash TEXT,                        -- SHA-256
  status TEXT CHECK (status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verified_by UUID REFERENCES profile(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profile(id),
  action TEXT NOT NULL,                     -- 'access_granted', 'payment_verified', etc.
  resource_type TEXT,                       -- 'visitor_record', 'payment', etc.
  resource_id UUID,
  metadata JSONB,                           -- Flexible additional data
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes** (performance optimization):
```sql
CREATE INDEX idx_visitor_records_record_uid ON visitor_records_uid(record_uid);
CREATE INDEX idx_visitor_records_community ON visitor_records_uid(community_id);
CREATE INDEX idx_visitor_records_validity ON visitor_records_uid(validity_end);
CREATE INDEX idx_visitor_logs_record_uid ON visitor_record_logs(record_uid);
CREATE INDEX idx_visitor_logs_in_time ON visitor_record_logs(in_time DESC);
CREATE INDEX idx_payment_receipts_status ON payment_receipts(status) WHERE status = 'pending';
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
```

---

### 3.3 Row Level Security (RLS)

**Principle**: Users can only access data they're authorized to see.

```sql
-- Enable RLS on all tables
ALTER TABLE visitor_records_uid ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_record_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Policy: Residents see only their own visitor records
CREATE POLICY "Residents see own visitors"
ON visitor_records_uid FOR SELECT
USING (auth.uid() = host_uid);

-- Policy: Residents can create visitor records
CREATE POLICY "Residents create visitors"
ON visitor_records_uid FOR INSERT
WITH CHECK (auth.uid() = host_uid);

-- Policy: Guards see all visitors in their assigned communities
CREATE POLICY "Guards see community visitors"
ON visitor_records_uid FOR SELECT
USING (
  community_id IN (
    SELECT community_id FROM community_manager
    WHERE profile_id = auth.uid()
  )
);

-- Policy: Admins see all data in their communities
CREATE POLICY "Admins full access"
ON visitor_records_uid FOR ALL
USING (
  community_id IN (
    SELECT community_id FROM community_manager cm
    JOIN profile_role pr ON cm.profile_id = pr.profile_id
    JOIN role r ON pr.role_id = r.id
    WHERE cm.profile_id = auth.uid() AND r.role_name = 'Admin'
  )
);
```

---

### 3.4 Edge Functions (Business Logic)

**Location**: `/supabase/functions/`

**validate-qr** (Server-side QR validation):
```typescript
// /supabase/functions/validate-qr/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { record_uid, guard_id, geolocation } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Bypasses RLS
  )

  // Fetch visitor record
  const { data: visitor, error } = await supabase
    .from('visitor_records_uid')
    .select('*')
    .eq('record_uid', record_uid)
    .single()

  if (error || !visitor) {
    return new Response(JSON.stringify({
      access_granted: false,
      reason: 'Visitor not found'
    }), { status: 404 })
  }

  // Check validity
  const now = new Date()
  if (new Date(visitor.validity_end) < now) {
    return new Response(JSON.stringify({
      access_granted: false,
      reason: 'QR code expired'
    }), { status: 403 })
  }

  // Check entry limits
  if (visitor.entries_used >= visitor.entries_allowed) {
    return new Response(JSON.stringify({
      access_granted: false,
      reason: 'Maximum entries reached'
    }), { status: 403 })
  }

  // Check blacklist (future feature)
  // ...

  return new Response(JSON.stringify({
    access_granted: true,
    visitor_name: visitor.visitor_name,
    host_uid: visitor.host_uid,
    entries_remaining: visitor.entries_allowed - visitor.entries_used
  }), { status: 200 })
})
```

**log-entry** (Atomic entry logging):
```typescript
// /supabase/functions/log-entry/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { record_uid, guard_id, photo_url, geolocation } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Start transaction
  const { data: visitor } = await supabase
    .from('visitor_records_uid')
    .select('*')
    .eq('record_uid', record_uid)
    .single()

  // Increment entry count (atomic)
  const { error: updateError } = await supabase
    .from('visitor_records_uid')
    .update({
      entries_used: visitor.entries_used + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', visitor.id)

  // Create entry log
  const { data: log, error: logError } = await supabase
    .from('visitor_record_logs')
    .insert({
      record_uid,
      host_uid: visitor.host_uid,
      visitor_name: visitor.visitor_name,
      guard_id,
      in_time: new Date().toISOString(),
      photo_url,
      geolocation
    })
    .select()
    .single()

  // Trigger push notification (via OneSignal API)
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Deno.env.get('ONESIGNAL_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_id: Deno.env.get('ONESIGNAL_APP_ID'),
      include_external_user_ids: [visitor.host_uid],
      headings: { en: 'Guest Arrived' },
      contents: { en: `${visitor.visitor_name} checked in` },
      data: { type: 'visitor_entry', log_id: log.id }
    })
  })

  return new Response(JSON.stringify({
    success: true,
    log_id: log.id
  }), { status: 200 })
})
```

---

## 4. DATA FLOW EXAMPLES

### 4.1 Resident Creates QR Code

```
[PortunMobile] User taps "Add Visitor"
    ↓
[PortunMobile] Fills form (name, type, dates, limits)
    ↓
[PortunMobile] Generates UUID for record_uid
    ↓
[PortunMobile] Generates QR code image (client-side using barcode_widget)
    ↓
[PortunMobile] → POST /rest/v1/visitor_records_uid
    ↓
[Supabase RLS] Checks auth.uid() = host_uid (policy)
    ↓
[PostgreSQL] INSERT INTO visitor_records_uid
    ↓
[PostgreSQL] Returns created record
    ↓
[PortunMobile] Saves QR image to device
    ↓
[PortunMobile] Shows share sheet (WhatsApp, SMS, Email)
```

### 4.2 Guard Scans QR Code

```
[PortunAccess] Opens camera scanner
    ↓
[PortunAccess] Scans QR → extracts record_uid
    ↓
[PortunAccess] → POST /functions/v1/validate-qr
    {record_uid, guard_id, geolocation}
    ↓
[Edge Function] Queries visitor_records_uid table
    ↓
[Edge Function] Validates:
    - Record exists?
    - validity_end > NOW()?
    - entries_used < entries_allowed?
    ↓
[Edge Function] Returns {access_granted: true/false, reason}
    ↓
[PortunAccess] Shows result screen (green checkmark or red X)
    ↓
IF access_granted:
    [PortunAccess] Camera opens for photo
        ↓
    [PortunAccess] Uploads photo → Supabase Storage
        ↓
    [PortunAccess] → POST /functions/v1/log-entry
        {record_uid, guard_id, photo_url, geolocation}
        ↓
    [Edge Function] Atomic operations:
        1. UPDATE visitor_records_uid SET entries_used = entries_used + 1
        2. INSERT INTO visitor_record_logs
        3. Trigger OneSignal push notification to resident
        ↓
    [OneSignal] Push notification to resident's device
        ↓
    [PortunMobile] Notification appears: "John Doe checked in"
```

### 4.3 Resident Uploads Payment Receipt

```
[PortunMobile] User navigates to Payments tab
    ↓
[PortunMobile] Taps "Upload Receipt"
    ↓
[PortunMobile] Camera opens or selects from gallery
    ↓
[PortunMobile] User crops image
    ↓
[PortunMobile] Compresses image to < 2MB
    ↓
[PortunMobile] → POST /storage/v1/object/receipts/{filename}
    ↓
[Supabase Storage] Stores image, returns URL
    ↓
[PortunMobile] Calculates SHA-256 hash of image
    ↓
[PortunMobile] → POST /rest/v1/payment_receipts
    {profile_id, amount, payment_date, receipt_image_url, receipt_hash}
    ↓
[Supabase RLS] Checks auth.uid() = profile_id
    ↓
[PostgreSQL] INSERT INTO payment_receipts (status = 'pending')
    ↓
[PostgreSQL Trigger] Notifies Realtime channel 'payment_receipts:INSERT'
    ↓
[PortunWeb Admin] Listens to Realtime, updates pending badge count
    ↓
[PortunMobile] Shows success: "Receipt submitted for verification"
```

---

## 5. SECURITY ARCHITECTURE

### 5.1 Authentication Flow

```
User Login:
    ↓
[Client] POST /auth/v1/token
    {email, password}
    ↓
[Supabase Auth] Validates credentials
    ↓
[Supabase Auth] Generates JWT with claims:
    {
      sub: "user-uuid",
      email: "user@example.com",
      role: "authenticated",
      exp: 1234567890
    }
    ↓
[Client] Stores JWT in:
    - localStorage (web)
    - Keychain (iOS)
    - EncryptedSharedPreferences (Android)
    ↓
[Client] Every API request includes:
    Authorization: Bearer <JWT>
    ↓
[Supabase] Validates JWT signature
    ↓
[PostgreSQL RLS] Uses auth.uid() from JWT in policies
```

### 5.2 Data Encryption

**At Rest**:
- PostgreSQL encryption at rest (AES-256) - Supabase default
- Storage bucket encryption (AES-256)
- Backup encryption

**In Transit**:
- All connections via TLS 1.3
- Certificate pinning in mobile apps (future enhancement)

**Application Level**:
- Sensitive fields (document_num) encrypted with pgcrypto:
  ```sql
  SELECT pgp_sym_encrypt('value', 'encryption-key');
  SELECT pgp_sym_decrypt(encrypted_column, 'encryption-key');
  ```

### 5.3 API Security

**Rate Limiting**:
```yaml
# Supabase custom rate limits
endpoints:
  /auth/v1/token:
    limit: 5 requests per minute per IP
  /functions/v1/validate-qr:
    limit: 100 requests per minute per user
  /rest/v1/*:
    limit: 1000 requests per minute per user
```

**CORS Configuration**:
```typescript
// Supabase CORS settings
allowed_origins: [
  'https://www.portun.app',
  'https://admin.portun.app',
  'portun://*' // Mobile app deep links
]
allowed_methods: ['GET', 'POST', 'PUT', 'DELETE']
allowed_headers: ['Authorization', 'Content-Type']
```

---

## 6. SCALABILITY & PERFORMANCE

### 6.1 Database Optimization

**Connection Pooling**:
- Supabase uses PgBouncer (transaction pooling mode)
- Max connections: 500 (Pro plan)
- Connection timeout: 10 seconds

**Query Optimization**:
```sql
-- Materialized view for dashboard stats (refreshed hourly)
CREATE MATERIALIZED VIEW community_stats AS
SELECT
  community_id,
  COUNT(DISTINCT visitor_records_uid.id) as total_visitors_week,
  COUNT(DISTINCT visitor_record_logs.id) as total_entries_week,
  COUNT(DISTINCT payment_receipts.id) FILTER (WHERE status = 'pending') as pending_payments
FROM visitor_records_uid
LEFT JOIN visitor_record_logs ON visitor_records_uid.record_uid = visitor_record_logs.record_uid
LEFT JOIN payment_receipts ON payment_receipts.community_id = visitor_records_uid.community_id
WHERE visitor_record_logs.in_time > NOW() - INTERVAL '7 days'
GROUP BY community_id;

-- Refresh schedule
SELECT cron.schedule('refresh-community-stats', '0 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY community_stats');
```

**Partitioning** (for scale):
```sql
-- Partition visitor_record_logs by month (when > 10M rows)
CREATE TABLE visitor_record_logs_2026_01 PARTITION OF visitor_record_logs
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### 6.2 Caching Strategy

**Client-Side**:
- Visitor list: 5 minute cache
- Community settings: 1 hour cache
- User profile: Session cache

**Edge Function Caching**:
```typescript
// Deno Deploy edge caching
const cacheKey = `visitor:${record_uid}`
const cached = await kv.get(cacheKey)
if (cached) return cached

const data = await fetchFromDB()
await kv.set(cacheKey, data, { expireIn: 300 }) // 5 min TTL
return data
```

---

## 7. MONITORING & OBSERVABILITY

### 7.1 Application Monitoring

**Supabase Built-in**:
- Database performance dashboard
- API request logs (7-day retention on Pro)
- Storage usage metrics

**External APM** (recommended):
- **Sentry**: Error tracking for web and mobile
- **LogRocket**: Session replay for web admin portal
- **Firebase Performance**: Mobile app performance

### 7.2 Alerts

```yaml
# PagerDuty/Opsgenie alerts
critical:
  - Database CPU > 80% for 5 minutes
  - API error rate > 5% for 1 minute
  - Storage full (> 90%)

warning:
  - Slow queries > 1 second
  - Failed logins > 10 per minute (brute force detection)
  - Realtime connection drops
```

---

## 8. DEPLOYMENT ARCHITECTURE

### 8.1 Environments

**Development**:
- Supabase project: `portun-dev`
- Web: `dev.portun.app` (Vercel preview branches)
- Mobile: Debug builds (not uploaded to stores)

**Staging**:
- Supabase project: `portun-staging`
- Web: `staging.portun.app` (Vercel)
- Mobile: TestFlight (iOS) + Internal Testing (Android)

**Production**:
- Supabase project: `portun-production`
- Web: `www.portun.app` + `admin.portun.app` (Vercel)
- Mobile: App Store + Google Play Store

### 8.2 CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: pnpm test
      - name: Type check
        run: pnpm typecheck
      - name: Lint
        run: pnpm lint

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-functions:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Supabase functions
        run: |
          supabase functions deploy validate-qr
          supabase functions deploy log-entry
          supabase functions deploy payment-notification
```

---

## 9. DISASTER RECOVERY

### 9.1 Backup Strategy

**Database**:
- **Automated daily backups** (Supabase Pro: 7-day retention)
- **Point-in-time recovery** (PITR) available for last 7 days
- **Weekly manual snapshots** to separate S3 bucket (long-term)

**Storage**:
- **Daily incremental backups** of all buckets
- **Versioning enabled** (30-day retention)

**Recovery Procedures**:
- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour (PITR)
- **Disaster Recovery Plan**: See `12-deployment-plan.md` section 8

---

## 10. TECHNOLOGY DECISIONS & TRADE-OFFS

### 10.1 Why Supabase (vs Firebase, AWS Amplify)

**Pros**:
- PostgreSQL (ACID compliance, complex queries, RLS)
- Open source (no vendor lock-in)
- Auto-generated APIs (faster development)
- Better pricing than Firebase
- Realtime built-in

**Cons**:
- Smaller ecosystem than Firebase
- Fewer third-party integrations
- Less mature mobile SDKs

**Decision**: Supabase wins for data integrity and cost for MVP scale.

### 10.2 Why Flutter (vs React Native)

**Pros**:
- Better performance (Dart compiles to native)
- Consistent UI across platforms (Material Design)
- Hot reload (faster development)
- Growing ecosystem

**Cons**:
- Smaller community than React Native
- Less JavaScript ecosystem integration
- Larger app size (4-8MB)

**Decision**: Flutter chosen for existing codebase and performance needs.

### 10.3 Why Vue 3 (vs React, Angular)

**Pros**:
- Existing Vuexy template
- Easier learning curve
- Composition API similar to React hooks
- Vuetify 3 provides complete UI components

**Cons**:
- Smaller talent pool than React
- Fewer third-party libraries

**Decision**: Vue 3 chosen to leverage existing theme and faster MVP delivery.

---

**See Also**:
- Database Schema: `06-database-schema.md`
- API Specification: `07-api-specification.md`
- Security Fixes: `05-security-fixes-priority.md`
- Deployment Plan: `12-deployment-plan.md`
