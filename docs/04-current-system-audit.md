# Current System Audit - Portun.app

**Date**: 2025-11-14
**Version**: 1.0

---

## Audit Summary

| Category | Total Issues | P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low) |
|----------|--------------|---------------|-----------|-------------|----------|
| Security Vulnerabilities | 10 | 3 | 4 | 2 | 1 |
| Functional Gaps | 15 | 3 | 4 | 6 | 2 |
| Performance Issues | 8 | 0 | 2 | 3 | 3 |
| Technical Debt | 12 | 0 | 2 | 5 | 5 |
| **Total** | **46** | **6** | **12** | **16** | **12** |

---

## Security Vulnerabilities

### VULN-001: Hardcoded Supabase Credentials (P0)
**Location**: `lib/backend/supabase/supabase.dart`

**Current Code**:
```dart
static const String _supabaseUrl = 'https://abc123.supabase.co';
static const String _supabaseAnonKey = 'eyJ...EXPOSED_KEY...';
```

**Risk**: Anyone with APK can extract keys and access database

**Fix**:
```dart
// Use flutter_dotenv package
static final String _supabaseUrl = dotenv.env['SUPABASE_URL']!;
static final String _supabaseAnonKey = dotenv.env['SUPABASE_ANON_KEY']!;
```

**Effort**: 2 hours

---

### VULN-002: Client-Side Only QR Validation (P0)
**Location**: PortunAccess QR scanning flow

**Current Code**: Validation happens entirely in Flutter app with no server verification

**Risk**: Guard can modify app to bypass validation

**Fix**: Create Edge Function for server-side validation

**Effort**: 8 hours

---

### VULN-003: No Biometric Protection on Guard App (P0)
**Location**: PortunAccess authentication flow

**Current State**: Guard logs in once, stays logged in forever

**Risk**: Unauthorized access if guard's phone stolen/borrowed

**Fix**: Add `local_auth` package, require biometric for sensitive actions

**Effort**: 6 hours

---

### VULN-004: Payment Receipts Not Hashed (P1)
**Location**: Payment upload flow

**Risk**: Receipts can be tampered with, no integrity verification

**Fix**: Generate SHA-256 hash before upload, verify on admin review

**Effort**: 3 hours

---

### VULN-005: Password Reset via Client-Side Email Only (P1)
**Location**: Authentication flow

**Risk**: Password reset tokens could be intercepted

**Fix**: Use Supabase Auth built-in secure password reset

**Effort**: 4 hours

---

### VULN-006: Shelly API Credentials in Plain Text (P1)
**Location**: Gate control integration

**Risk**: API credentials exposed, unauthorized gate access

**Fix**: Encrypt credentials, store in secure environment variables

**Effort**: 3 hours

---

### VULN-007: No Rate Limiting on API Calls (P1)
**Location**: All API endpoints

**Risk**: Brute force attacks, DoS potential

**Fix**: Implement rate limiting via Edge Functions or Supabase policies

**Effort**: 2 hours

---

### VULN-008: Profile Photos Public Without Auth (P2)
**Location**: Storage bucket configuration

**Risk**: Privacy violation, photos accessible without authentication

**Fix**: Add RLS policies to storage bucket

**Effort**: 2 hours

---

### VULN-009: Entry Logs Filterable by Anyone (P2)
**Location**: Entry logs query

**Risk**: Privacy violation, users can see other residents' visitors

**Fix**: Add RLS policy to restrict to own visitors or community admins

**Effort**: 2 hours

---

### VULN-010: Device IDs Not Rotated (P3)
**Location**: Push notification registration

**Risk**: Stale device tokens, potential for notification hijacking

**Fix**: Implement device ID rotation on re-authentication

**Effort**: 4 hours

---

## Functional Gaps

### GAP-001: No Offline QR Generation for Residents (P0)
**Impact**: Residents can't create QR codes without internet
**Fix**: Cache last used visitor templates, generate QR locally, sync when online
**Effort**: 12 hours

---

