# Database Schema Documentation

**Version**: 1.0
**Database**: PostgreSQL 15 (Supabase)
**Last Updated**: 2025-11-14

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌──────────────────┐
│   community     │1─────∞│    property      │
│─────────────────│       │──────────────────│
│ id (PK)         │       │ id (PK)          │
│ name            │       │ community_id (FK)│
│ address         │       │ name             │
│ city, state     │       │ address          │
│ country         │       │ geofence_lat/lng │
│ geolocation     │       └──────────────────┘
└─────────────────┘              │
                                 │
┌─────────────────┐              │
│    profile      │              │
│─────────────────│              │
│ id (PK)         │1─────────────┘
│ email           │
│ display_name    │
│ enabled         │
│ def_community_id│
└─────────────────┘
       │
       │1
       │
       ∞
┌──────────────────────┐
│ visitor_records_uid  │
│──────────────────────│
│ id (PK)              │
│ host_uid (FK)        │──────┐
│ record_uid (UNIQUE)  │      │
│ visitor_name         │      │
│ qrcode_image_url     │      │
│ validity_start       │      │
│ validity_end         │      │
│ entries_used         │      │
│ entries_allowed      │      │
│ property_id (FK)     │      │
│ community_id (FK)    │      │
└──────────────────────┘      │
       │                      │
       │1                     │
       │                      │
       ∞                      │
┌──────────────────────┐      │
│ visitor_record_logs  │      │
│──────────────────────│      │
│ id (PK)              │      │
│ record_uid (FK)      │──────┘
│ host_uid (FK)        │
│ guard_id (FK)        │
│ in_time              │
│ out_time             │
│ photo_url            │
│ geolocation          │
└──────────────────────┘

┌──────────────────────┐
│  payment_receipts    │
│──────────────────────│
│ id (PK)              │
│ profile_id (FK)      │
│ property_id (FK)     │
│ community_id (FK)    │
│ amount               │
│ payment_date         │
│ receipt_image_url    │
│ receipt_hash         │
│ status               │
│ verified_by (FK)     │
│ verified_at          │
└──────────────────────┘

┌──────────────────────┐
│    audit_log         │
│──────────────────────│
│ id (PK)              │
│ actor_id (FK)        │
│ action               │
│ resource_type        │
│ resource_id          │
│ metadata (JSONB)     │
│ ip_address           │
│ created_at           │
└──────────────────────┘
```

---

## Complete Table Definitions

### visitor_records_uid

```sql
CREATE TABLE visitor_records_uid (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_uid UUID REFERENCES profile(id) ON DELETE CASCADE NOT NULL,
  record_uid TEXT UNIQUE NOT NULL,
  rand_record_uid TEXT UNIQUE,
  visitor_name TEXT NOT NULL,
  visitor_type TEXT CHECK (visitor_type IN ('Guest', 'Delivery', 'Service', 'Family', 'Party')),
  qrcode_image_url TEXT,
  validity_start TIMESTAMPTZ DEFAULT NOW(),
  validity_end TIMESTAMPTZ NOT NULL,
  property_id UUID REFERENCES property(id),
  community_id UUID REFERENCES community(id),
  entries_used INT DEFAULT 0,
  entries_allowed INT DEFAULT 9999,
  document_num TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_entry_limit CHECK (entries_used <= entries_allowed),
  CONSTRAINT check_validity_dates CHECK (validity_end > validity_start)
);

-- Indexes
CREATE INDEX idx_visitor_records_record_uid ON visitor_records_uid(record_uid);
CREATE INDEX idx_visitor_records_community ON visitor_records_uid(community_id);
CREATE INDEX idx_visitor_records_validity ON visitor_records_uid(validity_end);
CREATE INDEX idx_visitor_records_host ON visitor_records_uid(host_uid);
CREATE INDEX idx_visitor_records_active ON visitor_records_uid(validity_end) WHERE validity_end > NOW();

-- Trigger for updated_at
CREATE TRIGGER update_visitor_records_updated_at
BEFORE UPDATE ON visitor_records_uid
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

### visitor_record_logs

```sql
CREATE TABLE visitor_record_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_uid TEXT REFERENCES visitor_records_uid(record_uid) ON DELETE CASCADE,
  host_uid UUID REFERENCES profile(id),
  guard_id UUID REFERENCES profile(id),
  visitor_name TEXT,
  in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  out_time TIMESTAMPTZ,
  photo_url TEXT,
  photo_hash TEXT,
  geolocation POINT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_out_time CHECK (out_time IS NULL OR out_time > in_time)
);

-- Indexes
CREATE INDEX idx_visitor_logs_record_uid ON visitor_record_logs(record_uid);
CREATE INDEX idx_visitor_logs_in_time ON visitor_record_logs(in_time DESC);
CREATE INDEX idx_visitor_logs_guard ON visitor_record_logs(guard_id);
CREATE INDEX idx_visitor_logs_community ON visitor_record_logs(
  (SELECT community_id FROM visitor_records_uid WHERE record_uid = visitor_record_logs.record_uid)
);

-- Enable PostGIS for geolocation
CREATE EXTENSION IF NOT EXISTS postgis;
```

