# QR Access Control Specification

**Version**: 1.0
**Feature**: Core QR-based visitor access management
**Last Updated**: 2025-11-14

---

## Feature Overview

QR Access Control allows residents to create digital visitor invitations encoded as QR codes. Security guards scan these codes to validate and grant property access.

**Key Benefits**:
- Contactless visitor validation (2-second scan vs 2-minute phone call)
- Audit trail of all entries
- Entry limit enforcement prevents abuse
- Real-time notifications to residents
- Offline capability for guards

---

## User Roles

1. **Resident** (Host): Creates QR codes for expected visitors
2. **Visitor** (Guest): Presents QR code at gate
3. **Security Guard**: Scans and validates QR codes
4. **Property Admin**: Reviews entry logs and manages access

---

## QR Code Data Structure

### QR Code Payload

The QR code encodes a simple text string containing the unique visitor record UID:

```
VIS-67890-XYZ
```

**Format**: `VIS-{5-digit-random}-{3-letter-random}`

**Example**:
- `VIS-12345-ABC`
- `VIS-98765-XYZ`

### Why Simple UID?

- **Small QR code** (Level L error correction, 25x25 modules)
- **Easy to type manually** if QR scanner fails
- **Database lookup** provides all validation data server-side
- **Security** - QR code alone reveals nothing sensitive

---

## Visitor Record Schema

```typescript
interface VisitorRecord {
  id: string // UUID (database primary key)
  record_uid: string // "VIS-12345-ABC" (encoded in QR)
  host_uid: string // Resident who created invitation
  visitor_name: string
  visitor_type: 'Guest' | 'Delivery' | 'Service' | 'Family' | 'Party'
  qrcode_image_url: string // Pre-generated QR image
  validity_start: Date
  validity_end: Date
  property_id: string
  community_id: string
  entries_used: number
  entries_allowed: number
  document_num?: string // Visitor ID number
  notes?: string
  created_at: Date
  updated_at: Date
}
```

---

## User Flows

### Flow 1: Resident Creates QR Code

```
┌─────────────┐
│  Resident   │
│  Opens App  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Taps "Invite    │
│  Visitor"       │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ Fills Form:             │
│ • Visitor Name          │
│ • Type (Guest/Delivery) │
│ • Validity (Today/Week) │
│ • Entry Limit (1/∞)     │
│ • Notes (optional)      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────┐
│ Taps "Generate  │
│  QR Code"       │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ App Generates:          │
│ 1. Unique record_uid    │
│ 2. QR code image        │
│ 3. Saves to database    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────┐
│ QR Code Display │
│ with Share      │
│ Button          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Share via:      │
│ • WhatsApp      │
│ • SMS           │
│ • Email         │
└─────────────────┘
```

---

### Flow 2: Guard Scans and Validates QR

```
┌─────────────┐
│   Visitor   │
│ Arrives at  │
│    Gate     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Guard Opens     │
│ Scanner App     │
│ (Auto-launches) │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Camera Scans QR │
│ Reads: VIS-12345│
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ App Calls Edge Function │
│ /validate-qr            │
│ {record_uid, guard_id,  │
│  geolocation}           │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Server Validates:       │
│ ✓ Record exists?        │
│ ✓ Not expired?          │
│ ✓ Under entry limit?    │
│ ✓ Not blacklisted?      │
│ ✓ Guard in geofence?    │
└──────┬──────────────────┘
       │
       ├───── VALID ─────────┐
       │                     │
       ▼                     ▼
┌──────────────┐      ┌────────────┐
│ Show Visitor │      │   DENIED   │
│   Details    │      │  Show      │
│              │      │  Reason    │
│ [APPROVE]    │      └────────────┘
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ Guard Takes     │
│ Entry Photo     │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ Taps "Approve Entry"    │
│                         │
│ Calls /log-entry        │
│ • Increments counter    │
│ • Creates log entry     │
│ • Uploads photo         │
│ • Sends notification    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────┐
│ Optional: Open  │
│ Gate via Shelly │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Visitor Enters  │
└─────────────────┘
```

