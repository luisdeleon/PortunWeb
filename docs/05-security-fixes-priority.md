# Security Fixes Priority Plan - Portun.app

**Date**: 2025-11-14
**Version**: 1.0

---

## Overview

This document outlines the prioritized security fixes required before MVP launch.

**Total Effort**: ~32 hours (4 days with 2 engineers)

---

## P0 Fixes (Must Complete Before Launch)

### 1. Move Credentials to Environment Variables
**Time**: 2 hours
**Affected**: PortunMobile, PortunAccess, PortunWeb

**Steps**:
1. Add `flutter_dotenv` to pubspec.yaml
2. Create `.env` file (add to `.gitignore`)
3. Load in `main.dart`
4. Update `supabase.dart` to read from env

**Implementation**:
```dart
// pubspec.yaml
dependencies:
  flutter_dotenv: ^5.1.0

// .env (DO NOT COMMIT)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

// main.dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load(fileName: ".env");
  runApp(MyApp());
}

// supabase.dart
static final supabaseUrl = dotenv.env['SUPABASE_URL']!;
static final supabaseAnonKey = dotenv.env['SUPABASE_ANON_KEY']!;
```

**Verification**: `grep -r "supabase.co" lib/` returns 0 results

---

### 2. Server-Side QR Validation
**Time**: 8 hours
**Affected**: PortunAccess, Supabase Edge Functions

**Create Edge Function**: `/supabase/functions/validate-qr/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { record_uid, guard_uid, timestamp } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Fetch visitor record
  const { data: visitor, error } = await supabase
    .from('visitor_records_uid')
    .select('*, profile!host_uid(*)')
    .eq('record_uid', record_uid)
    .single()

  if (error || !visitor) {
    return new Response(
      JSON.stringify({ valid: false, reason: 'QR code not found' }),
      { status: 200 }
    )
  }

  // Check expiry
  if (new Date(visitor.validity_end) < new Date(timestamp)) {
    return new Response(
      JSON.stringify({ valid: false, reason: 'QR code expired' }),
      { status: 200 }
    )
  }

  // Check entry limit
  if (visitor.entries_used >= visitor.entries_allowed) {
    return new Response(
      JSON.stringify({ valid: false, reason: 'Entry limit exceeded' }),
      { status: 200 }
    )
  }

  // Check blacklist
  const { data: blacklisted } = await supabase
    .from('visitor_blacklist')
    .select('id')
    .or(`visitor_name.ilike.%${visitor.visitor_name}%`)
    .single()

  if (blacklisted) {
    return new Response(
      JSON.stringify({ valid: false, reason: 'Visitor blacklisted' }),
      { status: 200 }
    )
  }

  // All checks passed
  return new Response(
    JSON.stringify({
      valid: true,
      visitor: {
        name: visitor.visitor_name,
        host: visitor.profile.name,
        vehicle: visitor.vehicle_info,
        validity_end: visitor.validity_end,
        entries_used: visitor.entries_used,
        entries_allowed: visitor.entries_allowed
      }
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
```

**Update PortunAccess**:
```dart
Future<ValidationResult> validateQR(String recordUid) async {
  final response = await supabase.functions.invoke(
    'validate-qr',
    body: {
      'record_uid': recordUid,
      'guard_uid': currentUser.id,
      'timestamp': DateTime.now().toUtc().toIso8601String(),
    },
  );
  return ValidationResult.fromJson(response.data);
}
```

**Verification**: Test with expired QR, exceeded limit, blacklisted visitor

---

### 3. Biometric Authentication for Guards
**Time**: 6 hours
**Affected**: PortunAccess

