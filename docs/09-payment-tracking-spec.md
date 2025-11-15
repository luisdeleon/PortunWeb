# Payment Tracking Specification (MVP)

**Version**: 1.0
**Feature**: Manual payment receipt upload and verification
**Phase**: MVP (Phase 2A will add automated processing)
**Last Updated**: 2025-11-14

---

## Feature Overview

Payment Tracking MVP allows residents to upload proof of HOA fee payments (photos of receipts, checks, or bank transfers). Property managers review and verify uploaded receipts through the admin portal.

**MVP Scope** (Manual):
- Residents upload receipt photos
- Admins verify/reject receipts
- Payment history tracked
- Push notifications on verification

**Future Phase 2A** (Automated):
- Stripe/ACH integration
- Automated recurring billing
- Late fee calculation
- Payment reminders

---

## User Roles

1. **Resident**: Uploads payment receipts
2. **Property Manager/Admin**: Verifies receipts and manages payments
3. **Board Member**: Views financial reports (read-only)

---

## Payment Receipt Schema

```typescript
interface PaymentReceipt {
  id: string // UUID
  profile_id: string // Resident who uploaded
  property_id: string
  community_id: string
  amount: number // Decimal(10,2)
  payment_date: Date
  reference_number?: string // Check #, transaction ID, etc.
  receipt_image_url: string // Supabase Storage URL
  receipt_hash: string // SHA-256 hash for integrity
  status: 'pending' | 'verified' | 'rejected'
  verified_by?: string // Admin profile_id
  verified_at?: Date
  rejection_reason?: string
  notes?: string
  created_at: Date
  updated_at: Date
}
```

---

## User Flows

### Flow 1: Resident Uploads Receipt

```
┌─────────────┐
│  Resident   │
│ Pays HOA Fee│
│ via Bank    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Opens Portun App│
│ → Payments Tab  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Taps "Upload    │
│  Receipt"       │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ Choose Photo Source:    │
│ • Take Photo (Camera)   │
│ • Choose from Gallery   │
│ • Select PDF (future)   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────┐
│ Crop/Rotate     │
│ Image           │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ Enter Payment Details:  │
│ • Amount ($250.00)      │
│ • Date (auto: today)    │
│ • Reference (CHK-1234)  │
│ • Notes (optional)      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Taps "Submit"           │
│                         │
│ App:                    │
│ 1. Compresses image     │
│ 2. Calculates SHA-256   │
│ 3. Uploads to Storage   │
│ 4. Saves to DB          │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────┐
│ Success Message │
│ "Receipt        │
│  submitted for  │
│  verification"  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Receipt appears │
│ in History with │
│ "Pending" badge │
└─────────────────┘
```

---

### Flow 2: Admin Verifies Receipt

```
┌─────────────────┐
│ Admin Receives  │
│ Notification:   │
│ "3 new receipts"│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Opens Admin     │
│ Portal →        │
│ Payments Page   │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ Sees Pending Queue:     │
│ ┌─────────────────────┐ │
│ │ Jane Doe - $250.00  │ │
│ │ Oct 15, 2025        │ │
│ │ Unit 101            │ │
│ │ [View Receipt]      │ │
│ └─────────────────────┘ │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────┐
│ Clicks Receipt  │
│ to Enlarge      │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ Reviews Receipt:        │
│ • Amount matches? ✓     │
│ • Date valid? ✓         │
│ • Clear image? ✓        │
│                         │
│ [Verify] [Reject]       │
└──────┬──────────────────┘
       │
       ├───VERIFY───┐
       │            │
       ▼            ▼
┌──────────────┐  ┌────────────┐
│ Clicks       │  │ Clicks     │
│ "Verify"     │  │ "Reject"   │
└──────┬───────┘  └─────┬──────┘
       │                │
       ▼                ▼
┌──────────────┐  ┌────────────────┐
│ Confirmation │  │ Enter Reason:  │
│ Dialog       │  │ "Image blurry, │
│              │  │  please resend"│
│ [Yes] [No]   │  │                │
└──────┬───────┘  │ [Submit]       │
       │          └─────┬──────────┘
       ▼                │
┌──────────────────┐    │
│ Status updated:  │◄───┘
│ verified/rejected│
│                  │
│ DB fields set:   │
│ • verified_by    │
│ • verified_at    │
│ • status         │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────┐
│ Push Notification Sent  │
│ to Resident:            │
│                         │
│ "Payment Verified" or   │
│ "Payment Rejected"      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────┐
│ Next Receipt    │
│ Auto-loads      │
└─────────────────┘
```

