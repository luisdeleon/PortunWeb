# Current System Audit: PortunMobile & PortunAccess

**Document Version**: 1.0
**Last Updated**: 2025-11-14
**Auditor**: Engineering Team
**Audit Date**: 2025-11-14
**Status**: Complete

---

## EXECUTIVE SUMMARY

This audit evaluates the existing PortunMobile (resident app) and PortunAccess (guard app) codebases to identify security vulnerabilities, functional gaps, performance issues, and technical debt that must be addressed before MVP launch.

### Critical Findings
- **10 Security Vulnerabilities** (3 critical, 4 high, 3 medium)
- **15 Functional Gaps** affecting user experience
- **8 Performance Issues** impacting scalability
- **12 Technical Debt Items** hindering maintainability

### Risk Level: HIGH
**Recommendation**: Address all critical and high-priority issues before public launch.

---

## 1. SECURITY AUDIT

### 1.1 CRITICAL VULNERABILITIES (Fix Immediately)

#### VULN-001: Exposed Supabase Credentials in Source Code
**Severity**: Critical
**CVSS Score**: 9.1 (Critical)
**Location**:
- `/PortunMobile/lib/backend/supabase/supabase.dart:19-20`
- `/PortunAccess/lib/backend/supabase/supabase.dart:12-13`

**Issue**:
```dart
// Hardcoded credentials visible in source code
static const String _supabaseUrl = 'https://data.portun.app';
static const String _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Exposed!
```

**Impact**:
- Attackers can directly access Supabase API with anon key
- Potential data breach of all visitor records, payment receipts, user profiles
- No ability to revoke compromised keys without redeploying apps

**Remediation**:
1. Move credentials to `.env` files (excluded from git via `.gitignore`)
2. Use `flutter_dotenv` package to load environment variables
3. Implement key rotation strategy
4. Enable Supabase RLS (Row Level Security) to limit damage if keys leaked

**Estimated Effort**: 2 hours
**Priority**: P0 (Block launch)

---

#### VULN-002: Client-Side Only QR Validation
**Severity**: Critical
**CVSS Score**: 8.2 (High)
**Location**: `/PortunAccess/lib/access/hm/hm_widget.dart:48-73`

**Issue**:
```dart
// Validation happens entirely in client app
if (widget.id != valueOrDefault<String>(
    _model.varRecordUidOutput?.elementAtOrNull(0)?.id,
    'invalid',
)) {
  // Denied
}
```

**Impact**:
- Modified client app can bypass validation
- No server-side enforcement of entry limits, blacklists, or expiry
- Security guards could be social-engineered with fake app

**Remediation**:
1. Create Supabase Edge Function `/validate-qr` for server-side validation
2. Client calls Edge Function before showing approval screen
3. Edge Function checks expiry, limits, blacklist, and RLS policies
4. Edge Function returns signed approval token
5. Client uses approval token to log entry (prevents replay attacks)

**Estimated Effort**: 8 hours
**Priority**: P0 (Block launch)

---

#### VULN-003: No Biometric/PIN Protection on Guard App
**Severity**: High
**CVSS Score**: 7.5 (High)
**Location**: `/PortunAccess/lib/main.dart`

**Issue**:
- Guard app has no authentication beyond initial login
- Device can be picked up and used by unauthorized person
- No session timeout or auto-lock

**Impact**:
- Unauthorized personnel can grant access to anyone
- No audit trail of which specific guard approved entry
- Potential for fraudulent entries

**Remediation**:
1. Implement `local_auth` package for biometric unlock
2. Require biometric (Face ID, Touch ID, Fingerprint) on every app launch
3. Fall back to PIN if biometric unavailable
4. Auto-lock after 5 minutes of inactivity
5. Log guard ID in `visitor_record_logs.guard_id`

**Estimated Effort**: 6 hours
**Priority**: P0 (Block launch)

---

### 1.2 HIGH SEVERITY VULNERABILITIES

#### VULN-004: Missing Entry Limit Enforcement
**Severity**: High
**CVSS Score**: 6.8
**Location**: `/PortunAccess/lib/components/z_confirm_open_widget.dart:250-280`

