# Security Fixes Priority Plan

**Document Version**: 1.0
**Last Updated**: 2025-11-14
**Owner**: Security Team
**Timeline**: 1 week (40 hours)

---

## CRITICAL FIXES (P0) - Complete Before Any Launch

### 1. Move Supabase Credentials to Environment Variables (2 hours)

**Files to Modify**:
- `/PortunMobile/lib/backend/supabase/supabase.dart`
- `/PortunAccess/lib/backend/supabase/supabase.dart`

**Implementation**:
```dart
// Before (VULNERABLE):
static const String _supabaseUrl = 'https://data.portun.app';
static const String _supabaseAnonKey = 'eyJhbG...'; // Exposed!

// After (SECURE):
import 'package:flutter_dotenv/flutter_dotenv.dart';

static final String _supabaseUrl = dotenv.env['SUPABASE_URL']!;
static final String _supabaseAnonKey = dotenv.env['SUPABASE_ANON_KEY']!;
```

**Steps**:
1. Add `flutter_dotenv` to pubspec.yaml
2. Create `.env` file (add to .gitignore)
3. Create `.env.example` with placeholder values
4. Load dotenv in main.dart: `await dotenv.load()`
5. Update build scripts to inject env vars

**Verification**:
```bash
# Ensure .env is in .gitignore
grep "\.env" .gitignore

# Search codebase for hardcoded keys (should be none)
grep -r "eyJhbG" lib/
```

---

### 2. Implement Server-Side QR Validation (8 hours)

**Create Edge Function**: `/supabase/functions/validate-qr/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ValidationRequest {
  record_uid: string
  guard_id: string
  geolocation?: { lat: number, lng: number }
}

serve(async (req) => {
  const { record_uid, guard_id, geolocation }: ValidationRequest = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Fetch visitor record
  const { data: visitor, error } = await supabase
    .from('visitor_records_uid')
    .select('*, profile!inner(display_name)')
    .eq('record_uid', record_uid)
    .single()

  if (error || !visitor) {
    return new Response(JSON.stringify({
      access_granted: false,
      reason: 'QR_NOT_FOUND',
      message: 'Visitor record not found'
    }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  }

  // 2. Check expiration
  if (new Date(visitor.validity_end) < new Date()) {
    return new Response(JSON.stringify({
      access_granted: false,
      reason: 'QR_EXPIRED',
      message: `QR code expired on ${visitor.validity_end}`
    }), { status: 403, headers: { 'Content-Type': 'application/json' } })
  }

  // 3. Check entry limits
  if (visitor.entries_used >= visitor.entries_allowed) {
    return new Response(JSON.stringify({
      access_granted: false,
      reason: 'LIMIT_REACHED',
      message: `Maximum ${visitor.entries_allowed} entries already used`
    }), { status: 403, headers: { 'Content-Type': 'application/json' } })
  }

  // 4. Check blacklist (future feature)
  const { data: blacklisted } = await supabase
    .from('blacklist')
    .select('id')
    .eq('record_uid', record_uid)
    .maybeSingle()

  if (blacklisted) {
    return new Response(JSON.stringify({
      access_granted: false,
      reason: 'BLACKLISTED',
      message: 'This visitor has been blacklisted'
    }), { status: 403, headers: { 'Content-Type': 'application/json' } })
  }

  // 5. Validate geolocation (if provided)
  if (geolocation && visitor.property_id) {
    const { data: property } = await supabase
      .from('property')
      .select('geofence_lat, geofence_lng, geofence_radius')
      .eq('id', visitor.property_id)
      .single()

    if (property && property.geofence_lat) {
      const distance = calculateDistance(
        geolocation.lat, geolocation.lng,
        property.geofence_lat, property.geofence_lng
      )

      if (distance > (property.geofence_radius || 100)) {
        // Log warning but don't block (guard might be at secondary gate)
        console.warn(`Guard ${guard_id} outside geofence: ${distance}m`)
      }
    }
  }

  // 6. Success - return visitor details
  return new Response(JSON.stringify({
    access_granted: true,
    visitor: {
      name: visitor.visitor_name,
      type: visitor.visitor_type,
      host_name: visitor.profile.display_name,
      entries_used: visitor.entries_used,
      entries_allowed: visitor.entries_allowed,
      notes: visitor.notes
    }
  }), { status: 200, headers: { 'Content-Type': 'application/json' } })
})

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = lat1 * Math.PI/180
  const φ2 = lat2 * Math.PI/180
  const Δφ = (lat2-lat1) * Math.PI/180
  const Δλ = (lon2-lon1) * Math.PI/180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}
```

**Client Update** (`PortunAccess`):
```dart
// Call Edge Function instead of direct query
final response = await http.post(
  Uri.parse('${supabaseUrl}/functions/v1/validate-qr'),
  headers: {
    'Authorization': 'Bearer ${supabase.auth.currentSession?.accessToken}',
    'Content-Type': 'application/json',
  },
  body: jsonEncode({
    'record_uid': scannedQR,
    'guard_id': currentUserId,
    'geolocation': {
      'lat': currentLocation.latitude,
      'lng': currentLocation.longitude,
    }
  }),
);

final result = jsonDecode(response.body);
if (result['access_granted']) {
  // Show approval screen
} else {
  // Show denial screen with reason
  showError(result['message']);
}
```

**Deploy Function**:
```bash
supabase functions deploy validate-qr --project-ref <project-id>
```

---

### 3. Add Biometric Authentication to Guard App (6 hours)