---

## Resident App Screens

### Payments Tab (Home)

```
┌────────────────────────────────┐
│ Payments                    ≡  │
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐  │
│  │  [+] Upload Receipt      │  │
│  └──────────────────────────┘  │
│                                │
│  Payment History              │
│  ────────────────             │
│                                │
│  ┌──────────────────────────┐  │
│  │ 📄 $250.00               │  │
│  │    Nov 14, 2025          │  │
│  │    CHK-1234              │  │
│  │    ✓ Verified            │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ 📄 $250.00               │  │
│  │    Oct 15, 2025          │  │
│  │    Wire Transfer         │  │
│  │    ⏳ Pending            │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ 📄 $250.00               │  │
│  │    Sep 12, 2025          │  │
│  │    ❌ Rejected            │  │
│  │    Reason: Blurry image  │  │
│  └──────────────────────────┘  │
│                                │
│  [Load More]                   │
│                                │
└────────────────────────────────┘
```

---

### Upload Receipt Form

```
┌────────────────────────────────┐
│ ← Upload Receipt               │
├────────────────────────────────┤
│                                │
│  Receipt Image                 │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │   [Camera Icon]          │  │
│  │                          │  │
│  │   Tap to add photo       │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  Amount *                      │
│  ┌──────────────────────────┐  │
│  │ $ 250.00                 │  │
│  └──────────────────────────┘  │
│                                │
│  Payment Date *                │
│  ┌──────────────────────────┐  │
│  │ 📅 Nov 14, 2025          │  │
│  └──────────────────────────┘  │
│                                │
│  Reference Number (Optional)   │
│  ┌──────────────────────────┐  │
│  │ CHK-1234                 │  │
│  └──────────────────────────┘  │
│                                │
│  Notes (Optional)              │
│  ┌──────────────────────────┐  │
│  │ Monthly HOA fee          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │      Submit Receipt      │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

---

## Admin Portal Screens

### Payments Dashboard

```
┌──────────────────────────────────────────────────────┐
│ Portun Admin  │  Payments                         ≡  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Pending  │ │ Verified │ │ Rejected │            │
│  │    12    │ │    45    │ │     3    │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                      │
│  Pending Verification (12)        [Export CSV]      │
│  ─────────────────────────────────────────────      │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📄 Jane Doe • Unit 101 • $250.00              │ │
│  │    Submitted: Nov 14, 2025 3:30 PM           │ │
│  │    Reference: CHK-1234                        │ │
│  │    [View Receipt] [Verify] [Reject]           │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📄 John Smith • Unit 202 • $300.00            │ │
│  │    Submitted: Nov 14, 2025 2:15 PM           │ │
│  │    Reference: Wire Transfer                   │ │
│  │    [View Receipt] [Verify] [Reject]           │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Filters: [All Communities ▼] [Last 30 Days ▼]     │
│                                                      │
│  Pagination: ← 1 2 3 ... 5 →                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### Receipt Review Modal

```
┌──────────────────────────────────────────┐
│ Verify Payment Receipt              ✕    │
├──────────────────────────────────────────┤
│                                          │
│  Resident: Jane Doe                      │
│  Property: Building A, Unit 101          │
│  Amount: $250.00                         │
│  Date: Nov 14, 2025                      │
│  Reference: CHK-1234                     │
│  Notes: Monthly HOA fee                  │
│                                          │
│  Receipt Image:                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │   [Receipt Photo]                 │  │
│  │                                    │  │
│  │   Bank Statement                   │  │
│  │   Amount: $250.00                  │  │
│  │   Date: 11/14/2025                 │  │
│  │   Check #: 1234                    │  │
│  │                                    │  │
│  │   [Zoom In] [Download]             │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Internal Notes:                         │
│  ┌────────────────────────────────────┐  │
│  │ Receipt matches amount             │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌──────────────┐  ┌──────────────────┐  │
│  │   Verify ✓   │  │   Reject ✕       │  │
│  └──────────────┘  └──────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

---

## Technical Implementation

### Image Upload & Compression

```dart
// Client-side compression before upload
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:crypto/crypto.dart';

