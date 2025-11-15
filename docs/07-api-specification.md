# API Specification

**Version**: 1.0
**Base URL**: https://data.portun.app
**Last Updated**: 2025-11-14

---

## Overview

Portun.app uses a combination of:
1. **Supabase Auto-generated REST API** (PostgREST) for CRUD operations
2. **Supabase Edge Functions** (Deno) for business logic
3. **External APIs** (Shelly Cloud, OneSignal) for integrations

---

## Authentication

All API requests require JWT authentication via Supabase Auth.

**Header**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Get Token**:
```typescript
POST /auth/v1/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

---

## Supabase REST API

### Visitor Records

#### GET /rest/v1/visitor_records_uid
**Description**: List visitor records
**Authorization**: Required
**RLS**: Filtered by user permissions

**Query Parameters**:
- `select` - Columns to return (default: `*`)
- `community_id=eq.{uuid}` - Filter by community
- `validity_end=gte.{timestamp}` - Active visitors only
- `order=created_at.desc` - Sort order
- `limit={number}` - Pagination limit
- `offset={number}` - Pagination offset

**Example**:
```bash
GET /rest/v1/visitor_records_uid?
  community_id=eq.550e8400-e29b-41d4-a716-446655440000&
  validity_end=gte.2025-11-14T00:00:00Z&
  order=created_at.desc&
  limit=20
```

**Response** (200 OK):
```json
[
  {
    "id": "uuid",
    "host_uid": "uuid",
    "record_uid": "VIS-12345-ABC",
    "visitor_name": "John Doe",
    "visitor_type": "Guest",
    "qrcode_image_url": "https://...",
    "validity_start": "2025-11-14T00:00:00Z",
    "validity_end": "2025-11-15T23:59:59Z",
    "entries_used": 0,
    "entries_allowed": 1,
    "notes": "Delivery at main gate",
    "created_at": "2025-11-14T10:30:00Z"
  }
]
```

---

#### POST /rest/v1/visitor_records_uid
**Description**: Create new visitor record
**Authorization**: Required
**RLS**: Must be host (auth.uid() = host_uid)

**Request Body**:
```json
{
  "host_uid": "uuid",
  "record_uid": "VIS-67890-XYZ",
  "visitor_name": "Jane Smith",
  "visitor_type": "Guest",
  "validity_end": "2025-11-15T23:59:59Z",
  "property_id": "uuid",
  "community_id": "uuid",
  "entries_allowed": 1,
  "notes": "Expected around 3 PM"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "host_uid": "uuid",
  "record_uid": "VIS-67890-XYZ",
  "visitor_name": "Jane Smith",
  ...
}
```

---

#### PATCH /rest/v1/visitor_records_uid?id=eq.{uuid}
**Description**: Update visitor record
**Authorization**: Required
**RLS**: Must be host or admin

**Request Body**:
```json
{
  "notes": "Updated notes",
  "validity_end": "2025-11-16T23:59:59Z"
}
```

---

#### DELETE /rest/v1/visitor_records_uid?id=eq.{uuid}
**Description**: Delete visitor record
**Authorization**: Required
**RLS**: Must be host

---

### Visitor Logs

#### GET /rest/v1/visitor_record_logs
**Description**: Get entry/exit logs

**Query Parameters**:
- `record_uid=eq.{uid}` - Logs for specific visitor
- `in_time=gte.{timestamp}` - Logs after date
- `order=in_time.desc` - Sort by entry time

**Example**:
```bash
GET /rest/v1/visitor_record_logs?
  record_uid=eq.VIS-12345-ABC&
  order=in_time.desc