### GAP-002: Entry Limits Not Enforced at Database Level (P0)
**Impact**: Visitors can enter unlimited times despite restrictions
**Fix**: Database function with constraint check, atomic increment
**Effort**: 4 hours

---

### GAP-003: Payment Verification Workflow Incomplete (P0)
**Impact**: Admins can't efficiently verify/reject receipts
**Fix**: Build verification queue in admin portal
**Effort**: 8 hours

---

### GAP-004: No Real-Time Entry Notifications (P1)
**Impact**: Residents don't know when visitors arrive
**Fix**: Trigger OneSignal push on entry log insert
**Effort**: 4 hours

---

### GAP-005: QR Codes Don't Expire Server-Side (P1)
**Impact**: Expired QR codes might still work
**Fix**: Server-side validation checks validity_end
**Effort**: Included in VULN-002 fix

---

### GAP-006: No Visitor Blacklist System (P1)
**Impact**: Can't block problematic visitors
**Fix**: Add blacklist table, check during validation
**Effort**: 6 hours

---

### GAP-007: Guard Can't Add Notes to Entry Logs (P1)
**Impact**: No context for security incidents
**Fix**: Add notes field to entry form
**Effort**: 2 hours

---

### GAP-008: No Bulk Resident Import (P2)
**Impact**: Manual entry for large communities is tedious
**Fix**: CSV import in admin portal
**Effort**: 8 hours

---

### GAP-009: Payment Reports Not Exportable (P2)
**Impact**: Admins can't share reports with HOA board
**Fix**: Add CSV export functionality
**Effort**: 4 hours

---

### GAP-010: No Community-Level Analytics (P2)
**Impact**: No visibility into usage patterns
**Fix**: Dashboard with key metrics
**Effort**: 12 hours

---

### GAP-011: Visitors Can't Pre-Register (P2)
**Impact**: No self-service for expected visitors
**Fix**: Public registration form (Phase 2)
**Effort**: 16 hours

---

### GAP-012: No Recurring Visitor Templates (P2)
**Impact**: Must recreate QR for regular visitors
**Fix**: Save visitor templates, quick re-generate
**Effort**: 8 hours

---

### GAP-013: QR Codes Not Shareable via WhatsApp (P2)
**Impact**: Awkward sharing experience for LATAM users
**Fix**: Deep link + image share integration
**Effort**: 6 hours

---

### GAP-014: No Gate Hardware Auto-Trigger (P3)
**Impact**: Manual gate opening after validation
**Fix**: Shelly API integration (Phase 2)
**Effort**: 12 hours

---

### GAP-015: Admin Can't Send Broadcast Messages (P3)
**Impact**: No community-wide communication
**Fix**: Announcement feature (Phase 2)
**Effort**: 8 hours

---

## Performance Issues

### PERF-001: Visitor List Query Unbounded (P1)
**Location**: Visitor list screens
**Impact**: Slow load times with many visitors
**Fix**: Add pagination (20 items per page)
**Effort**: 4 hours

---

### PERF-002: Payment Receipts Not Compressed (P1)
**Location**: Receipt upload flow
**Impact**: Large uploads, slow, expensive storage
**Fix**: Compress to < 1MB before upload
**Effort**: 3 hours

---

### PERF-003: Entry Photos Full Resolution (P2)
**Location**: Entry photo capture
**Impact**: 10MB+ photos filling storage
**Fix**: Resize to 1920px max dimension
**Effort**: 2 hours

---

### PERF-004: Real-Time Listeners Not Cleaned Up (P2)
**Location**: Various screens
**Impact**: Memory leaks, stale subscriptions
**Fix**: Proper dispose() handling
**Effort**: 4 hours

---

### PERF-005: No Image Caching in Guard App (P2)
**Location**: Entry log photos
**Impact**: Re-downloading images repeatedly
**Fix**: Implement cached_network_image
**Effort**: 2 hours

---

### PERF-006: Multiple Supabase Clients (P3)
**Location**: Various files
**Impact**: Unnecessary connections
**Fix**: Singleton pattern
**Effort**: 2 hours

---