Future<Map<String, dynamic>> uploadReceipt(File imageFile) async {
  // 1. Compress image
  final compressedBytes = await FlutterImageCompress.compressWithFile(
    imageFile.absolute.path,
    minWidth: 1920,
    minHeight: 1080,
    quality: 80,
    format: CompressFormat.jpeg,
  );

  if (compressedBytes == null || compressedBytes.length > 2 * 1024 * 1024) {
    throw Exception('Image too large after compression');
  }

  // 2. Calculate SHA-256 hash
  final hash = sha256.convert(compressedBytes).toString();

  // 3. Upload to Supabase Storage
  final fileName = 'receipt_${DateTime.now().millisecondsSinceEpoch}.jpg';
  final response = await supabase.storage
      .from('receipts')
      .uploadBinary('$userId/$fileName', compressedBytes);

  if (response.error != null) {
    throw Exception('Upload failed: ${response.error!.message}');
  }

  // 4. Get public URL
  final url = supabase.storage.from('receipts').getPublicUrl('$userId/$fileName');

  return {
    'receipt_image_url': url,
    'receipt_hash': hash,
  };
}
```

---

### Hash Verification (Admin Portal)

```typescript
// Server-side hash validation
async function verifyReceiptHash(receiptId: string): Promise<boolean> {
  const receipt = await db.payment_receipts.findById(receiptId)
  
  // Download image from storage
  const response = await fetch(receipt.receipt_image_url)
  const imageBuffer = await response.arrayBuffer()
  
  // Calculate hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', imageBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  // Compare with stored hash
  if (hashHex !== receipt.receipt_hash) {
    // Image has been tampered with!
    await db.audit_log.insert({
      action: 'RECEIPT_TAMPER_DETECTED',
      resource_id: receiptId,
      metadata: { stored_hash: receipt.receipt_hash, calculated_hash: hashHex }
    })
    return false
  }
  
  return true
}
```

---

### Push Notification on Verification

```typescript
// Edge Function triggered on payment_receipts UPDATE
async function notifyPaymentStatus(payment: PaymentReceipt) {
  const profile = await db.profile.findById(payment.profile_id)
  const notificationUser = await db.notification_users.findByProfileId(payment.profile_id)
  
  if (!notificationUser || !notificationUser.notifications_enabled) {
    return
  }
  
  const message = payment.status === 'verified'
    ? {
        en: `Payment of $${payment.amount} verified!`,
        es: `Pago de $${payment.amount} verificado!`
      }
    : {
        en: `Payment of $${payment.amount} rejected. Reason: ${payment.rejection_reason}`,
        es: `Pago de $${payment.amount} rechazado. Motivo: ${payment.rejection_reason}`
      }
  
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      include_external_user_ids: [payment.profile_id],
      headings: {
        en: payment.status === 'verified' ? 'Payment Verified' : 'Payment Rejected',
        es: payment.status === 'verified' ? 'Pago Verificado' : 'Pago Rechazado'
      },
      contents: message,
      data: {
        type: 'payment_status',
        payment_id: payment.id,
        status: payment.status
      }
    })
  })
}
```

---

## Validation Rules

### Client-Side Validation

```dart
class PaymentReceiptValidator {
  static String? validateAmount(String? value) {
    if (value == null || value.isEmpty) {
      return 'Amount is required';
    }
    
    final amount = double.tryParse(value.replaceAll('\$', '').replaceAll(',', ''));
    if (amount == null || amount <= 0) {
      return 'Amount must be greater than $0';
    }
    
    if (amount > 999999.99) {
      return 'Amount too large';
    }
    
    return null;
  }
  
