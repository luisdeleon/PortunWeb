# Database Schema - Portun.app

**Date**: 2025-11-14
**Version**: 1.0

---

## Entity Relationship Diagram

```
┌─────────────────┐
│   communities   │
│─────────────────│
│ id (PK)         │──┐
│ name            │  │
│ address         │  │
│ created_at      │  │
└─────────────────┘  │
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│    profile      │     │ community_gates │
│─────────────────│     │─────────────────│
│ id (PK)         │──┐  │ id (PK)         │
│ community_id(FK)│  │  │ community_id(FK)│
│ name            │  │  │ gate_name       │
│ role            │  │  │ shelly_device_id│
│ phone           │  │  └─────────────────┘
│ unit_number     │  │
│ created_at      │  │
└─────────────────┘  │
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│visitor_records_ │     │payment_receipts │
│      uid        │     │─────────────────│
│─────────────────│     │ id (PK)         │
│ id (PK)         │     │ resident_uid(FK)│
│ host_uid (FK)   │──┐  │ community_id(FK)│
│ record_uid      │  │  │ month           │
│ visitor_name    │  │  │ receipt_url     │
│ validity_end    │  │  │ status          │
│ entries_used    │  │  │ verified_at     │
│ entries_allowed │  │  └─────────────────┘
│ created_at      │  │
└─────────────────┘  │
                     │
                     ▼
           ┌─────────────────┐
           │   entry_logs    │
           │─────────────────│
           │ id (PK)         │
           │ visitor_uid (FK)│
           │ guard_uid (FK)  │
           │ entry_time      │
           │ photo_url       │
           │ notes           │
           └─────────────────┘
```

---

## Table Definitions

### communities
```sql
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  total_units INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_communities_active ON communities(active);
```

---

### profile
```sql
CREATE TABLE profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('resident', 'guard', 'admin', 'owner')),
  unit_number TEXT,
  profile_photo_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profile_community ON profile(community_id);
CREATE INDEX idx_profile_role ON profile(role);
CREATE INDEX idx_profile_email ON profile(email);
```

**RLS Policies**:
```sql
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view profiles in their community"
ON profile FOR SELECT
USING (
  community_id = (SELECT community_id FROM profile WHERE id = auth.uid())
);

CREATE POLICY "Users can update own profile"
ON profile FOR UPDATE
USING (id = auth.uid());
```

---

### visitor_records_uid
```sql
CREATE TABLE visitor_records_uid (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_uid UUID REFERENCES profile(id) NOT NULL,
  record_uid TEXT UNIQUE NOT NULL,
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT,
  vehicle_info TEXT,
  validity_end TIMESTAMPTZ NOT NULL,
  entries_used INT DEFAULT 0,
  entries_allowed INT DEFAULT 9999,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_entry_limit CHECK (entries_used <= entries_allowed)
);

CREATE INDEX idx_visitor_host ON visitor_records_uid(host_uid);
CREATE INDEX idx_visitor_record_uid ON visitor_records_uid(record_uid);
CREATE INDEX idx_visitor_validity ON visitor_records_uid(validity_end)
  WHERE validity_end > NOW();
CREATE INDEX idx_visitor_active ON visitor_records_uid(host_uid, validity_end)
  WHERE validity_end > NOW();
```

**RLS Policies**:
```sql
ALTER TABLE visitor_records_uid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents view own visitors"
ON visitor_records_uid FOR SELECT
USING (host_uid = auth.uid());

CREATE POLICY "Residents create own visitors"
ON visitor_records_uid FOR INSERT
WITH CHECK (host_uid = auth.uid());

CREATE POLICY "Guards view active visitors in community"
ON visitor_records_uid FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profile p
    WHERE p.id = auth.uid()
    AND p.role = 'guard'
    AND p.community_id = (
      SELECT community_id FROM profile WHERE id = host_uid
    )
  )
  AND validity_end > NOW()
);
```

---

### entry_logs
```sql
CREATE TABLE entry_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_uid UUID REFERENCES visitor_records_uid(id) NOT NULL,
  guard_uid UUID REFERENCES profile(id) NOT NULL,
  entry_time TIMESTAMPTZ DEFAULT NOW(),
  exit_time TIMESTAMPTZ,
  photo_url TEXT,
  vehicle_photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_entry_logs_visitor ON entry_logs(visitor_uid);
CREATE INDEX idx_entry_logs_guard ON entry_logs(guard_uid);
CREATE INDEX idx_entry_logs_time ON entry_logs(entry_time DESC);
CREATE INDEX idx_entry_logs_recent ON entry_logs(entry_time DESC)
  WHERE entry_time > NOW() - INTERVAL '30 days';
```