**Add Dependency**:
```yaml
# pubspec.yaml
dependencies:
  local_auth: ^2.1.6
```

**Implementation**:
```dart
// lib/auth/biometric_auth.dart
import 'package:local_auth/local_auth.dart';

class BiometricAuth {
  static final LocalAuthentication auth = LocalAuthentication();

  static Future<bool> isAvailable() async {
    final bool canAuthenticateWithBiometrics = await auth.canCheckBiometrics;
    final bool canAuthenticate = canAuthenticateWithBiometrics || await auth.isDeviceSupported();
    return canAuthenticate;
  }

  static Future<bool> authenticate() async {
    try {
      final bool didAuthenticate = await auth.authenticate(
        localizedReason: 'Authenticate to access guard controls',
        options: const AuthenticationOptions(
          biometricOnly: false, // Allow PIN fallback
          stickyAuth: true,
        ),
      );
      return didAuthenticate;
    } catch (e) {
      print('Biometric auth error: $e');
      return false;
    }
  }
}

// lib/main.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Check if authenticated
  if (await BiometricAuth.isAvailable()) {
    final authenticated = await BiometricAuth.authenticate();
    if (!authenticated) {
      // Exit app or show lock screen
      SystemNavigator.pop();
      return;
    }
  }
  
  runApp(MyApp());
}

// Auto-lock after 5 minutes
class AutoLockObserver extends WidgetsBindingObserver {
  DateTime? _pausedTime;

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      _pausedTime = DateTime.now();
    } else if (state == AppLifecycleState.resumed) {
      if (_pausedTime != null) {
        final duration = DateTime.now().difference(_pausedTime!);
        if (duration.inMinutes >= 5) {
          // Require re-authentication
          BiometricAuth.authenticate();
        }
      }
    }
  }
}
```

---

### 4. Database Constraint for Entry Limits (4 hours)

**Database Migration**:
```sql
-- /supabase/migrations/20251114_entry_limit_enforcement.sql

-- Add constraint to prevent exceeded entries
ALTER TABLE visitor_records_uid
ADD CONSTRAINT check_entry_limit
CHECK (entries_used <= entries_allowed);

-- Create atomic increment function
CREATE OR REPLACE FUNCTION increment_entry_count(p_record_id UUID)
RETURNS TABLE(success BOOLEAN, entries_used INT, entries_allowed INT, message TEXT) AS $$
DECLARE
  v_current_used INT;
  v_allowed INT;
  v_record_uid TEXT;
BEGIN
  -- Lock row for update
  SELECT entries_used, entries_allowed, record_uid
  INTO v_current_used, v_allowed, v_record_uid
  FROM visitor_records_uid
  WHERE id = p_record_id
  FOR UPDATE;

  -- Check if record exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 0, 'Record not found'::TEXT;
    RETURN;
  END IF;

  -- Check if limit reached
  IF v_current_used >= v_allowed THEN
    RETURN QUERY SELECT FALSE, v_current_used, v_allowed,
      format('Maximum %s entries already used', v_allowed)::TEXT;
    RETURN;
  END IF;

  -- Increment counter
  UPDATE visitor_records_uid
  SET
    entries_used = entries_used + 1,
    updated_at = NOW()
  WHERE id = p_record_id;

  -- Return success
  RETURN QUERY SELECT TRUE, v_current_used + 1, v_allowed, 'Entry logged successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_visitor_records_entries
ON visitor_records_uid(id, entries_used, entries_allowed);
```

**Edge Function Update**:
```typescript
// In /supabase/functions/log-entry/index.ts
const { data, error } = await supabase.rpc('increment_entry_count', {
  p_record_id: visitor.id
})

if (!data[0].success) {
  return new Response(JSON.stringify({
    success: false,
    message: data[0].message
  }), { status: 403 })
}

// Continue with logging...
```

---

## HIGH PRIORITY FIXES (P1) - Complete Before Public Launch

### 5. Receipt Hash Validation (3 hours)
### 6. Secure Password Reset Flow (4 hours)  
### 7. Encrypt Shelly API Credentials (3 hours)
### 8. Implement Rate Limiting (2 hours)

See full implementation details in `04-current-system-audit.md` Section 1.

---

## DEPLOYMENT CHECKLIST

**Before Deploying Security Fixes**:
- [ ] All environment variables configured in production
- [ ] .env files added to .gitignore (verify with `git status`)
- [ ] Database migrations tested on staging
- [ ] Edge Functions deployed and tested
- [ ] Biometric auth tested on physical devices (iOS and Android)
- [ ] Rate limits configured in Supabase dashboard
- [ ] Security audit passed (penetration testing)

**Post-Deployment Verification**:
- [ ] Scan app with OWASP ZAP (no critical vulnerabilities)
- [ ] Test with expired QR codes (should deny)
- [ ] Test with exceeded entry limits (should deny)
- [ ] Test biometric auth on 5 different devices
- [ ] Verify no secrets in GitHub repo history

---

## SECURITY MONITORING

**Ongoing**:
1. Enable Supabase audit logs
2. Set up alerts for:
   - Failed authentication attempts > 10/minute
   - Database errors > 1%
   - API 4xx/5xx errors > 5%
3. Weekly security scans with automated tools
4. Quarterly penetration testing

**Incident Response Plan**: See `12-deployment-plan.md` Section 9

---

**Total Effort**: 31 hours
**Timeline**: 4 days with 2 engineers
**Critical Path**: Items 1-4 must be sequential