```

**Response**:
```json
[
  {
    "id": "uuid",
    "record_uid": "VIS-12345-ABC",
    "visitor_name": "John Doe",
    "in_time": "2025-11-14T15:30:00Z",
    "out_time": null,
    "guard_id": "uuid",
    "photo_url": "https://...",
    "geolocation": "(30.2672,-97.7431)"
  }
]
```

---

### Payment Receipts

#### GET /rest/v1/payment_receipts
**Description**: List payment receipts

**Query Parameters**:
- `status=eq.pending` - Filter by status
- `community_id=eq.{uuid}` - Filter by community
- `profile_id=eq.{uuid}` - Filter by resident

---

#### POST /rest/v1/payment_receipts
**Description**: Upload payment receipt

**Request Body**:
```json
{
  "profile_id": "uuid",
  "community_id": "uuid",
  "amount": 250.00,
  "payment_date": "2025-11-14",
  "reference_number": "CHK-1234",
  "receipt_image_url": "https://...",
  "receipt_hash": "sha256hash..."
}
```

---

#### PATCH /rest/v1/payment_receipts?id=eq.{uuid}
**Description**: Verify or reject payment

**Request Body** (Admin only):
```json
{
  "status": "verified",
  "verified_by": "admin-uuid",
  "verified_at": "2025-11-14T16:00:00Z"
}
```

---

## Supabase Edge Functions

### POST /functions/v1/validate-qr

**Description**: Server-side QR code validation
**Authorization**: Required (Guard role)

**Request Body**:
```json
{
  "record_uid": "VIS-12345-ABC",
  "guard_id": "uuid",
  "geolocation": {
    "lat": 30.2672,
    "lng": -97.7431
  }
}
```

**Response** (200 OK - Access Granted):
```json
{
  "access_granted": true,
  "visitor": {
    "name": "John Doe",
    "type": "Guest",
    "host_name": "Jane Smith",
    "entries_used": 0,
    "entries_allowed": 1,
    "notes": "Delivery at main gate"
  }
}
```

**Response** (403 Forbidden - Access Denied):
```json
{
  "access_granted": false,
  "reason": "QR_EXPIRED",
  "message": "QR code expired on 2025-11-13T23:59:59Z"
}
```

**Error Codes**:
- `QR_NOT_FOUND` - Invalid record_uid
- `QR_EXPIRED` - validity_end < now()
- `LIMIT_REACHED` - entries_used >= entries_allowed
- `BLACKLISTED` - Visitor blacklisted
- `GEOFENCE_VIOLATION` - Guard too far from property

---

### POST /functions/v1/log-entry

**Description**: Log visitor entry and trigger notifications
**Authorization**: Required (Guard role)

**Request Body**:
```json
{
  "record_uid": "VIS-12345-ABC",
  "guard_id": "uuid",
  "photo_url": "https://storage/photo.jpg",
  "geolocation": {
    "lat": 30.2672,
    "lng": -97.7431
  },
  "notes": "Visitor arrived on time"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "log_id": "uuid",
  "notification_sent": true
}
```

**Side Effects**:
1. Increments `entries_used` in `visitor_records_uid` (atomic)
2. Inserts record in `visitor_record_logs`
3. Sends push notification to resident (OneSignal)
4. Creates audit log entry

---

### POST /functions/v1/log-exit

**Description**: Log visitor exit
**Authorization**: Required (Guard role)

**Request Body**:
```json
{
  "log_id": "uuid",
  "out_time": "2025-11-14T17:30:00Z",
  "notes": "Visitor departed"
}
```

**Response**:
```json
{
  "success": true,
  "duration_minutes": 120
}
```

---

### POST /functions/v1/payment-notification

**Description**: Send notification when payment verified (triggered automatically)
**Authorization**: Service role (internal only)

**Trigger**: PostgreSQL trigger on `payment_receipts` UPDATE

**Request Body**:
```json
{
  "payment_id": "uuid",
  "profile_id": "uuid",
  "amount": 250.00,
  "status": "verified"
}
```

**Side Effects**:
1. Sends push notification to resident
2. Sends email confirmation
3. Creates audit log entry

---

## Storage API

### Upload Receipt Image

**Endpoint**: `/storage/v1/object/receipts/{filename}`
**Method**: POST
**Authorization**: Required
**Content-Type**: multipart/form-data

**Request**:
```bash
POST /storage/v1/object/receipts/receipt_2025_11_14.jpg
Content-Type: multipart/form-data