**RLS Policies**:
```sql
ALTER TABLE entry_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts view entries for their visitors"
ON entry_logs FOR SELECT
USING (
  visitor_uid IN (
    SELECT id FROM visitor_records_uid WHERE host_uid = auth.uid()
  )
);

CREATE POLICY "Guards view and create entries"
ON entry_logs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profile WHERE id = auth.uid() AND role = 'guard'
  )
);

CREATE POLICY "Admins view all entries in community"
ON entry_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profile p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'owner')
  )
);
```

---

### payment_receipts
```sql
CREATE TABLE payment_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_uid UUID REFERENCES profile(id) NOT NULL,
  community_id UUID REFERENCES communities(id) NOT NULL,
  month TEXT NOT NULL, -- Format: "2025-01"
  amount DECIMAL(10,2),
  receipt_url TEXT NOT NULL,
  receipt_hash TEXT,
  status TEXT CHECK (status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verified_by UUID REFERENCES profile(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resident_uid, month)
);

CREATE INDEX idx_payment_resident ON payment_receipts(resident_uid);
CREATE INDEX idx_payment_community ON payment_receipts(community_id);
CREATE INDEX idx_payment_status ON payment_receipts(status);
CREATE INDEX idx_payment_month ON payment_receipts(month);
CREATE INDEX idx_payment_pending ON payment_receipts(created_at)
  WHERE status = 'pending';
```

**RLS Policies**:
```sql
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents view own receipts"
ON payment_receipts FOR SELECT
USING (resident_uid = auth.uid());

CREATE POLICY "Residents create own receipts"
ON payment_receipts FOR INSERT
WITH CHECK (resident_uid = auth.uid());

CREATE POLICY "Admins view and update community receipts"
ON payment_receipts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profile p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'owner')
    AND p.community_id = community_id
  )
);
```

---

### visitor_blacklist
```sql
CREATE TABLE visitor_blacklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES communities(id) NOT NULL,
  visitor_name TEXT,
  visitor_phone TEXT,
  reason TEXT NOT NULL,
  created_by UUID REFERENCES profile(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_blacklist_community ON visitor_blacklist(community_id);
CREATE INDEX idx_blacklist_active ON visitor_blacklist(community_id, active)
  WHERE active = TRUE;
```

---

### community_gates
```sql
CREATE TABLE community_gates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES communities(id) NOT NULL,
  gate_name TEXT NOT NULL,
  shelly_device_id TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gates_community ON community_gates(community_id);
```

---

## Database Functions

### increment_entry_count
```sql
CREATE OR REPLACE FUNCTION increment_entry_count(
  p_record_uid TEXT,
  p_guard_uid UUID
)
RETURNS TABLE(success BOOLEAN, message TEXT, entries_used INT) AS $$
DECLARE
  v_entries_used INT;
  v_entries_allowed INT;
BEGIN
  SELECT entries_used, entries_allowed
  INTO v_entries_used, v_entries_allowed
  FROM visitor_records_uid
  WHERE record_uid = p_record_uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Visitor record not found'::TEXT, 0;
    RETURN;
  END IF;

  IF v_entries_used >= v_entries_allowed THEN
    RETURN QUERY SELECT FALSE, 'Entry limit exceeded'::TEXT, v_entries_used;
    RETURN;
  END IF;

  UPDATE visitor_records_uid
  SET entries_used = entries_used + 1,
      updated_at = NOW()
  WHERE record_uid = p_record_uid;

  RETURN QUERY SELECT TRUE, 'Entry counted'::TEXT, v_entries_used + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### get_community_stats
```sql
CREATE OR REPLACE FUNCTION get_community_stats(p_community_id UUID)
RETURNS TABLE(
  total_residents BIGINT,
  active_visitors BIGINT,
  entries_today BIGINT,
  pending_payments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profile WHERE community_id = p_community_id AND active = TRUE),
    (SELECT COUNT(*) FROM visitor_records_uid v
     JOIN profile p ON v.host_uid = p.id
     WHERE p.community_id = p_community_id AND v.validity_end > NOW()),
    (SELECT COUNT(*) FROM entry_logs e
     JOIN visitor_records_uid v ON e.visitor_uid = v.id
     JOIN profile p ON v.host_uid = p.id
     WHERE p.community_id = p_community_id
     AND e.entry_time::DATE = CURRENT_DATE),
    (SELECT COUNT(*) FROM payment_receipts
     WHERE community_id = p_community_id AND status = 'pending');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Storage Buckets

### payment-receipts
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', false);

-- Residents upload own receipts
CREATE POLICY "Residents upload own receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-receipts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Residents view own receipts
CREATE POLICY "Residents view own receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-receipts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### entry-photos
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('entry-photos', 'entry-photos', false);

-- Guards upload entry photos
CREATE POLICY "Guards upload entry photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'entry-photos'
  AND EXISTS (
    SELECT 1 FROM profile WHERE id = auth.uid() AND role = 'guard'
  )
);
```

---

*Document maintained by Portun.app Engineering Team*
