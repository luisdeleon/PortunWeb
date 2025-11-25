# Payment Tracking Specification - Portun.app

**Date**: 2025-11-14
**Version**: 1.0

---

## Overview

### Phase 1 (MVP): Manual Receipt Upload
- Resident uploads photo of payment receipt
- Admin verifies/rejects receipt manually
- No automated payment processing

### Phase 2 (Future): Automated Payments
- Stripe/ACH integration for online payments
- Still support manual receipts for cash/check
- Recurring billing and auto-reconciliation

---

## Resident Flow: Upload Receipt

### Step 1: Navigate to Payments
```
Home > Payments Tab

┌─────────────────────────────┐
│ January 2025                │
│ Status: ⏳ Pending          │
│                             │
│ [Upload Receipt]            │
├─────────────────────────────┤
│ Payment History             │
│ ─────────────────────────── │
│ Dec 2024  ✅ Verified       │
│ Nov 2024  ✅ Verified       │
│ Oct 2024  ✅ Verified       │
└─────────────────────────────┘
```

### Step 2: Upload Modal
```
┌─────────────────────────────┐
│ Upload Payment Receipt      │
│                             │
│ Month: [January 2025 ▼]     │
│                             │
│ Amount: [$________]         │
│ (optional)                  │
│                             │
│ ┌─────────────────────┐     │
│ │                     │     │
│ │   [📷 Take Photo]   │     │
│ │        or           │     │
│ │   [📁 Choose File]  │     │
│ │                     │     │
│ └─────────────────────┘     │
│                             │
│ Notes: [________________]   │
│ (optional)                  │
│                             │
│ [Cancel]      [Submit]      │
└─────────────────────────────┘
```

### Step 3: Image Handling
```typescript
import imageCompression from 'browser-image-compression';

async function processReceipt(file: File) {
  // Compress image
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  });

  // Generate hash for integrity
  const arrayBuffer = await compressed.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Upload to storage
  const fileName = `${userId}/${month}_${Date.now()}.jpg`;
  const { data, error } = await supabase.storage
    .from('payment-receipts')
    .upload(fileName, compressed);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('payment-receipts')
    .getPublicUrl(fileName);

  return { url: publicUrl, hash: `sha256:${hash}` };
}
```

### Step 4: Submit Receipt
```typescript
await supabase.from('payment_receipts').insert({
  resident_uid: currentUser.id,
  community_id: currentUser.communityId,
  month: '2025-01',
  amount: 250.00,
  receipt_url: uploadedUrl,
  receipt_hash: hash,
  status: 'pending',
});
```

### Step 5: Confirmation
```
┌─────────────────────────────┐
│ ✅ Receipt Uploaded         │
│                             │
│ Your payment receipt for    │
│ January 2025 has been       │
│ submitted.                  │
│                             │
│ An admin will verify it     │
│ within 24 hours.            │
│                             │
│ [View Payment History]      │
└─────────────────────────────┘
```

---

## Admin Flow: Verify Receipts

### Step 1: Pending Queue
```
Payment Verification

┌─────────────────────────────────────────────┐
│ 🔔 15 pending receipts                      │
│                                             │
│ Filter: [All Communities ▼] [January ▼]    │
├─────────────────────────────────────────────┤
│ Unit 101 - Maria Rodriguez                  │
│ Jan 2025 | Submitted 2 hours ago            │
│ Amount: $250.00                             │
│ [View Receipt]                              │
├─────────────────────────────────────────────┤
│ Unit 205 - Carlos Mendez                    │
│ Jan 2025 | Submitted 5 hours ago            │
│ Amount: $250.00                             │
│ [View Receipt]                              │
└─────────────────────────────────────────────┘
```

### Step 2: Receipt Review Modal
```
┌─────────────────────────────────────────────┐
│ Payment Receipt                             │
│                                             │
│ ┌─────────────────────────────────────┐     │
│ │                                     │     │
│ │     [Receipt Image - Zoomable]      │     │
│ │                                     │     │
│ └─────────────────────────────────────┘     │
│                                             │
│ Resident: Maria Rodriguez                   │
│ Unit: 101                                   │
│ Month: January 2025                         │
│ Amount: $250.00                             │
│ Expected: $250.00 ✓                         │
│ Submitted: Jan 15, 2025 10:30 AM           │
│                                             │
│ Resident Note: "Bank transfer receipt"      │
│                                             │
│ [✅ Verify]           [❌ Reject]           │
└─────────────────────────────────────────────┘
```