---

### Flow 3: Resident Receives Notification

```
┌─────────────────────┐
│ Guard Approves Entry│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Edge Function Calls │
│ OneSignal API       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Push Notification   │
│ Sent to Resident    │
│                     │
│ "Guest Arrived"     │
│ "John Doe checked   │
│  in at 3:30 PM"     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Resident Taps       │
│ Notification        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ App Opens to        │
│ Visitor Detail      │
│                     │
│ Shows:              │
│ • Entry photo       │
│ • Timestamp         │
│ • Guard name        │
│ • Remaining entries │
└─────────────────────┘
```

---

## Validation Rules

### Server-Side Validation (/validate-qr Edge Function)

```typescript
async function validateQR(record_uid: string, guard_id: string, geolocation?: {lat, lng}) {
  // 1. Fetch visitor record
  const visitor = await db.visitor_records_uid.findByRecordUid(record_uid)
  
  if (!visitor) {
    return {
      access_granted: false,
      reason: 'QR_NOT_FOUND',
      message: 'Visitor record not found'
    }
  }
  
  // 2. Check expiration
  if (visitor.validity_end < new Date()) {
    return {
      access_granted: false,
      reason: 'QR_EXPIRED',
      message: `QR code expired on ${visitor.validity_end}`
    }
  }
  
  // 3. Check entry limits
  if (visitor.entries_used >= visitor.entries_allowed) {
    return {
      access_granted: false,
      reason: 'LIMIT_REACHED',
      message: `Maximum ${visitor.entries_allowed} entries already used`
    }
  }
  
  // 4. Check blacklist
  const blacklisted = await db.blacklist.findByRecordUid(record_uid)
  if (blacklisted) {
    return {
      access_granted: false,
      reason: 'BLACKLISTED',
      message: 'This visitor has been blacklisted'
    }
  }
  
  // 5. Validate geolocation (warning only, don't block)
  if (geolocation && visitor.property_id) {
    const property = await db.property.findById(visitor.property_id)
    const distance = calculateDistance(
      geolocation.lat, geolocation.lng,
      property.geofence_lat, property.geofence_lng
    )
    
    if (distance > property.geofence_radius) {
      console.warn(`Guard ${guard_id} outside geofence: ${distance}m`)
      // Don't block - guard might be at secondary gate
    }
  }
  
  // 6. Success
  return {
    access_granted: true,
    visitor: {
      name: visitor.visitor_name,
      type: visitor.visitor_type,
      host_name: visitor.profile.display_name,
      entries_used: visitor.entries_used,
      entries_allowed: visitor.entries_allowed,
      notes: visitor.notes
    }
  }
}
```

---

## Entry Limit Enforcement

### Database-Level Atomic Counter

```sql
CREATE OR REPLACE FUNCTION increment_entry_count(p_record_id UUID)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
  v_current_used INT;
  v_allowed INT;
BEGIN
  -- Lock row for update (prevents race conditions)
  SELECT entries_used, entries_allowed
  INTO v_current_used, v_allowed
  FROM visitor_records_uid
  WHERE id = p_record_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Record not found'::TEXT;
    RETURN;
  END IF;

  -- Check limit BEFORE incrementing
  IF v_current_used >= v_allowed THEN
    RETURN QUERY SELECT FALSE,
      format('Maximum %s entries reached', v_allowed)::TEXT;
    RETURN;
  END IF;

  -- Atomic increment
  UPDATE visitor_records_uid
  SET entries_used = entries_used + 1, updated_at = NOW()
  WHERE id = p_record_id;

  RETURN QUERY SELECT TRUE, 'Entry logged successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;
```

**Why Database Function?**
- **Atomic**: Multiple guards can't exceed limit with simultaneous scans
- **Consistent**: Validation happens at database level, not client
- **Auditable**: All increments logged in database transaction log

