# Product Requirements Document - Portun.app

**Date**: 2025-11-14
**Version**: 1.0
**Status**: MVP Planning Complete

---

## Vision & Goals

### Vision
Make residential community access control simple, affordable, and secure for communities of all sizes across the Americas.

### Mission
Deliver enterprise-grade QR access control at 1/3 the cost of premium solutions.

### MVP Goals
1. Launch functional QR access control system
2. Provide manual payment tracking for HOA fees
3. Support bilingual users (English/Spanish)
4. Onboard 10+ communities within 30 days of launch

---

## User Personas

### 1. Maria Rodriguez - Resident (Host)
- **Age**: 35
- **Role**: Homeowner in gated community
- **Tech comfort**: Moderate (uses WhatsApp daily)
- **Pain points**:
  - Calling guard every time a guest arrives
  - Forgetting to notify guard about visitors
  - Not knowing when visitors actually arrived
- **Goals**:
  - Create QR codes quickly
  - Share via WhatsApp
  - Get notified when guests arrive
- **Success quote**: "I created a QR code in 10 seconds!"

### 2. Carlos Mendez - Security Guard
- **Age**: 45
- **Role**: Gate guard working 12-hour shifts
- **Tech comfort**: Basic (smartphone user)
- **Pain points**:
  - Manual logbooks are slow
  - Calling residents to verify visitors
  - Internet sometimes goes down
- **Goals**:
  - Scan QR and validate instantly
  - Log entries without paperwork
  - Work even when offline
- **Success quote**: "No more phone calls to verify visitors!"

### 3. Jennifer Kim - Property Manager
- **Age**: 42
- **Role**: Manages 5 communities (150 units total)
- **Tech comfort**: High (uses multiple software tools)
- **Pain points**:
  - Manual payment tracking in Excel
  - Chasing residents for HOA payments
  - No visibility into access logs
- **Goals**:
  - Dashboard to see all payments
  - Verify receipts efficiently
  - Export reports for board meetings
- **Success quote**: "I saved 10 hours/month on payment reconciliation!"

### 4. Visitor (Guest)
- **Age**: Varies
- **Role**: Secondary user, receives QR codes
- **Tech comfort**: Varies
- **Pain points**:
  - Waiting at gate while guard calls host
  - Not knowing if QR code is valid
- **Goals**:
  - Fast, frictionless entry
  - Clear instructions
- **Success quote**: "I just showed my phone and drove in!"

---

## User Stories - MVP

### QR Access Control

**US-001**: Create Visitor QR Code
> As a resident, I want to create a visitor QR code with name, date, and vehicle info so my guest can enter without me calling the guard.

Acceptance Criteria:
- QR generated in < 10 seconds
- Shareable via WhatsApp/SMS
- Shows expiry date/time
- Optional: entry limit, vehicle info

**US-002**: Scan and Validate QR Code
> As a guard, I want to scan a QR code and see visitor details (name, host, validity) so I can grant/deny access in < 30 seconds.

Acceptance Criteria:
- Camera opens immediately (< 500ms)
- Validation result displays in < 2 seconds
- Shows visitor name, host name, vehicle info
- Clear green/red indication

**US-003**: Receive Entry Notification
> As a resident, I want to receive a push notification when my visitor arrives so I know they got in safely.

Acceptance Criteria:
- Notification within 5 seconds of entry log
- Shows visitor name and time
- Tappable to view entry details

**US-004**: Capture Entry Photos
> As a guard, I want to take a photo of the visitor and their vehicle so we have visual proof of entry.

Acceptance Criteria:
- Photo capture optional but encouraged
- Stored with entry log
- Viewable by host and admin

**US-005**: View Entry Logs
> As an admin, I want to see all entry logs with filters (date, host, guard) so I can audit security incidents.

Acceptance Criteria:
- Searchable table
- Filter by date range, host, guard
- Export to CSV
- Shows photos if available

**US-006**: Set Entry Limits
> As a resident, I want to set entry limits on QR codes so my cleaner can only enter once, not repeatedly.

Acceptance Criteria:
- Entry counter enforced at database level
- QR invalid after limit reached
- Host can see entries used vs allowed

**US-007**: Offline QR Validation
> As a guard, I want the app to work offline so I can validate QR codes even if internet is down.

Acceptance Criteria:
- Last 100 active QR codes cached locally
- Offline validation shows warning badge
- Entries queued and synced when online

### Payment Tracking

**US-008**: Upload Payment Receipt
> As a resident, I want to upload my HOA payment receipt so the admin knows I paid.

Acceptance Criteria:
- Photo upload with auto-compression
- Status tracking (pending/verified/rejected)
- One receipt per month limit

**US-009**: Verify Payment Receipts
> As an admin, I want to verify/reject payment receipts with notes so I can keep accurate financial records.

Acceptance Criteria:
- Queue of pending receipts
- One-click approve/reject
- Rejection requires reason
- Notification sent to resident

**US-010**: View Payment History
> As a resident, I want to view my payment history so I can prove I'm up to date.

Acceptance Criteria:
- List of all payments with status badges
- Verified/Pending/Rejected indicators
- Receipt image viewable

### Admin Portal

**US-011**: Manage Residents
> As an admin, I want to add, edit, and remove residents so I can keep the community roster current.

Acceptance Criteria:
- Add individual residents
- Bulk import via CSV
- Edit resident details
- Deactivate (not delete) residents

**US-012**: View Dashboard Analytics
> As an admin, I want to see community analytics so I can report to the board.

Acceptance Criteria:
- Total residents, active visitors
- Entry counts by day/week/month
- Payment collection rate
- Recent activity feed

**US-013**: Export Reports
> As an admin, I want to export payment and entry reports so I can share with the HOA board.

Acceptance Criteria:
- Export to CSV
- Filter by date range
- Include relevant details

---

## Out of Scope (MVP)

The following features are explicitly NOT included in MVP:

- ❌ Automated payment processing (Stripe/ACH)
- ❌ Recurring billing
- ❌ Late fee automation
- ❌ Hardware gate integration (auto-open)
- ❌ Visitor pre-registration portal
- ❌ Community announcements/messaging
- ❌ Amenity booking
- ❌ Maintenance requests
- ❌ Multi-property management dashboard
- ❌ White-label/custom branding
- ❌ API for third-party integrations

---

## Success Metrics

### Adoption (30 Days Post-Launch)
| Metric | Target |
|--------|--------|
| Communities signed up | 10+ |
| Residents registered | 500+ |
| Visitor QR codes generated | 1,000+ |

### Engagement
| Metric | Target |
|--------|--------|
| Resident app installation rate | 70%+ |
| Monthly active residents | 50%+ |
| Uninstall rate | < 10% |

### Quality
| Metric | Target |
|--------|--------|
| Crash rate | < 2% |
| App store rating | 4.0+ |
| Support ticket rate | < 5% |

### Revenue
| Metric | Target |
|--------|--------|
| MRR | $2,000+ |
| Paying communities | 15+ |
| Average revenue/community | $150+ |

---

## Roadmap

### Phase 1: MVP (Weeks 1-10)
- Security hardening (P0 fixes)
- Admin portal development
- Mobile app improvements
- Beta launch with 5 communities

### Phase 2: Growth (Months 4-6)
- Automated payment processing
- Hardware gate integrations
- Advanced analytics
- Referral program

### Phase 3: Scale (Months 7-12)
- Multi-property dashboard
- White-label options
- API for integrations
- International expansion

---

*Document maintained by Portun.app Product Team*