### Step 3a: Verify Receipt
```typescript
await supabase
  .from('payment_receipts')
  .update({
    status: 'verified',
    verified_by: currentAdmin.id,
    verified_at: new Date().toISOString(),
  })
  .eq('id', receiptId);

// Trigger notification
await supabase.functions.invoke('payment-notification', {
  body: {
    receipt_id: receiptId,
    status: 'verified',
    resident_uid: receipt.resident_uid,
  },
});
```

### Step 3b: Reject Receipt
```
┌─────────────────────────────────────────────┐
│ Reject Receipt                              │
│                                             │
│ Reason (required):                          │
│ ┌─────────────────────────────────────┐     │
│ │ Amount unclear - please reupload    │     │
│ │ with full receipt visible           │     │
│ └─────────────────────────────────────┘     │
│                                             │
│ [Cancel]              [Confirm Rejection]   │
└─────────────────────────────────────────────┘
```

```typescript
await supabase
  .from('payment_receipts')
  .update({
    status: 'rejected',
    verified_by: currentAdmin.id,
    verified_at: new Date().toISOString(),
    rejection_reason: reason,
  })
  .eq('id', receiptId);
```

---

## Payment Reports

### Export to CSV
```typescript
async function exportPaymentReport(communityId: string, month: string) {
  const { data: receipts } = await supabase
    .from('payment_receipts')
    .select(`
      *,
      profile!resident_uid (name, unit_number, email)
    `)
    .eq('community_id', communityId)
    .eq('month', month)
    .order('created_at');

  const csv = [
    ['Unit', 'Resident', 'Amount', 'Status', 'Submitted', 'Verified'].join(','),
    ...receipts.map(r => [
      r.profile.unit_number,
      r.profile.name,
      r.amount || 'N/A',
      r.status,
      new Date(r.created_at).toLocaleDateString(),
      r.verified_at ? new Date(r.verified_at).toLocaleDateString() : 'N/A',
    ].join(','))
  ].join('\n');

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payments_${month}.csv`;
  a.click();
}
```

### Dashboard Metrics
```
Payment Summary - January 2025

┌────────────┬────────────┬────────────┐
│ Collected  │ Pending    │ Missing    │
│ $12,500    │ $1,500     │ $2,000     │
│ 50 units   │ 6 units    │ 8 units    │
└────────────┴────────────┴────────────┘

Collection Rate: 78%
```

---

## Status Definitions

| Status | Description | Badge Color |
|--------|-------------|-------------|
| `pending` | Receipt uploaded, awaiting admin review | Yellow |
| `verified` | Admin confirmed payment received | Green |
| `rejected` | Admin rejected receipt (with reason) | Red |
| `missing` | No receipt uploaded for current period | Gray |

---

## Notifications

### Receipt Uploaded
**To**: Community admins
```
New Payment Receipt
Maria Rodriguez (Unit 101) uploaded a receipt for January 2025.
[Review Now]
```

### Receipt Verified
**To**: Resident
```
✅ Payment Verified
Your January 2025 payment has been verified by Admin.
```

### Receipt Rejected
**To**: Resident
```
❌ Payment Rejected
Your January 2025 receipt was rejected.
Reason: Amount unclear - please reupload with full receipt visible.
[Upload New Receipt]
```

---

## Storage Configuration

### Bucket: payment-receipts
```sql
-- Private bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', false);

-- File size limit: 5MB
-- Allowed types: image/jpeg, image/png, application/pdf
```

### RLS Policies
```sql
-- Residents upload to own folder
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

-- Admins view community receipts
CREATE POLICY "Admins view community receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-receipts'
  AND EXISTS (
    SELECT 1 FROM profile p
    WHERE p.id = auth.uid()
    AND p.role IN ('admin', 'owner')
  )
);
```

---

## Future Enhancements (Phase 2)

### Stripe Integration
- Resident enters payment method once
- Auto-charge monthly on due date
- Instant verification (no admin needed)
- Fallback to manual if card fails

### OCR Receipt Parsing
- Auto-extract amount from receipt photo
- Validate against expected amount
- Reduce admin verification time

### Late Fee Automation
- Auto-calculate late fees after grace period
- Send reminders before due date
- Optional: Lock QR creation if payment overdue

### Recurring Payments
- Set up auto-pay for monthly HOA
- Email/SMS reminders before charge
- Support for variable amounts

---

*Document maintained by Portun.app Engineering Team*