---

## Offline Mode

### Guard App Offline Capability

**Cache Strategy**:
1. **On login**: Download last 100 active visitor records for assigned communities
2. **Storage**: Save to local Hive database (encrypted)
3. **Validation**: Check against local cache when offline
4. **Logging**: Queue entry logs locally
5. **Sync**: Upload queued logs when connection restored

**Cached Data Structure**:
```dart
class CachedVisitorRecord {
  String recordUid;
  String visitorName;
  DateTime validityEnd;
  int entriesAllowed;
  int entriesUsed;
  bool isBlacklisted;
  DateTime cachedAt;
  
  bool isValid() {
    return validityEnd.isAfter(DateTime.now()) &&
           entriesUsed < entriesAllowed &&
           !isBlacklisted;
  }
}
```

**Offline Validation**:
```dart
Future<bool> validateOffline(String recordUid) async {
  final cached = await hive.get(recordUid);
  
  if (cached == null) {
    // Not in cache - deny access (fail-safe)
    return false;
  }
  
  if (DateTime.now().difference(cached.cachedAt).inHours > 24) {
    // Cache too old - require online validation
    return false;
  }
  
  return cached.isValid();
}
```

**Sync Queue**:
```dart
class PendingEntryLog {
  String recordUid;
  DateTime timestamp;
  String photoLocalPath;
  String guardId;
  String? geolocation;
  bool synced = false;
}

// Background sync every 30 seconds when online
Timer.periodic(Duration(seconds: 30), (timer) async {
  if (await hasInternetConnection()) {
    await syncPendingLogs();
  }
});
```

---

## QR Code Generation

### Client-Side Generation

```dart
import 'package:barcode_widget/barcode_widget.dart';
import 'package:uuid/uuid.dart';

String generateRecordUid() {
  final random = Random();
  final digits = random.nextInt(99999).toString().padLeft(5, '0');
  final letters = String.fromCharCodes(
    List.generate(3, (_) => random.nextInt(26) + 65)
  );
  return 'VIS-$digits-$letters';
}

Widget buildQRCode(String recordUid) {
  return BarcodeWidget(
    data: recordUid,
    barcode: Barcode.qrCode(),
    width: 200,
    height: 200,
    errorBuilder: (context, error) => Text('QR Error: $error'),
    drawText: false,
  );
}

// Save QR image for sharing
Future<Uint8List> generateQRImage(String recordUid) async {
  final recorder = ui.PictureRecorder();
  final canvas = Canvas(recorder);
  
  // Generate QR code
  final qrCode = QrCode.fromData(
    data: recordUid,
    errorCorrectLevel: QrErrorCorrectLevel.L,
  );
  final qrImage = QrImage(qrCode);
  
  // Draw to canvas
  qrImage.draw(canvas, Size(400, 400));
  
  // Convert to PNG
  final picture = recorder.endRecording();
  final img = await picture.toImage(400, 400);
  final byteData = await img.toByteData(format: ui.ImageByteFormat.png);
  
  return byteData!.buffer.asUint8List();
}
```

---

## Error Handling

### User-Friendly Error Messages

```typescript
const ERROR_MESSAGES = {
  QR_NOT_FOUND: {
    en: "This QR code is invalid. Please ask the resident to create a new invitation.",
    es: "Este código QR no es válido. Solicite al residente que cree una nueva invitación."
  },
  QR_EXPIRED: {
    en: "This QR code has expired. Visitor must request a new code from the resident.",
    es: "Este código QR ha caducado. El visitante debe solicitar un nuevo código al residente."
  },
  LIMIT_REACHED: {
    en: "This visitor has used all allowed entries. Contact the resident to grant additional access.",
    es: "Este visitante ha utilizado todas las entradas permitidas. Contacte al residente para otorgar acceso adicional."
  },
  BLACKLISTED: {
    en: "This visitor is not permitted to enter. Contact property management.",
    es: "Este visitante no tiene permitido ingresar. Contacte a la administración de la propiedad."
  },
  OFFLINE_NO_CACHE: {
    en: "Cannot validate QR code offline. Visitor not in cache. Please try again when online.",
    es: "No se puede validar el código QR sin conexión. Visitante no está en caché. Inténtelo de nuevo cuando esté en línea."
  }
}
```

