# QR Access Control Specification - Portun.app

**Date**: 2025-11-14
**Version**: 1.0

---

## QR Code Format

### Simple Text UID
```
VIS-12345-ABC
```

**Format Breakdown**:
- `VIS-` - Prefix (identifies as visitor QR)
- `12345` - Timestamp or random ID
- `-ABC` - Checksum (3 chars)

**Why Simple Text?**
- Works with all QR scanners
- Faster to scan (less data)
- Database lookup is cheap (indexed)
- No client-side decryption needed

---

## QR Generation Flow (Resident App)

### Step 1: Form Input
```
Visitor name: [required]
Phone number: [optional]
Vehicle info: [optional, e.g., "Toyota Camry ABC-123"]
Valid until:  [required, default: today 11:59 PM]
Entry limit:  [default: unlimited (9999)]
```

### Step 2: Validation
- Name not empty
- Valid until is future date
- Entry limit > 0

### Step 3: Generate UID
```dart
String generateUID() {
  final timestamp = DateTime.now().millisecondsSinceEpoch;
  final random = _randomString(3); // A-Z, 0-9
  return 'VIS-$timestamp-$random';
}
// Output: VIS-1736961234567-X7K
```

### Step 4: Database Insert
```dart
await supabase.from('visitor_records_uid').insert({
  'host_uid': currentUser.id,
  'record_uid': uid,
  'visitor_name': name,
  'visitor_phone': phone,
  'vehicle_info': vehicle,
  'validity_end': validUntil.toIso8601String(),
  'entries_allowed': entryLimit,
  'entries_used': 0,
});
```

### Step 5: Generate QR Image
```dart
import 'package:qr_flutter/qr_flutter.dart';

QrImageView(
  data: uid,
  version: QrVersions.auto,
  size: 300,
  backgroundColor: Colors.white,
  eyeStyle: QrEyeStyle(
    eyeShape: QrEyeShape.square,
    color: Color(0xFF2563EB), // Portun Blue
  ),
)
```

### Step 6: Display & Share
- Show QR code on screen
- "Share via WhatsApp" button
- "Share via SMS" button
- "Save Image" button
- Display visitor details + expiry time

---

## QR Validation Flow (Guard App)

### Step 1: Open Camera
Camera opens immediately (< 500ms) when guard taps "Scan QR Code"

### Step 2: Scan QR
```dart
import 'package:mobile_scanner/mobile_scanner.dart';

MobileScanner(
  onDetect: (capture) {
    final barcode = capture.barcodes.first;
    if (barcode.rawValue?.startsWith('VIS-') ?? false) {
      _validateQR(barcode.rawValue!);
    }
  },
)
```

### Step 3: Server Validation
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

### Step 4: Display Result

**Valid (Green Screen)**:
```
✅ Access Granted

Visitor: John Doe
Host: Maria Rodriguez
Vehicle: Toyota Camry ABC-123
Expires: Today 11:59 PM
Entries: 0/1

[Take Photo]  [Log Entry]
```

**Invalid (Red Screen)**:
```
❌ Access Denied

Reason: QR code expired

[Contact Host]  [Override (Admin)]
```

### Step 5: Optional Photo
- Visitor photo (front camera)
- Vehicle photo (back camera)
- Stored temporarily until entry logged

### Step 6: Log Entry
```dart
await supabase.functions.invoke('log-entry', body: {
  'visitor_uid': visitor.id,
  'guard_uid': currentUser.id,
  'photo_url': uploadedPhotoUrl,
  'vehicle_photo_url': uploadedVehiclePhotoUrl,
  'notes': notesController.text,
});
```

### Step 7: Confirmation
```
✅ Entry Logged

Notification sent to Maria Rodriguez

[Done]
```

---

## Offline Mode

### Problem
Guard app must work when internet is down.

### Solution: Local QR Cache