### PERF-007: QR Code Regenerated Every Screen Open (P3)
**Location**: QR display screen
**Impact**: Unnecessary computation
**Fix**: Cache generated QR image
**Effort**: 1 hour

---

### PERF-008: No Database Indexes (P3)
**Location**: Database schema
**Impact**: Slow queries as data grows
**Fix**: Add indexes on foreign keys and common filters
**Effort**: 2 hours

---

## Technical Debt

### DEBT-001: FFAppState Overused (P1)
**Location**: Throughout PortunMobile
**Impact**: Hard to test, unpredictable state
**Fix**: Migrate to Riverpod or Bloc (Phase 2)
**Effort**: 40 hours

---

### DEBT-002: Hardcoded Strings (P1)
**Location**: Throughout both apps
**Impact**: Can't localize, hard to update
**Fix**: Implement i18n system
**Effort**: 16 hours

---

### DEBT-003: Duplicate Code in Apps (P2)
**Location**: PortunMobile and PortunAccess
**Impact**: Double maintenance burden
**Fix**: Extract shared package
**Effort**: 20 hours

---

### DEBT-004: No Error Boundary or Crash Reporting (P2)
**Location**: App-wide
**Impact**: Silent failures, no visibility
**Fix**: Add Sentry integration
**Effort**: 4 hours

---

### DEBT-005: Magic Numbers Throughout (P2)
**Location**: Various files
**Impact**: Hard to understand, maintain
**Fix**: Extract to constants
**Effort**: 4 hours

---

### DEBT-006: No Automated Tests (P2)
**Location**: Both apps
**Impact**: Regression risk, slow development
**Fix**: Add unit and widget tests
**Effort**: 40 hours

---

### DEBT-007: Flutter Version Outdated (P3)
**Location**: pubspec.yaml
**Impact**: Missing features, security patches
**Fix**: Upgrade to Flutter 3.24+
**Effort**: 8 hours

---

### DEBT-008: Dependencies Outdated (P3)
**Location**: pubspec.yaml
**Impact**: Security vulnerabilities, missing features
**Fix**: Update all dependencies
**Effort**: 4 hours

---

### DEBT-009: No CI/CD Pipeline (P3)
**Location**: Repository
**Impact**: Manual deployments, error-prone
**Fix**: Set up GitHub Actions
**Effort**: 8 hours

---

### DEBT-010: Git History Messy (P3)
**Location**: Repository
**Impact**: Hard to track changes
**Fix**: Enforce conventional commits
**Effort**: 2 hours

---

### DEBT-011: No Code Style Enforcement (P3)
**Location**: Repository
**Impact**: Inconsistent code style
**Fix**: Add linter rules, pre-commit hooks
**Effort**: 2 hours

---

### DEBT-012: Mixed Language Comments (P3)
**Location**: Various files
**Impact**: Confusing for English-speaking developers
**Fix**: Standardize on English comments
**Effort**: 4 hours

---

## Priority Matrix

### Must Fix Before Launch (P0)
| ID | Issue | Effort |
|----|-------|--------|
| VULN-001 | Hardcoded credentials | 2h |
| VULN-002 | Client-side QR validation | 8h |
| VULN-003 | No biometric on guard app | 6h |
| GAP-001 | No offline QR generation | 12h |
| GAP-002 | Entry limits not enforced | 4h |
| GAP-003 | Payment verification incomplete | 8h |
| **Total** | | **40h** |

### Should Fix Before Launch (P1)
| ID | Issue | Effort |
|----|-------|--------|
| VULN-004 | Receipt hash validation | 3h |
| VULN-005 | Secure password reset | 4h |
| VULN-006 | Encrypt Shelly credentials | 3h |
| VULN-007 | API rate limiting | 2h |
| GAP-004 | Entry notifications | 4h |
| GAP-006 | Visitor blacklist | 6h |
| GAP-007 | Entry log notes | 2h |
| PERF-001 | Pagination | 4h |
| PERF-002 | Receipt compression | 3h |
| DEBT-001 | State management | 40h |
| DEBT-002 | Internationalization | 16h |
| **Total** | | **87h** |

---

*Document maintained by Portun.app Engineering Team*