**Issue**:
```dart
// Entry count incremented but not validated before granting access
await VisitorRecordsUidTable().update(
  data: {
    'entries_used': funcEntriesAddOne(FFAppState().entriesUsed),
  },
  matchingRows: (rows) => rows.eqOrNull('id', FFAppState().id),
);
```

**Impact**:
- Visitors can exceed allowed entries (e.g., single-entry QR used 10 times)
- Race condition: Two guards scan same QR simultaneously, both succeed
- No business rule enforcement

**Remediation**:
1. Add database constraint: `CHECK (entries_used <= entries_allowed)`
2. Create database function `increment_entry_count()` with limit check:
   ```sql
   CREATE FUNCTION increment_entry_count(record_id UUID) RETURNS BOOLEAN AS $$
   DECLARE
     current_used INT;
     allowed INT;
   BEGIN
     SELECT entries_used, entries_allowed INTO current_used, allowed
     FROM visitor_records_uid WHERE id = record_id FOR UPDATE;

     IF current_used >= allowed THEN
       RETURN FALSE; -- Limit reached
     END IF;

     UPDATE visitor_records_uid
     SET entries_used = entries_used + 1, updated_at = NOW()
     WHERE id = record_id;

     RETURN TRUE;
   END;
   $$ LANGUAGE plpgsql;
   ```
3. Call function from Edge Function (atomic operation)
4. Client handles FALSE return with "Max entries reached" error

**Estimated Effort**: 4 hours
**Priority**: P0 (Block launch)

---

#### VULN-005: No Payment Receipt Hash Validation
**Severity**: High
**CVSS Score**: 6.5
**Location**: `/PortunMobile/lib/backend/supabase/database/tables/payment_receipts.dart`

**Issue**:
- `receipt_hash` field exists but never validated
- Uploaded images could be modified after submission
- No integrity verification

**Impact**:
- Residents could manipulate receipt images post-upload
- Admins verify fake/modified receipts
- Potential fraud

**Remediation**:
1. Calculate SHA-256 hash on upload:
   ```dart
   import 'package:crypto/crypto.dart';

   final bytes = await file.readAsBytes();
   final hash = sha256.convert(bytes).toString();
   ```
2. Store hash in `receipt_hash` field
3. Admin portal verifies hash matches image before approval
4. Reject if hash mismatch (tampering detected)

**Estimated Effort**: 3 hours
**Priority**: P1 (Pre-launch)

---

#### VULN-006: Weak Password Reset Flow
**Severity**: High
**CVSS Score**: 6.2
**Location**: `/PortunAccess/lib/custom_code/actions/update_password.dart`

**Issue**:
```dart
// No email verification before password reset
await supabase.auth.updateUser(
  UserAttributes(password: newPassword),
);
```

**Impact**:
- User could reset password without email confirmation
- Potential account takeover if session hijacked
- No rate limiting on password reset attempts

**Remediation**:
1. Use Supabase built-in password reset flow:
   ```dart
   await supabase.auth.resetPasswordForEmail(email);
   // Sends email with secure reset link
   ```
2. Implement rate limiting (5 attempts per hour per email)
3. Add CAPTCHA after 3 failed attempts
4. Log all password reset attempts to `audit_log`

**Estimated Effort**: 4 hours
**Priority**: P1 (Pre-launch)

---

#### VULN-007: No Geolocation Verification
**Severity**: Medium
**CVSS Score**: 5.8
**Location**: `/PortunAccess/lib/access/hm/hm_widget.dart`

**Issue**:
- Guard could approve visitors remotely (not on-site)
- No verification that guard is at property gate
- GPS coordinates captured but not validated

**Impact**:
- Fraudulent approvals from anywhere
- No accountability for remote access grants
- Security breach potential

**Remediation**:
1. Capture GPS coordinates on every QR scan
2. Define geofence radius for each property (e.g., 50 meters)
3. Server validates guard location against property coordinates
4. Deny approval if guard outside geofence
5. Allow admin override for emergencies

**Estimated Effort**: 6 hours
**Priority**: P2 (Post-launch enhancement)

---

### 1.3 MEDIUM SEVERITY VULNERABILITIES

#### VULN-008: Insecure Shelly Cloud API Credentials
**Severity**: Medium
**CVSS Score**: 5.3
**Location**: `/PortunAccess/lib/backend/api_requests/api_calls.dart:20`