file: <binary image data>
```

**Response**:
```json
{
  "Key": "receipts/receipt_2025_11_14.jpg",
  "url": "https://data.portun.app/storage/v1/object/public/receipts/receipt_2025_11_14.jpg"
}
```

---

### Upload Entry Photo

**Endpoint**: `/storage/v1/object/entry-photos/{filename}`

**Bucket Configuration**:
- Public read access (photos visible to residents)
- Size limit: 5MB per file
- Allowed types: image/jpeg, image/png
- Auto-delete after 90 days (storage cost optimization)

---

## External APIs

### Shelly Cloud API

**Base URL**: https://shelly-144-eu.shelly.cloud

#### POST /device/relay/control
**Description**: Open/close gate or door

**Request**:
```bash
POST /device/relay/control
Content-Type: application/x-www-form-urlencoded

id=c8f09e8808c0&
auth_key=<encrypted-key>&
channel=0&
turn=on
```

**Response**:
```json
{
  "isok": true,
  "ison": true
}
```

**Parameters**:
- `id` - Shelly device ID
- `auth_key` - API authentication key (stored encrypted in DB)
- `channel` - Relay channel (0, 1, etc.)
- `turn` - Action: `on` (unlock/open) or `off` (lock/close)

---

#### GET /device/status
**Description**: Check device status

**Request**:
```bash
GET /device/status?id=c8f09e8808c0&auth_key=<key>
```

**Response**:
```json
{
  "relay": {
    "ison": false,
    "has_timer": false,
    "overpower": false
  },
  "uptime": 123456
}
```

---

### OneSignal Push Notifications

**Base URL**: https://onesignal.com/api/v1

#### POST /notifications
**Description**: Send push notification

**Headers**:
```
Authorization: Basic <ONESIGNAL_API_KEY>
Content-Type: application/json
```

**Request**:
```json
{
  "app_id": "<ONESIGNAL_APP_ID>",
  "include_external_user_ids": ["resident-uuid"],
  "headings": {
    "en": "Guest Arrived",
    "es": "Invitado Llegó"
  },
  "contents": {
    "en": "John Doe checked in at 3:30 PM",
    "es": "John Doe ingresó a las 3:30 PM"
  },
  "data": {
    "type": "visitor_entry",
    "log_id": "uuid",
    "photo_url": "https://..."
  },
  "ios_badgeType": "Increase",
  "ios_badgeCount": 1
}
```

**Response**:
```json
{
  "id": "notification-uuid",
  "recipients": 1
}
```

---

## Realtime API (WebSocket)

### Subscribe to Entry Logs

**Channel**: `visitor_record_logs`
**Event**: `INSERT`

**JavaScript Example**:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, anonKey)

const channel = supabase
  .channel('entry-logs')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'visitor_record_logs',
      filter: `host_uid=eq.${userId}`
    },
    (payload) => {
      console.log('New entry:', payload.new)
      // Update UI in real-time
    }
  )
  .subscribe()
```

---

### Subscribe to Payment Updates

**Channel**: `payment_receipts`
**Event**: `UPDATE`

```typescript
supabase
  .channel('payment-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'payment_receipts',
      filter: `profile_id=eq.${userId}`
    },
    (payload) => {
      if (payload.new.status === 'verified') {
        showNotification('Payment verified!')
      }
    }
  )
  .subscribe()
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "validity_end",
      "reason": "Must be a future date"
    }
  },
  "timestamp": "2025-11-14T10:30:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PATCH/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid JWT |
| 403 | Forbidden | RLS policy violation |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (e.g., record_uid) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/v1/token` | 5 requests | 1 minute per IP |
| `/functions/v1/validate-qr` | 200 requests | 1 minute per user |
| `/functions/v1/log-entry` | 100 requests | 1 minute per user |
| `/rest/v1/*` | 1000 requests | 1 minute per user |
| `/storage/v1/object/*` | 50 uploads | 1 minute per user |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1699999999
```

---

## API Versioning

**Current Version**: v1 (stable)

**Version Strategy**:
- Major versions in URL path (`/v1/`, `/v2/`)
- Backward compatibility maintained for 6 months
- Deprecation warnings in headers:
  ```
  Deprecation: version="v1", sunset="2026-06-01"
  Sunset: Sat, 01 Jun 2026 00:00:00 GMT
  ```

---

## Postman Collection

Download complete Postman collection:
```
https://www.getpostman.com/collections/portun-api-v1
```

---

**Total Endpoints**: 25+
**Edge Functions**: 3
**External APIs**: 2