```dart
import 'package:hive_flutter/hive_flutter.dart';

class QRCache {
  static const String BOX_NAME = 'active_qr_codes';

  /// Sync active QR codes when online
  static Future<void> syncActiveQRs(String communityId) async {
    final activeQRs = await supabase
        .from('visitor_records_uid')
        .select('*, profile!host_uid(*)')
        .gte('validity_end', DateTime.now().toIso8601String())
        .lte('validity_end', DateTime.now()
            .add(Duration(days: 7)).toIso8601String());

    final box = await Hive.openBox(BOX_NAME);
    for (var qr in activeQRs) {
      await box.put(qr['record_uid'], {
        'visitor_name': qr['visitor_name'],
        'host_name': qr['profile']['name'],
        'vehicle_info': qr['vehicle_info'],
        'validity_end': qr['validity_end'],
        'entries_used': qr['entries_used'],
        'entries_allowed': qr['entries_allowed'],
        'cached_at': DateTime.now().toIso8601String(),
      });
    }
  }

  /// Validate QR offline
  static Future<Map<String, dynamic>> validateOffline(String recordUid) async {
    final box = await Hive.openBox(BOX_NAME);
    final cached = box.get(recordUid);

    if (cached == null) {
      return {
        'valid': false,
        'reason': 'QR not in offline cache',
        'offline': true,
      };
    }

    if (DateTime.parse(cached['validity_end']).isBefore(DateTime.now())) {
      return {
        'valid': false,
        'reason': 'QR code expired',
        'offline': true,
      };
    }

    return {
      'valid': true,
      'visitor': cached,
      'offline': true,
      'warning': 'Validated offline - entry limit may not be accurate',
    };
  }

  /// Queue entry for sync when online
  static Future<void> queueOfflineEntry(Map<String, dynamic> entry) async {
    final box = await Hive.openBox('pending_entries');
    await box.add({
      ...entry,
      'queued_at': DateTime.now().toIso8601String(),
    });
  }

  /// Sync pending entries when back online
  static Future<void> syncPendingEntries() async {
    final box = await Hive.openBox('pending_entries');
    for (var key in box.keys) {
      try {
        await supabase.functions.invoke('log-entry', body: box.get(key));
        await box.delete(key);
      } catch (e) {
        // Will retry on next sync
      }
    }
  }
}
```

### Sync Schedule
- Sync active QRs every 5 minutes when online
- Sync pending entries immediately when connection restored
- Cache up to 7 days of upcoming visitors

---

## WhatsApp Sharing

### Share QR Code
```dart
import 'package:share_plus/share_plus.dart';

Future<void> shareViaWhatsApp(String qrImagePath, Visitor visitor) async {
  final message = '''
🎫 *QR de Acceso - ${visitor.name}*

Comunidad: ${visitor.communityName}
Válido hasta: ${formatDate(visitor.validityEnd)}
Entradas: ${visitor.entriesAllowed == 9999 ? 'Ilimitadas' : visitor.entriesAllowed}

Muestra este QR en la entrada.
''';

  await Share.shareXFiles(
    [XFile(qrImagePath)],
    text: message,
  );
}
```

---

## Security Considerations

### 1. QR Code Not Encrypted (By Design)
- **Pro**: Works with any QR scanner
- **Pro**: Faster scanning
- **Con**: UID visible if intercepted
- **Mitigation**: Server-side validation required, UID alone is useless

### 2. Entry Limit Enforcement
- MUST be enforced at database level
- Database function with row locking prevents race conditions
- Offline entries reconciled when back online (may exceed limit temporarily)

### 3. Expiry Validation
- Client shows warning 1 hour before expiry
- Server-side validation uses server timestamp
- All times in UTC

### 4. QR Revocation
- Host can delete visitor record to invalidate QR
- Deleted QRs return "not found" on validation
- Future: Add explicit revocation table for audit trail

---

## Performance Targets

| Metric | Target |
|--------|--------|
| QR generation time | < 10 seconds |
| Camera open time | < 500ms |
| QR decode time | < 100ms |
| Server validation | < 2 seconds |
| Entry logging | < 1 second |
| Push notification | < 5 seconds |

---

*Document maintained by Portun.app Engineering Team*