**Implementation**:
```dart
// pubspec.yaml
dependencies:
  local_auth: ^2.1.6

// guard_auth_service.dart
import 'package:local_auth/local_auth.dart';

class GuardAuthService {
  final LocalAuthentication _auth = LocalAuthentication();
  DateTime? _lastAuthTime;
  static const _authTimeout = Duration(minutes: 5);

  Future<bool> requireAuth() async {
    // Check if recent auth is still valid
    if (_lastAuthTime != null &&
        DateTime.now().difference(_lastAuthTime!) < _authTimeout) {
      return true;
    }

    final canAuth = await _auth.canCheckBiometrics;
    if (!canAuth) return true; // Skip if device doesn't support

    final authenticated = await _auth.authenticate(
      localizedReason: 'Authenticate to continue',
      options: const AuthenticationOptions(
        biometricOnly: true,
        stickyAuth: true,
      ),
    );

    if (authenticated) {
      _lastAuthTime = DateTime.now();
    }
    return authenticated;
  }
}

// Usage before sensitive actions
Future<void> scanQRCode() async {
  if (!await guardAuthService.requireAuth()) {
    showError('Authentication required');
    return;
  }
  // Proceed with scan
}
```

**Require biometric before**:
- Scanning QR codes
- Logging entries
- Viewing entry history
- After 5 minutes of inactivity

**Verification**: Lock phone, open app, verify biometric required

---

### 4. Database-Level Entry Limit Enforcement
**Time**: 4 hours
**Affected**: Database schema

**Create Migration**:
```sql
-- Add constraint
ALTER TABLE visitor_records_uid
ADD CONSTRAINT check_entry_limit
CHECK (entries_used <= entries_allowed);

-- Create atomic increment function
CREATE OR REPLACE FUNCTION increment_entry_count(
  p_record_uid TEXT,
  p_guard_uid UUID
)
RETURNS TABLE(success BOOLEAN, message TEXT, entries_used INT) AS $$
DECLARE
  v_entries_used INT;
  v_entries_allowed INT;
BEGIN
  -- Lock row to prevent race conditions
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

**Verification**: Create QR with limit 1, try entering twice - second should fail

---

## P1 Fixes (High Priority)

### 5. Receipt Hash Validation
**Time**: 3 hours

```typescript
// Client-side hash generation
async function hashReceipt(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Store with receipt
const hash = await hashReceipt(receiptFile);
await supabase.from('payment_receipts').insert({
  receipt_hash: `sha256:${hash}`,
  // ... other fields
});
```

---

### 6. Secure Password Reset Flow
**Time**: 4 hours

Use Supabase Auth built-in password reset:
```dart
await supabase.auth.resetPasswordForEmail(
  email,
  redirectTo: 'https://portun.app/reset-password',
);
```

---

### 7. Encrypt Shelly API Credentials
**Time**: 3 hours

Store in Supabase secrets, access via Edge Function only.

---

### 8. API Rate Limiting
**Time**: 2 hours

Add to Edge Functions:
```typescript
const rateLimit = new Map<string, number[]>();

function checkRateLimit(userId: string, limit = 60): boolean {
  const now = Date.now();
  const userCalls = rateLimit.get(userId) || [];
  const recentCalls = userCalls.filter(t => now - t < 60000);

  if (recentCalls.length >= limit) return false;

  recentCalls.push(now);
  rateLimit.set(userId, recentCalls);
  return true;
}
```

---

## Sprint Schedule

### Week 1 (Days 1-2): P0 Security Fixes
| Day | Task | Hours |
|-----|------|-------|
| 1 | Move credentials to env vars | 2h |
| 1 | Server-side QR validation (start) | 4h |
| 2 | Server-side QR validation (complete) | 4h |
| 2 | Biometric authentication | 6h |
| **Total** | | **16h** |

### Week 1 (Days 3-4): P0 + P1 Fixes
| Day | Task | Hours |
|-----|------|-------|
| 3 | Database entry limit enforcement | 4h |
| 3 | Receipt hash validation | 3h |
| 4 | Secure password reset | 4h |
| 4 | Encrypt Shelly credentials | 3h |
| 4 | API rate limiting | 2h |
| **Total** | | **16h** |

---

## Verification Checklist

- [ ] `grep -r "supabase.co" lib/` returns 0 results
- [ ] Expired QR code rejected by server
- [ ] Entry limit enforced at database level
- [ ] Biometric required after 5 min inactivity
- [ ] Receipt hash stored with upload
- [ ] Password reset uses secure flow
- [ ] Shelly credentials not in client code
- [ ] Rate limiting active on Edge Functions

---

*Document maintained by Portun.app Security Team*