---

### payment_receipts

```sql
CREATE TABLE payment_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profile(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES property(id),
  community_id UUID REFERENCES community(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  reference_number TEXT,
  receipt_image_url TEXT NOT NULL,
  receipt_hash TEXT,
  status TEXT CHECK (status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verified_by UUID REFERENCES profile(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_verified_fields CHECK (
    (status = 'verified' AND verified_by IS NOT NULL AND verified_at IS NOT NULL) OR
    (status != 'verified' AND verified_by IS NULL AND verified_at IS NULL)
  )
);

-- Indexes
CREATE INDEX idx_payment_receipts_status ON payment_receipts(status) WHERE status = 'pending';
CREATE INDEX idx_payment_receipts_profile ON payment_receipts(profile_id);
CREATE INDEX idx_payment_receipts_community ON payment_receipts(community_id);
CREATE INDEX idx_payment_receipts_payment_date ON payment_receipts(payment_date DESC);

-- Trigger
CREATE TRIGGER update_payment_receipts_updated_at
BEFORE UPDATE ON payment_receipts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

### profile

```sql
CREATE TABLE profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  phone TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  def_community_id UUID REFERENCES community(id),
  def_property_id UUID REFERENCES property(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_profile_email ON profile(email);
CREATE INDEX idx_profile_community ON profile(def_community_id);
```

---

### community

```sql
CREATE TABLE community (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'USA',
  geolocation POINT,
  googlemaps TEXT,
  logo_url TEXT,
  timezone TEXT DEFAULT 'America/Chicago',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### property

```sql
CREATE TABLE property (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES community(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  unit_count INT DEFAULT 1,
  geofence_lat DECIMAL(10, 8),
  geofence_lng DECIMAL(11, 8),
  geofence_radius INT DEFAULT 100, -- meters
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_property_community ON property(community_id);
```

---

### automation_devices

```sql
CREATE TABLE automation_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES community(id) ON DELETE CASCADE,
  property_id UUID REFERENCES property(id),
  device_name TEXT NOT NULL,
  device_brand TEXT DEFAULT 'Shelly',
  device_model TEXT,
  api_url TEXT,
  api_endpoint TEXT,
  auth_key TEXT, -- Encrypted with pgp_sym_encrypt
  device_id_in TEXT,
  device_id_out TEXT,
  device_channel_in INT,
  device_channel_out INT,
  direction_type TEXT CHECK (direction_type IN ('entry', 'exit', 'both')),
  enabled BOOLEAN DEFAULT TRUE,
  guest_access BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### audit_log

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profile(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
```

---

### role & profile_role (RBAC)

```sql
CREATE TABLE role (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profile_role (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profile(id) ON DELETE CASCADE,
  role_id UUID REFERENCES role(id) ON DELETE CASCADE,
  community_id UUID REFERENCES community(id),
  path TEXT, -- Permission path for hierarchical access
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, role_id, community_id)
);

-- Seed default roles
INSERT INTO role (role_name, description) VALUES
  ('SuperAdmin', 'Full system access'),
  ('CommunityAdmin', 'Manage specific communities'),
  ('PropertyManager', 'Manage properties within community'),
  ('Guard', 'QR scanning and entry validation'),
  ('Resident', 'Create visitors, upload receipts');
```

---

## Database Functions

### update_updated_at_column()

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### increment_entry_count()

```sql
CREATE OR REPLACE FUNCTION increment_entry_count(p_record_id UUID)
RETURNS TABLE(success BOOLEAN, entries_used INT, entries_allowed INT, message TEXT) AS $$
DECLARE
  v_current_used INT;
  v_allowed INT;
BEGIN
  SELECT entries_used, entries_allowed
  INTO v_current_used, v_allowed
  FROM visitor_records_uid
  WHERE id = p_record_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 0, 'Record not found'::TEXT;
    RETURN;
  END IF;

  IF v_current_used >= v_allowed THEN
    RETURN QUERY SELECT FALSE, v_current_used, v_allowed,
      format('Maximum %s entries already used', v_allowed)::TEXT;
    RETURN;
  END IF;

  UPDATE visitor_records_uid
  SET entries_used = entries_used + 1, updated_at = NOW()
  WHERE id = p_record_id;

  RETURN QUERY SELECT TRUE, v_current_used + 1, v_allowed, 'Entry logged successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;
```

---

### calculate_community_balance()

```sql
CREATE OR REPLACE FUNCTION calculate_community_balance(p_community_id UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN COALESCE((
    SELECT SUM(amount)
    FROM payment_receipts
    WHERE community_id = p_community_id AND status = 'verified'
  ), 0);
END;
$$ LANGUAGE plpgsql;
```

---

## Row Level Security (RLS) Policies

### visitor_records_uid Policies

```sql
ALTER TABLE visitor_records_uid ENABLE ROW LEVEL SECURITY;

-- Residents see only their own visitors
CREATE POLICY "Residents see own visitors"
ON visitor_records_uid FOR SELECT
USING (auth.uid() = host_uid);

-- Residents can create visitors
CREATE POLICY "Residents create visitors"
ON visitor_records_uid FOR INSERT
WITH CHECK (auth.uid() = host_uid);

-- Residents can update their own visitors
CREATE POLICY "Residents update own visitors"
ON visitor_records_uid FOR UPDATE
USING (auth.uid() = host_uid);

-- Guards see all visitors in their assigned communities
CREATE POLICY "Guards see community visitors"
ON visitor_records_uid FOR SELECT
USING (
  community_id IN (
    SELECT cm.community_id
    FROM profile_role pr
    JOIN role r ON pr.role_id = r.id
    LEFT JOIN community_manager cm ON pr.profile_id = cm.profile_id
    WHERE pr.profile_id = auth.uid() AND r.role_name = 'Guard'
  )
);

-- Admins see all data in their communities
CREATE POLICY "Admins full access"
ON visitor_records_uid FOR ALL
USING (
  community_id IN (
    SELECT pr.community_id
    FROM profile_role pr
    JOIN role r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid()
    AND r.role_name IN ('SuperAdmin', 'CommunityAdmin', 'PropertyManager')
  )
);
```

### payment_receipts Policies

```sql
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

-- Residents see only their own receipts
CREATE POLICY "Residents see own receipts"
ON payment_receipts FOR SELECT
USING (auth.uid() = profile_id);

-- Residents can create receipts
CREATE POLICY "Residents create receipts"
ON payment_receipts FOR INSERT
WITH CHECK (auth.uid() = profile_id);

-- Admins can view and verify all receipts in their communities
CREATE POLICY "Admins verify receipts"
ON payment_receipts FOR ALL
USING (
  community_id IN (
    SELECT pr.community_id
    FROM profile_role pr
    JOIN role r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid()
    AND r.role_name IN ('SuperAdmin', 'CommunityAdmin', 'PropertyManager')
  )
);
```

---

## Materialized Views (Performance)

### community_stats

```sql
CREATE MATERIALIZED VIEW community_stats AS
SELECT
  c.id AS community_id,
  c.name AS community_name,
  COUNT(DISTINCT vr.id) AS total_visitors_week,
  COUNT(DISTINCT vrl.id) AS total_entries_week,
  COUNT(DISTINCT pr.id) FILTER (WHERE pr.status = 'pending') AS pending_payments,
  SUM(pr.amount) FILTER (WHERE pr.status = 'verified') AS verified_revenue_month
FROM community c
LEFT JOIN visitor_records_uid vr ON c.id = vr.community_id
  AND vr.created_at > NOW() - INTERVAL '7 days'
LEFT JOIN visitor_record_logs vrl ON vr.record_uid = vrl.record_uid
  AND vrl.in_time > NOW() - INTERVAL '7 days'
LEFT JOIN payment_receipts pr ON c.id = pr.community_id
  AND pr.payment_date > DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.id, c.name;

-- Refresh every hour
SELECT cron.schedule(
  'refresh-community-stats',
  '0 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY community_stats'
);

CREATE UNIQUE INDEX ON community_stats(community_id);
```

---

## Sample Seed Data

```sql
-- Insert test community
INSERT INTO community (id, name, address, city, state, country)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Sunset Gardens HOA', '123 Main St', 'Austin', 'TX', 'USA');

-- Insert test property
INSERT INTO property (id, community_id, name, address, geofence_lat, geofence_lng)
VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000',
   'Building A', '123 Main St Unit 101', 30.2672, -97.7431);

-- Insert test admin user (assumes auth.users entry exists)
INSERT INTO profile (id, email, display_name, def_community_id)
VALUES
  ('770e8400-e29b-41d4-a716-446655440000', 'admin@portun.app', 'System Admin',
   '550e8400-e29b-41d4-a716-446655440000');

-- Assign admin role
INSERT INTO profile_role (profile_id, role_id, community_id)
SELECT '770e8400-e29b-41d4-a716-446655440000', id, '550e8400-e29b-41d4-a716-446655440000'
FROM role WHERE role_name = 'SuperAdmin';
```

---

## Backup & Migration Strategy

**Automated Backups**:
- Daily full backups (Supabase default)
- 7-day retention (Pro plan)
- Point-in-time recovery (PITR) available

**Manual Backups**:
```bash
# Weekly backup to S3
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
aws s3 cp backup_*.sql.gz s3://portun-backups/
```

**Migrations**:
- Stored in `/supabase/migrations/`
- Applied via `supabase db push`
- Versioned with timestamp prefix: `20251114_migration_name.sql`

---

**Total Tables**: 12
**Total Indexes**: 28
**Total Functions**: 3
**Total RLS Policies**: 8