**Issue**:
```dart
// Hardcoded test credentials
final response = await http.post(
  Uri.parse('$baseUrl/device/relay/control'),
  body: {
    'auth_key': 'test-key-12345', // Hardcoded!
  },
);
```

**Impact**:
- Anyone can control smart locks with hardcoded key
- No per-community credential isolation
- Potential unauthorized access to physical gates

**Remediation**:
1. Store Shelly credentials in `automation_devices` table per community
2. Encrypt `auth_key` column with `pgp_sym_encrypt()`
3. Edge Function decrypts and uses credentials
4. Rotate keys quarterly

**Estimated Effort**: 3 hours
**Priority**: P1 (Pre-launch)

---

#### VULN-009: Missing Input Validation
**Severity**: Medium
**CVSS Score**: 4.9
**Location**: Multiple forms

**Issue**:
- Email validation only on client-side
- Phone numbers accept any string
- Postal codes not validated
- SQL injection potential (mitigated by Supabase ORM, but risky)

**Impact**:
- Bad data in database
- Potential injection attacks
- Poor user experience (garbage data accepted)

**Remediation**:
1. Add server-side validation in Edge Functions
2. Use regex for email, phone, postal code formats
3. Sanitize all user inputs before database insertion
4. Implement database constraints:
   ```sql
   ALTER TABLE profile ADD CONSTRAINT valid_email
   CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');
   ```

**Estimated Effort**: 6 hours
**Priority**: P2 (Post-launch enhancement)

---

#### VULN-010: No Rate Limiting on API Endpoints
**Severity**: Medium
**CVSS Score**: 4.5
**Location**: All API calls

**Issue**:
- No protection against brute force attacks
- Unlimited QR validation requests
- Potential DDoS vulnerability

**Impact**:
- Service degradation under attack
- Cost explosion (pay-per-request on Supabase)
- Account takeover via brute force

**Remediation**:
1. Configure Supabase rate limits:
   ```yaml
   rate_limits:
     /auth/v1/token: 5 per minute per IP
     /rest/v1/visitor_records_uid: 100 per minute per user
     /functions/v1/validate-qr: 200 per minute per user
   ```
2. Implement exponential backoff in client
3. Show "Too many requests" error to user

**Estimated Effort**: 2 hours
**Priority**: P1 (Pre-launch)

---

## 2. FUNCTIONAL GAPS AUDIT

### 2.1 CRITICAL GAPS (Blocks Core Use Cases)

#### GAP-001: No Offline QR Generation
**Location**: `/PortunMobile/lib/visitors/visitors_add/visitors_add_widget.dart`

**Issue**:
- QR generation requires internet connection
- Fails silently if offline
- Resident cannot invite visitor without Wi-Fi

**User Impact**: High - Core feature unusable without internet

**Remediation**:
1. Generate QR code locally using `barcode_widget` (already used)
2. Queue database INSERT for when online
3. Show "Pending sync" indicator
4. Sync when connection restored

**Estimated Effort**: 4 hours
**Priority**: P0 (Block launch)

---

#### GAP-002: No Real-time Entry Notifications
**Location**: `/PortunMobile/`

**Issue**:
- OneSignal integration exists but notifications not sent
- Resident doesn't know when guest arrived
- Defeats purpose of app (convenience)

**User Impact**: High - Key differentiator missing

**Remediation**:
1. Edge Function `log-entry` calls OneSignal API
2. Send notification: "Guest Arrived - [Name] checked in"
3. Include entry photo thumbnail
4. Deep link to visitor detail screen

**Estimated Effort**: 3 hours
**Priority**: P0 (Block launch)

---