  static String? validateDate(DateTime? date) {
    if (date == null) {
      return 'Payment date is required';
    }
    
    if (date.isAfter(DateTime.now())) {
      return 'Payment date cannot be in the future';
    }
    
    if (date.isBefore(DateTime.now().subtract(Duration(days: 365)))) {
      return 'Payment date cannot be more than 1 year ago';
    }
    
    return null;
  }
  
  static String? validateImage(File? file) {
    if (file == null) {
      return 'Receipt image is required';
    }
    
    final fileSizeBytes = file.lengthSync();
    if (fileSizeBytes > 10 * 1024 * 1024) {
      return 'Image must be less than 10MB';
    }
    
    final extension = file.path.split('.').last.toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'pdf'].contains(extension)) {
      return 'Only JPG, PNG, or PDF files allowed';
    }
    
    return null;
  }
}
```

---

### Database Constraints

```sql
ALTER TABLE payment_receipts
  ADD CONSTRAINT check_amount_positive CHECK (amount > 0),
  ADD CONSTRAINT check_payment_date_valid CHECK (
    payment_date <= CURRENT_DATE AND
    payment_date >= CURRENT_DATE - INTERVAL '1 year'
  ),
  ADD CONSTRAINT check_verified_fields CHECK (
    (status = 'verified' AND verified_by IS NOT NULL AND verified_at IS NOT NULL) OR
    (status = 'rejected' AND rejection_reason IS NOT NULL) OR
    (status = 'pending')
  );
```

---

## Reporting & Analytics

### Payment Summary Report

```sql
-- Monthly payment summary for community
SELECT
  TO_CHAR(payment_date, 'YYYY-MM') AS month,
  COUNT(*) AS total_receipts,
  SUM(amount) FILTER (WHERE status = 'verified') AS verified_amount,
  SUM(amount) FILTER (WHERE status = 'pending') AS pending_amount,
  SUM(amount) FILTER (WHERE status = 'rejected') AS rejected_amount
FROM payment_receipts
WHERE community_id = $1
  AND payment_date >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY month
ORDER BY month DESC;
```

---

### Delinquency Report

```sql
-- Properties with no verified payments in last 30 days
SELECT
  p.name AS property_name,
  prof.display_name AS resident_name,
  prof.email,
  COALESCE(MAX(pr.payment_date), 'Never') AS last_payment
FROM property p
JOIN profile prof ON p.id = prof.def_property_id
LEFT JOIN payment_receipts pr ON pr.profile_id = prof.id
  AND pr.status = 'verified'
WHERE p.community_id = $1
GROUP BY p.name, prof.display_name, prof.email
HAVING MAX(pr.payment_date) IS NULL
  OR MAX(pr.payment_date) < CURRENT_DATE - INTERVAL '30 days'
ORDER BY last_payment DESC;
```

---

## Export Functionality

### CSV Export (Admin Portal)

```typescript
function exportPaymentsToCSV(payments: PaymentReceipt[]): string {
  const headers = [
    'Date',
    'Resident',
    'Property',
    'Amount',
    'Reference',
    'Status',
    'Verified By',
    'Verified Date',
    'Notes'
  ]
  
  const rows = payments.map(p => [
    p.payment_date.toISOString().split('T')[0],
    p.profile.display_name,
    `${p.property.name} ${p.property.unit_number}`,
    `$${p.amount.toFixed(2)}`,
    p.reference_number || '',
    p.status,
    p.verified_by?.display_name || '',
    p.verified_at?.toISOString().split('T')[0] || '',
    p.notes || ''
  ])
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
}
```

---

## Future Enhancements (Phase 2A)

1. **Automated Payment Processing**:
   - Stripe integration for credit/debit cards
   - ACH bank transfers
   - Recurring billing setup

2. **Smart Features**:
   - OCR to extract amount and date from receipt
   - Auto-match to expected monthly fee
   - Payment reminders (email/SMS)

3. **Late Fee Calculation**:
   - Configurable grace period
   - Automatic late fee assessment
   - Escalating reminder system

4. **Payment Plans**:
   - Multi-month installments
   - Catch-up plans for delinquent accounts

---

**MVP Status**: Core manual workflow complete
**Timeline**: 2 weeks implementation + 1 week testing
**Effort**: ~40 hours