---

## Analytics & Reporting

### Key Metrics

1. **Entry Volume**: Total entries per day/week/month
2. **Peak Hours**: Busiest entry times (heatmap)
3. **Visitor Types**: Distribution of Guest/Delivery/Service
4. **Average Entry Time**: Scan to approval duration
5. **Rejection Rate**: % of denied QR scans and reasons
6. **Guard Performance**: Entries processed per guard
7. **Resident Adoption**: % of residents who created QR codes

### Admin Dashboard Queries

```sql
-- Total entries this week
SELECT COUNT(*) FROM visitor_record_logs
WHERE in_time > NOW() - INTERVAL '7 days';

-- Busiest hours (heatmap data)
SELECT
  EXTRACT(HOUR FROM in_time) AS hour,
  COUNT(*) AS entries
FROM visitor_record_logs
WHERE in_time > NOW() - INTERVAL '30 days'
GROUP BY hour
ORDER BY hour;

-- Visitor type distribution
SELECT
  vr.visitor_type,
  COUNT(vrl.id) AS entries
FROM visitor_records_uid vr
JOIN visitor_record_logs vrl ON vr.record_uid = vrl.record_uid
WHERE vrl.in_time > NOW() - INTERVAL '30 days'
GROUP BY vr.visitor_type;

-- Guard performance
SELECT
  p.display_name,
  COUNT(vrl.id) AS entries_processed,
  AVG(EXTRACT(EPOCH FROM (vrl.created_at - vrl.in_time))) AS avg_processing_seconds
FROM visitor_record_logs vrl
JOIN profile p ON vrl.guard_id = p.id
WHERE vrl.in_time > NOW() - INTERVAL '30 days'
GROUP BY p.display_name
ORDER BY entries_processed DESC;
```

---

## Testing Scenarios

### Functional Testing

- [ ] Create QR code for "Today Only" visitor
- [ ] Create QR code for "This Week" visitor
- [ ] Create QR code with single entry limit
- [ ] Create QR code with unlimited entries
- [ ] Share QR via WhatsApp, SMS, Email
- [ ] Scan valid QR code (should approve)
- [ ] Scan expired QR code (should deny with reason)
- [ ] Scan QR code at entry limit (should deny)
- [ ] Scan same QR twice simultaneously (race condition - one should fail)
- [ ] Scan QR code offline with cached data (should approve)
- [ ] Scan QR code offline without cached data (should deny)
- [ ] Receive push notification on entry
- [ ] View entry history in resident app
- [ ] Admin reviews entry logs with filters

---

## Performance Targets

- **QR Scan to Validation**: < 2 seconds (online)
- **QR Scan to Validation**: < 500ms (offline cached)
- **QR Generation**: < 1 second
- **Photo Upload**: < 5 seconds (< 2MB image)
- **Push Notification Delivery**: < 3 seconds
- **Entry Log Query**: < 100ms (with pagination)

---

## Security Considerations

1. **QR Code Simplicity**: Contains only record_uid, no sensitive data
2. **Server-Side Validation**: All logic happens server-side
3. **Entry Limit Enforcement**: Database constraint + function prevents bypass
4. **Photo Evidence**: Every entry photographed for audit trail
5. **Geolocation Tracking**: Guard location logged (warning if outside geofence)
6. **Offline Fail-Safe**: Deny access if visitor not in cache (prevent spoofing)

---

**Feature Status**: Core MVP Complete
**Next Phase**: AI visitor pattern recognition, pre-approved frequent visitors