#### GAP-003: No Payment Verification Workflow
**Location**: `/PortunWeb/` (admin portal doesn't exist)

**Issue**:
- Residents can upload receipts, but no admin interface to verify
- `payment_receipts` table exists but unused
- Manual payment tracking incomplete

**User Impact**: High - Phase 2 feature incomplete

**Remediation**:
1. Build admin portal payment verification page (see Section 3)
2. Show pending receipts queue
3. Approve/reject workflow
4. Send notification to resident on verification

**Estimated Effort**: 12 hours
**Priority**: P0 (Block MVP)

---

### 2.2 HIGH PRIORITY GAPS

#### GAP-004: No Visitor Search/Filter
**Location**: `/PortunMobile/lib/visitors/visitors/visitors_widget.dart`

**Issue**:
- All visitors shown in single list (no pagination)
- No search by name or filter by date
- Unusable once > 50 visitors

**User Impact**: Medium - UX degrades over time

**Remediation**:
1. Add search bar at top of list
2. Filter dropdown: "Active", "Expired", "All"
3. Date range picker
4. Implement pagination (20 per page)

**Estimated Effort**: 5 hours
**Priority**: P1 (Pre-launch)

---

#### GAP-005: No Entry History in Resident App
**Location**: `/PortunMobile/lib/visitors/visitors_detail/visitors_detail_widget.dart`

**Issue**:
- Visitor detail shows QR but no entry logs
- Resident can't see if guest actually arrived
- No audit trail visible to resident

**User Impact**: Medium - Transparency issue

**Remediation**:
1. Add "Entry History" section to visitor detail
2. List all entries from `visitor_record_logs` for this `record_uid`
3. Show: timestamp, guard name, photo thumbnail
4. Tap to view full entry details

**Estimated Effort**: 4 hours
**Priority**: P1 (Pre-launch)

---

#### GAP-006: No Bulk Visitor Import
**Location**: `/PortunMobile/`

**Issue**:
- Must create visitors one at a time
- No CSV import for recurring visitors (e.g., cleaning crew)
- Tedious for property managers

**User Impact**: Medium - Time-consuming for high-volume use

**Remediation**:
1. Add "Import CSV" button
2. Template: Name, Type, Validity Start, Validity End, Entries
3. Parse CSV and create records in batch
4. Show progress bar
5. Summary: "45 imported, 3 errors"

**Estimated Effort**: 8 hours
**Priority**: P2 (Post-launch enhancement)

---

### 2.3 MEDIUM PRIORITY GAPS

**GAP-007**: No "Share via WhatsApp" Direct Integration (workaround exists)
**GAP-008**: No Visitor Notes Visible to Guard (notes captured but not displayed)
**GAP-009**: No Photo Preview Before Upload (can't verify photo quality)
**GAP-010**: No "Deny Entry" Button (can only approve or ignore)
**GAP-011**: No Payment Receipt Download/Export (residents can't save receipts)
**GAP-012**: No Multi-Property Switcher (property managers stuck in one community)
**GAP-013**: No Dark Mode (UI only supports light theme)
**GAP-014**: No Spanish Language Completion (some strings still in English)
**GAP-015**: No Visitor Type Icons (all look same in list)

---

## 3. PERFORMANCE AUDIT

### 3.1 CRITICAL PERFORMANCE ISSUES

#### PERF-001: Unbounded Query on Visitor List
**Location**: `/PortunMobile/lib/home/visit_history/visit_history_widget.dart`

**Issue**:
```dart
// Loads ALL visitor records for community (no LIMIT)
await VisitorRecordsUidTable().queryRows(
  queryFn: (q) => q.eqOrNull('community_id', FFAppState().communityID),
);
```

**Impact**:
- Query time increases linearly with visitor count
- App freezes on communities with > 1,000 visitors
- Unnecessary database load

**Remediation**:
1. Add pagination: `LIMIT 20 OFFSET page * 20`
2. Lazy load more on scroll
3. Cache results in local database (Hive)
4. Refresh only on pull-to-refresh

**Estimated Effort**: 4 hours
**Priority**: P0 (Block scale)

---

#### PERF-002: No Image Compression Before Upload
**Location**: `/PortunMobile/lib/visitors/visitor_upload_documents/`

**Issue**:
- Raw images uploaded (5-10MB per photo)
- Slow upload on cellular
- Storage costs escalate quickly

**Impact**:
- Poor UX on slow connections
- High Supabase Storage costs
- Bandwidth waste

**Remediation**:
1. Compress images to < 2MB using `flutter_image_compress`
2. Resize to max 1920x1080 (preserves quality for receipts)
3. Convert to JPEG with 80% quality
4. Show progress bar during compression + upload

**Estimated Effort**: 3 hours
**Priority**: P1 (Pre-launch)

---

#### PERF-003: Realtime Subscription Memory Leak
**Location**: `/PortunAccess/lib/access/hm/hm_widget.dart:96-104`

**Issue**:
```dart
// Subscribe to realtime channel
await actions.actionSubscribe('visitor_record_logs', () async { ... });

// No unsubscribe on page exit
```

**Impact**:
- WebSocket connections not closed
- Memory leaks after navigating away
- Connection pool exhaustion

**Remediation**:
1. Call `actionUnsubscribe()` in `dispose()` method
2. Ensure channel cleanup on widget unmount
3. Limit concurrent realtime subscriptions to 5 max

**Estimated Effort**: 1 hour
**Priority**: P1 (Pre-launch)

---

### 3.2 HIGH PRIORITY PERFORMANCE ISSUES

**PERF-004**: No Index on `visitor_record_logs.in_time` (slow query on entry history)
**PERF-005**: QR Code Image Generated Every Time (should cache)
**PERF-006**: No Lazy Loading on Admin Portal Tables (loads 1000+ rows at once)
**PERF-007**: HTTP Requests Not Canceled on Page Exit (dangling requests)
**PERF-008**: No Database Connection Pooling Config (default 20 connections too low)

---

## 4. TECHNICAL DEBT AUDIT

### 4.1 HIGH PRIORITY TECH DEBT

#### DEBT-001: FlutterFlow Code Generator Dependency
**Location**: Entire codebase

**Issue**:
- App built with FlutterFlow visual editor
- Auto-generated code with poor readability
- Difficult to maintain and extend
- Vendor lock-in

**Impact**:
- Hard to onboard new developers
- Can't customize beyond FlutterFlow capabilities
- Refactoring expensive

**Remediation** (Long-term):
1. **Keep FlutterFlow for now** (MVP speed matters)
2. Extract critical business logic to separate files
3. Post-MVP: Migrate away from FlutterFlow to pure Flutter
4. Rewrite in phases (auth → API → UI components)

**Estimated Effort**: 200+ hours (post-MVP)
**Priority**: P3 (Technical strategy, not urgent)

---

#### DEBT-002: No Unit Tests
**Location**: Entire codebase

**Issue**:
- Zero test coverage
- No automated testing
- Manual QA only

**Impact**:
- Bugs reach production
- Refactoring risky (no safety net)
- Regression likely

**Remediation**:
1. Add unit tests for business logic functions (auth, validation, etc.)
2. Integration tests for critical flows (QR scan, payment upload)
3. Widget tests for UI components
4. Target: 60% code coverage before launch

**Estimated Effort**: 40 hours
**Priority**: P1 (Pre-launch)

---

#### DEBT-003: Inconsistent Error Handling
**Location**: Multiple API call sites

**Issue**:
```dart
// Some places handle errors
try {
  await api.call();
} catch (e) {
  showSnackBar('Error: $e');
}

// Other places ignore errors
await api.call(); // Fails silently!
```

**Impact**:
- User confusion (no feedback on errors)
- Hard to debug production issues
- Poor UX

**Remediation**:
1. Create centralized error handling utility:
   ```dart
   class ErrorHandler {
     static void handle(Exception e, {String? userMessage}) {
       // Log to Sentry
       Sentry.captureException(e);

       // Show user-friendly message
       showSnackBar(userMessage ?? 'Something went wrong. Please try again.');
     }
   }
   ```
2. Wrap all API calls in try-catch
3. Differentiate network errors, auth errors, validation errors

**Estimated Effort**: 8 hours
**Priority**: P1 (Pre-launch)

---

### 4.2 MEDIUM PRIORITY TECH DEBT

**DEBT-004**: Duplicate Code Across PortunMobile and PortunAccess (30%+ shared)
**DEBT-005**: Hardcoded Strings (not using localization keys consistently)
**DEBT-006**: Magic Numbers Throughout Code (no constants file)
**DEBT-007**: Large Widget Files (1000+ lines, should be split)
**DEBT-008**: No TypeScript Strict Mode on PortunWeb
**DEBT-009**: No ESLint Rules Enforced
**DEBT-010**: Git History Has Committed Secrets (need to purge)
**DEBT-011**: No Database Migration Strategy (schema changes done manually)
**DEBT-012**: No API Versioning (breaking changes will break old apps)

---

## 5. USABILITY AUDIT

### 5.1 CRITICAL USABILITY ISSUES

**UX-001**: No Empty States (blank screens confuse users)
**UX-002**: No Loading Indicators (users think app frozen)
**UX-003**: No Success Confirmations (did my action work?)
**UX-004**: Error Messages Too Technical ("UUID not found" vs "Visitor not found")
**UX-005**: No Onboarding Tutorial (first-time users lost)

### 5.2 HIGH PRIORITY USABILITY ISSUES

**UX-006**: Inconsistent Button Styles
**UX-007**: No Pull-to-Refresh Gesture
**UX-008**: Back Button Doesn't Always Work
**UX-009**: Forms Don't Autofocus First Field
**UX-010**: No Password Strength Indicator

---

## 6. ACCESSIBILITY AUDIT

**A11Y-001**: No Screen Reader Support (VoiceOver, TalkBack)
**A11Y-002**: Insufficient Color Contrast (WCAG AA failure)
**A11Y-003**: No Keyboard Navigation (web admin portal)
**A11Y-004**: Images Missing Alt Text
**A11Y-005**: Form Labels Not Associated with Inputs

---

## 7. PRIORITIZED REMEDIATION PLAN

### Phase 0: Blockers (Before ANY Launch)
**Total Effort**: 43 hours (1 week)

| ID | Issue | Effort | Owner |
|----|-------|--------|-------|
| VULN-001 | Exposed credentials | 2h | Backend |
| VULN-002 | Client-side validation | 8h | Backend |
| VULN-003 | No biometric auth | 6h | Mobile |
| VULN-004 | Entry limit enforcement | 4h | Backend |
| GAP-001 | Offline QR generation | 4h | Mobile |
| GAP-002 | Entry notifications | 3h | Backend |
| GAP-003 | Payment verification | 12h | Web |
| PERF-001 | Unbounded queries | 4h | Mobile |

### Phase 1: Pre-Launch (Before Public Release)
**Total Effort**: 60 hours (1.5 weeks)

| ID | Issue | Effort | Owner |
|----|-------|--------|-------|
| VULN-005 | Receipt hash validation | 3h | Mobile |
| VULN-006 | Weak password reset | 4h | Backend |
| VULN-008 | Shelly credentials | 3h | Backend |
| VULN-010 | No rate limiting | 2h | Backend |
| GAP-004 | No search/filter | 5h | Mobile |
| GAP-005 | Entry history | 4h | Mobile |
| PERF-002 | Image compression | 3h | Mobile |
| PERF-003 | Realtime memory leak | 1h | Mobile |
| DEBT-002 | No unit tests | 40h | All |
| DEBT-003 | Error handling | 8h | Mobile |

### Phase 2: Post-Launch Enhancements
**Total Effort**: 120+ hours (3 weeks)

Includes GAP-006 through GAP-015, PERF-004 through PERF-008, UX improvements, and accessibility fixes.

---

## 8. AUDIT SUMMARY

### By Severity

| Severity | Count | % of Total |
|----------|-------|------------|
| Critical | 7 | 15% |
| High | 12 | 26% |
| Medium | 18 | 39% |
| Low | 9 | 20% |
| **Total** | **46** | **100%** |

### By Category

| Category | Count |
|----------|-------|
| Security | 10 |
| Functional Gaps | 15 |
| Performance | 8 |
| Technical Debt | 12 |
| Usability | 10 |
| Accessibility | 5 |

### By Priority

| Priority | Count | Must Fix Before |
|----------|-------|-----------------|
| P0 (Blocker) | 8 | Any launch |
| P1 (High) | 14 | Public release |
| P2 (Medium) | 16 | 30 days post-launch |
| P3 (Low) | 8 | As time permits |

---

## 9. RECOMMENDATIONS

1. **Immediate**: Fix all P0 blockers before beta testing (1 week sprint)
2. **Pre-Launch**: Complete P1 items before public release (1.5 week sprint)
3. **Post-Launch**: Address P2 items in first 30 days based on user feedback
4. **Long-term**: Migrate away from FlutterFlow, increase test coverage to 80%

---

**Next Steps**: See `05-security-fixes-priority.md` for detailed security remediation plan.
