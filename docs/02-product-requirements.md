# Product Requirements Document (PRD): Portun.app MVP

**Document Version**: 1.0
**Last Updated**: 2025-11-14
**Product Manager**: Portun.app Team
**Target Release**: Q1 2026 (2-3 months)
**Status**: Draft - Approved

---

## 1. PRODUCT OVERVIEW

### 1.1 Vision Statement
Portun.app is the accessible, secure QR access control platform for US and Latin American residential communities, delivering enterprise-grade reliability at value pricing.

### 1.2 Product Mission
Empower self-managed HOAs and small property management companies (10-200 units) with professional-grade visitor management and payment tracking without complexity or enterprise costs.

### 1.3 Success Metrics (North Star)
- **Primary**: 50 communities onboarded in first 6 months
- **Secondary**: 85% resident app adoption rate (residents with app / total units)
- **Financial**: $10K MRR by month 6
- **Quality**: <5% churn rate, 4.5+ app store rating

### 1.4 Target Users

**Primary Users**:
1. **Residents** (End users): Homeowners and tenants who invite visitors
2. **Security Guards** (Operators): Personnel who validate visitor access
3. **Property Managers** (Administrators): HOA managers, community admins

**Secondary Users**:
4. **Visitors**: Guests using QR codes for entry
5. **Board Members**: HOA board members monitoring finances

---

## 2. PROBLEM STATEMENT

### 2.1 Current Pain Points

**For Small Communities (10-50 units)**:
- Manual visitor logs (paper/Excel) are error-prone and insecure
- No affordable digital access control (enterprise solutions $5-10K+ setup fees)
- Payment tracking via spreadsheets and receipt photos in WhatsApp
- Security guards have no professional tools
- No accountability or audit trail

**For Property Managers**:
- Juggling multiple communities with different systems
- Residents constantly asking "Did my guest arrive?"
- Payment verification is manual and time-consuming
- No visibility into visitor patterns or security incidents

**For Residents**:
- Must call/text guard every time expecting visitor
- Guests wait at gate while guard confirms permission
- No proof of payment unless keeping receipts
- Amenity reservations handled via group chat chaos

---

## 3. PRODUCT GOALS & NON-GOALS

### 3.1 MVP Goals (Must Ship)
✅ **QR Access Control**: Residents can invite visitors, guards can validate access
✅ **Payment Tracking**: Residents upload receipts, admins verify payments
✅ **Real-time Notifications**: Push notifications for entry events and payment status
✅ **Multi-property Support**: Property managers can manage multiple communities
✅ **Offline Access**: Core QR validation works without internet
✅ **Bilingual**: Full English and Spanish support

### 3.2 MVP Non-Goals (Explicitly Out of Scope)
❌ Automated payment processing (Stripe/ACH) - Phase 2
❌ Amenity reservations - Phase 2B
❌ Maintenance requests - Phase 2B
❌ Package delivery notifications - Phase 2B
❌ AI/ML visitor pattern recognition - Phase 3
❌ Facial recognition - Phase 3
❌ Community messaging/social features - Phase 3
❌ Employee payroll management - Never (niche)

---

## 4. USER PERSONAS

### Persona 1: Maria Rodriguez - Resident
**Demographics**: 35, homeowner, works from home, tech-comfortable
**Community**: 80-unit HOA in Austin, TX
**Pain Points**:
- Hosts clients at home office, needs professional visitor experience
- Tired of texting guard every time expecting someone
- Wants proof of HOA payment for tax records

**Goals**:
- Invite visitors with one tap
- Track who entered and when
- Keep organized payment history

**Quote**: "I just want my guests to walk right in without the awkward gate wait while the guard calls me."

---

### Persona 2: Carlos Mendez - Security Guard
**Demographics**: 48, bilingual, smartphone user but not tech-savvy
**Community**: Works 3 different properties, 12-hour shifts
**Pain Points**:
- Juggling 3 different paper logbooks
- Residents get mad when he delays their guests
- No way to prove he denied unauthorized visitor

**Goals**:
- Quick visitor validation (< 10 seconds)
- Clear instructions (approved/denied)
- Photo evidence of every entry

**Quote**: "When someone shows up at 2 AM without permission, I need backup that I made the right call."

---

### Persona 3: Jennifer Kim - Property Manager
**Demographics**: 42, manages 5 small HOAs (total 200 units)
**Communities**: Mix of self-managed and professional management
**Pain Points**:
- Each community has different visitor process
- Spends 5+ hours/week verifying payment receipts
- Board members constantly asking for financial reports

**Goals**:
- One dashboard for all properties
- Automated payment verification
- Export reports for board meetings

**Quote**: "I need to spend less time on admin busywork and more time adding value for my clients."

---

## 5. CORE FEATURES & USER STORIES

### 5.1 QR Access Control

#### Epic 1.1: Visitor Invitation (Resident)

**User Story 1.1.1**: As a resident, I want to create a visitor invitation with one tap so my guest can enter quickly.

**Acceptance Criteria**:
- [ ] Tap "Add Visitor" button on home screen
- [ ] Enter visitor name (required)
- [ ] Select visitor type from dropdown (Guest, Delivery, Service Provider, Family)
- [ ] Choose validity period:
  - [ ] "Today Only" (default)
  - [ ] "This Week"
  - [ ] "Custom Date Range" (date picker)
- [ ] Set entry limit:
  - [ ] "Single Entry" (default for Today Only)
  - [ ] "Unlimited" (for custom ranges)
  - [ ] Custom number (1-99)
- [ ] Optional: Add notes for guard (e.g., "Tesla repair service")
- [ ] Tap "Generate QR Code"
- [ ] QR code appears with share button
- [ ] Can share via WhatsApp, SMS, Email, or copy link

**Technical Requirements**:
- QR code encodes: `record_uid` (UUID format)
- QR generated client-side (offline capability)
- Record saved to Supabase `visitor_records_uid` table
- `qrcode_image_url` generated and stored for sharing

---

**User Story 1.1.2**: As a resident, I want to see countdown timer on visitor QR code so I know when it expires.

**Acceptance Criteria**:
- [ ] QR code detail screen shows validity dates prominently
- [ ] If expires today, show countdown: "Expires in 4 hours 23 min"
- [ ] If multi-day, show: "Valid until Mar 15, 2026 11:59 PM"
- [ ] If expired, QR code grayed out with red "EXPIRED" banner
- [ ] Show entries used: "2 of 5 entries used" badge

---

**User Story 1.1.3**: As a resident, I want to see entry history for my visitors so I know who came and when.

**Acceptance Criteria**:
- [ ] Visitor detail screen has "Entry Log" section
- [ ] Each entry shows:
  - [ ] Entry timestamp (with timezone)
  - [ ] Exit timestamp (if recorded)
  - [ ] Guard name (if available)
  - [ ] Entry photo thumbnail (if captured)
- [ ] Empty state: "No entries yet for this visitor"
- [ ] Can tap entry to see full details and photo

---

#### Epic 1.2: QR Code Scanning (Guard)

**User Story 1.2.1**: As a guard, I want to scan a visitor's QR code so I can validate their access quickly.

**Acceptance Criteria**:
- [ ] Guard app opens directly to camera scanner on launch
- [ ] Red laser line visible while scanning
- [ ] Scans `record_uid` from QR code
- [ ] Validates against database within 2 seconds
- [ ] If valid:
  - [ ] Shows visitor name, photo (if available), unit number
  - [ ] Shows validity dates and entries remaining
  - [ ] Shows resident name who invited them
  - [ ] "APPROVE ENTRY" button (green)
- [ ] If invalid:
  - [ ] Shows "ACCESS DENIED" screen (red)
  - [ ] Shows reason: "Expired", "Max entries reached", "Not found"
  - [ ] Shows resident contact info to call
  - [ ] "DENY ENTRY" button (red)

**Technical Requirements**:
- Uses `flutter_barcode_scanner` package
- Validates `record_uid` against `visitor_records_uid.id`
- Checks `validityEnd >= NOW()` and `entriesUsed < entriesAllowed`
- Works offline using last 100 cached approved visitors

---

**User Story 1.2.2**: As a guard, I want to take a photo of the visitor when granting access so there's visual evidence.

**Acceptance Criteria**:
- [ ] After scanning valid QR, camera opens for photo
- [ ] Guard can retake photo if needed
- [ ] Photo uploaded to Supabase Storage
- [ ] Photo URL saved in `visitor_record_logs.doc1_upload_url`
- [ ] Timestamp and geolocation tagged to photo
- [ ] If offline, photo queued for upload when online

---

**User Story 1.2.3**: As a guard, I want to see visitor entry limits so I don't accidentally let someone in too many times.

**Acceptance Criteria**:
- [ ] Validation screen shows: "Entries used: 3 of 5"
- [ ] If at limit, show warning: "FINAL ENTRY - Max entries reached"
- [ ] If exceeded, auto-deny with message: "Visitor has used all allowed entries"
- [ ] Guard cannot override limit (security requirement)

---

#### Epic 1.3: Entry Logging & Notifications

**User Story 1.3.1**: As a resident, I want a push notification when my guest arrives so I can greet them.

**Acceptance Criteria**:
- [ ] Notification sent immediately when guard approves entry
- [ ] Notification title: "Guest Arrived"
- [ ] Notification body: "[Visitor Name] checked in at [Time]"
- [ ] Tapping notification opens visitor detail screen
- [ ] Includes entry photo thumbnail in notification (if available)
- [ ] Works via OneSignal (primary) and FCM (fallback)

---

**User Story 1.3.2**: As a property manager, I want to see all entry logs for my properties so I can monitor activity.

**Acceptance Criteria**:
- [ ] Admin portal has "Entry Logs" page
- [ ] Table shows: Timestamp, Visitor Name, Resident, Property, Guard, Status
- [ ] Filterable by:
  - [ ] Date range (default: last 7 days)
  - [ ] Property (multi-select)
  - [ ] Visitor type
  - [ ] Status (approved/denied)
- [ ] Sortable by any column
- [ ] Export to CSV button
- [ ] Pagination (50 entries per page)

---

### 5.2 Payment Tracking

#### Epic 2.1: Payment Receipt Upload (Resident)

**User Story 2.1.1**: As a resident, I want to upload proof of payment so the admin knows I paid my HOA fees.

**Acceptance Criteria**:
- [ ] "Payments" tab in bottom navigation
- [ ] "Upload Receipt" button prominent
- [ ] Choose photo source: Camera or Gallery
- [ ] Crop/rotate image before upload
- [ ] Enter payment details:
  - [ ] Amount (required, USD format with $ symbol)
  - [ ] Payment date (default: today)
  - [ ] Reference number (optional, e.g., check number)
  - [ ] Notes (optional)
- [ ] Upload to Supabase Storage
- [ ] Shows upload progress bar
- [ ] Receipt appears in "Payment History" with "Pending Verification" status

**Technical Requirements**:
- Image compressed to < 2MB before upload
- Formats accepted: JPG, PNG, PDF
- Hash calculated and stored in `receipt_hash` field
- Geotag stripped from image (privacy)

---

**User Story 2.1.2**: As a resident, I want to see my payment history so I can track what I've paid.

**Acceptance Criteria**:
- [ ] Payment history list shows:
  - [ ] Receipt thumbnail
  - [ ] Amount with $ symbol
  - [ ] Payment date
  - [ ] Status badge: "Pending" (yellow), "Verified" (green), "Rejected" (red)
  - [ ] Verification date (if verified)
- [ ] Tap receipt to view full image and details
- [ ] Can re-upload if rejected
- [ ] Filter by year/month
- [ ] Download verified receipts as PDF

---

#### Epic 2.2: Payment Verification (Admin)

**User Story 2.2.1**: As a property manager, I want to review pending payment receipts so I can verify resident payments.

**Acceptance Criteria**:
- [ ] Admin portal "Payments" tab shows pending count badge
- [ ] "Pending Verification" queue lists receipts chronologically
- [ ] Each receipt shows:
  - [ ] Resident name and unit number
  - [ ] Submitted date
  - [ ] Amount claimed
  - [ ] Receipt image (click to enlarge)
  - [ ] Actions: Verify or Reject
- [ ] Verify action:
  - [ ] Confirm amount matches receipt
  - [ ] Mark as "Verified"
  - [ ] Send push notification to resident
- [ ] Reject action:
  - [ ] Require rejection reason (dropdown + text field)
  - [ ] Send notification with reason to resident
  - [ ] Resident can re-upload

---

**User Story 2.2.2**: As a property manager, I want to export payment reports so I can share with the board.

**Acceptance Criteria**:
- [ ] "Export Payments" button on payments page
- [ ] Select date range
- [ ] Select properties (multi-select)
- [ ] Choose format: CSV or PDF
- [ ] CSV includes: Resident, Unit, Amount, Date, Status, Verified By, Verified Date
- [ ] PDF formatted as professional report with community logo
- [ ] Download initiated within 5 seconds

---

### 5.3 Admin Portal (Web)

#### Epic 3.1: Resident Management

**User Story 3.1.1**: As a property manager, I want to add residents so they can use the app.

**Acceptance Criteria**:
- [ ] "Residents" section in admin portal
- [ ] "Add Resident" button opens form:
  - [ ] Full name (required)
  - [ ] Email (required, validated)
  - [ ] Phone (optional, formatted)
  - [ ] Property (dropdown, required)
  - [ ] Unit number (required)
  - [ ] Role (default: Resident, options: Owner, Tenant, Board Member)
  - [ ] Status (default: Active)
- [ ] On submit:
  - [ ] Creates `profile` record
  - [ ] Sends email invitation with app download link
  - [ ] Sets temporary password or magic link
- [ ] Duplicate email check before submit

---

**User Story 3.1.2**: As a property manager, I want to import residents from CSV so I don't manually enter hundreds of people.

**Acceptance Criteria**:
- [ ] "Import CSV" button on residents page
- [ ] Download CSV template button
- [ ] Template columns: Full Name, Email, Phone, Property, Unit, Role
- [ ] Upload CSV file (< 5MB)
- [ ] Validation preview:
  - [ ] Shows valid rows (green)
  - [ ] Shows errors (red) with reason
  - [ ] Can fix errors inline
- [ ] "Import X Residents" button
- [ ] Batch import with progress bar
- [ ] Summary: "45 imported, 3 errors"
- [ ] Sends batch invitation emails

---

#### Epic 3.2: Property & Community Setup

**User Story 3.2.1**: As a property manager, I want to create a community so I can start managing it.

**Acceptance Criteria**:
- [ ] "Add Community" wizard (step-by-step)
- [ ] Step 1 - Basic Info:
  - [ ] Community name (required)
  - [ ] Address (required, Google Maps autocomplete)
  - [ ] Timezone (auto-detected from address)
  - [ ] Logo upload (optional)
- [ ] Step 2 - Properties:
  - [ ] Add property name (e.g., "Building A", "Tower 1")
  - [ ] Number of units (generates unit list)
  - [ ] Can add multiple properties
- [ ] Step 3 - Access Devices:
  - [ ] Device name (e.g., "Main Gate")
  - [ ] Device type: Shelly Relay or Manual
  - [ ] API credentials (if Shelly)
  - [ ] Can add multiple devices
- [ ] Step 4 - Review & Create
  - [ ] Summary of all settings
  - [ ] "Create Community" button
  - [ ] Redirects to community dashboard

---

### 5.4 Mobile App Enhancements

#### Epic 4.1: Security Improvements

**User Story 4.1.1**: As a guard, I want to use my fingerprint to unlock the app so it's secure.

**Acceptance Criteria**:
- [ ] On first launch, prompt to enable biometric auth
- [ ] Supports Face ID (iOS) and Fingerprint (Android)
- [ ] After setup, app requires biometric to unlock
- [ ] Falls back to PIN if biometric unavailable
- [ ] Can disable in settings (requires password)

---

**User Story 4.1.2**: As a developer, I want API keys in environment variables so they're not exposed in code.

**Acceptance Criteria**:
- [ ] Supabase URL and anon key moved to `.env` file
- [ ] `.env` file added to `.gitignore`
- [ ] `.env.example` file with placeholder values
- [ ] Build process reads from environment variables
- [ ] Different `.env` files for dev/staging/prod

---

#### Epic 4.2: Offline Mode

**User Story 4.2.1**: As a guard, I want the app to work offline so I can validate visitors during internet outages.

**Acceptance Criteria**:
- [ ] App caches last 100 approved visitor records locally
- [ ] QR scan works offline using cache
- [ ] Entry logs queued in local database (Hive)
- [ ] When online, queued logs uploaded to Supabase
- [ ] Banner shows "Offline Mode" when no connection
- [ ] Sync status indicator: "Last synced 5 min ago"

**Technical Requirements**:
- Use Hive for local storage
- Background sync every 30 seconds when online
- Conflict resolution: Server always wins
- Manual "Sync Now" button in settings

---

## 6. USER FLOWS

### 6.1 Resident Invites Visitor Flow
1. Resident opens app → Home screen
2. Taps "Add Visitor" floating action button
3. Enters visitor name "John Doe"
4. Selects type "Guest"
5. Chooses "Today Only"
6. Taps "Generate QR Code"
7. QR code displayed with countdown timer
8. Taps "Share via WhatsApp"
9. Selects contact "John Doe"
10. WhatsApp opens with QR image pre-attached
11. Sends message "Here's your access code!"

### 6.2 Guard Validates Visitor Flow
1. Visitor arrives at gate with QR code on phone
2. Guard opens app (biometric unlock)
3. Scanner camera opens automatically
4. Guard scans visitor's QR code
5. App validates (checks validity, limits)
6. Validation successful → Shows visitor details
7. Guard taps "Take Photo"
8. Camera opens, guard photographs visitor
9. Guard taps "Approve Entry"
10. App logs entry, uploads photo
11. Push notification sent to resident
12. Guard taps "Open Gate" (if Shelly device configured)
13. Gate opens, visitor enters
14. Confirmation screen: "Entry logged successfully"

### 6.3 Resident Uploads Payment Receipt Flow
1. Resident pays HOA fee via bank transfer
2. Opens app → Payments tab
3. Taps "Upload Receipt" button
4. Chooses "Take Photo"
5. Camera opens, takes photo of receipt
6. Crops image
7. Enters amount "$250.00"
8. Enters payment date (auto-fills today)
9. Enters reference "Check #1234"
10. Taps "Submit"
11. Upload progress bar
12. Success message: "Receipt submitted for verification"
13. Receipt appears in history with "Pending" status

### 6.4 Admin Verifies Payment Flow
1. Admin receives notification "3 new payment receipts"
2. Opens admin portal → Payments page
3. Sees pending queue with 3 receipts
4. Clicks first receipt to enlarge image
5. Checks amount matches ($250 ✓)
6. Clicks "Verify" button
7. Confirmation dialog: "Mark as verified?"
8. Clicks "Yes"
9. Receipt marked verified, timestamp recorded
10. Push notification sent to resident
11. Next receipt auto-loads for review

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### 7.1 Performance
- QR scan to validation result: < 2 seconds (online)
- QR scan to validation result: < 500ms (offline/cached)
- Image upload: < 5 seconds (< 2MB images)
- Admin portal page load: < 1 second
- Mobile app cold start: < 3 seconds

### 7.2 Security
- All API communication over HTTPS/TLS 1.3
- Row Level Security (RLS) enabled on all Supabase tables
- Passwords hashed with bcrypt (Supabase Auth default)
- Biometric authentication for guard app
- Session timeout: 7 days (resident), 12 hours (guard), 24 hours (admin)
- OWASP Top 10 compliance
- No API keys or secrets in client code

### 7.3 Scalability
- Support up to 500 properties per instance
- Support up to 50,000 residents per instance
- Support 100 concurrent QR scans per second
- Database query response: < 100ms (p95)
- Horizontal scaling via Supabase serverless

### 7.4 Availability
- 99.9% uptime target (< 43 minutes downtime/month)
- Graceful degradation: offline mode for critical functions
- Automated backups daily (Supabase)
- Disaster recovery: 4-hour RTO, 1-hour RPO

### 7.5 Usability
- Mobile apps: 4.5+ star rating target
- Resident onboarding: < 5 minutes (download to first QR code)
- Guard training: < 15 minutes (to productive use)
- Admin setup: < 30 minutes (new community to first resident)
- Accessibility: WCAG 2.1 AA compliance (web)

### 7.6 Localization
- Full English and Spanish support
- Currency display: USD (US), MXN (Mexico), locale-aware
- Date/time: Timezone-aware, locale formatting
- Right-to-left (RTL) ready for future languages

---

## 8. SUCCESS CRITERIA

### 8.1 Launch Readiness Checklist
- [ ] All P0 bugs fixed (security, data loss, crashes)
- [ ] P1 bugs < 5 (UX issues, non-critical errors)
- [ ] App store approval (iOS and Android)
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] 10 beta communities testing (at least 2 weeks)
- [ ] Documentation complete (user guides, API docs)
- [ ] Support email/chat set up

### 8.2 Post-Launch Metrics (30 days)
**Adoption**:
- 10+ communities signed up
- 500+ residents registered
- 1,000+ visitor QR codes generated
- 200+ payment receipts uploaded

**Engagement**:
- 70%+ resident app installation rate
- 50%+ monthly active residents
- 80%+ guards using app daily
- < 10% uninstall rate

**Quality**:
- < 2% crash rate
- < 5% support ticket rate
- 4.0+ app store rating
- < 5% churn rate

**Revenue**:
- $2,000+ MRR (monthly recurring revenue)
- 15+ paying communities
- $1-2 CAC/LTV ratio (if paid ads)

### 8.3 Pivot Indicators
If after 90 days:
- < 5 communities signed up → Re-evaluate pricing or target market
- < 50% resident adoption rate → UX issues, need usability testing
- > 20% churn rate → Product-market fit problem
- > 10% support ticket rate → Quality issues, need bug fixes

---

## 9. RISKS & MITIGATIONS

### 9.1 Technical Risks

**Risk**: Offline mode sync conflicts cause data loss
**Mitigation**:
- Thorough testing of sync logic
- Server-side conflict resolution (server wins)
- Audit log for all changes
- **Owner**: Engineering Lead

**Risk**: Shelly Cloud API goes down, gates can't open
**Mitigation**:
- Manual override button in guard app
- Fallback to local device control (if possible)
- SLA monitoring and alerts
- **Owner**: DevOps Engineer

### 9.2 Market Risks

**Risk**: Competitors lower prices, undercut our value position
**Mitigation**:
- Focus on quality and reliability vs price alone
- 30-day free trial reduces price sensitivity
- Bundle features (QR + Payments) vs à la carte
- **Owner**: Product Manager

**Risk**: Small communities don't want to pay for software
**Mitigation**:
- Free tier for 10 units or less
- ROI calculator on website (time saved vs cost)
- Testimonials from similar-sized communities
- **Owner**: Marketing Lead

### 9.3 Regulatory Risks

**Risk**: Data privacy regulations (GDPR, CCPA) require changes
**Mitigation**:
- Privacy policy and terms of service ready at launch
- GDPR-compliant data handling (Supabase EU region option)
- Resident data export and deletion features
- **Owner**: Legal Counsel

---

## 10. RELEASE PLAN

### 10.1 Alpha Release (Week 6)
**Audience**: Internal team + 2 friendly communities
**Features**: QR access only, manual testing
**Goal**: Validate core flow works end-to-end

### 10.2 Beta Release (Week 8)
**Audience**: 10 communities (mix of US and LATAM)
**Features**: QR access + payment tracking
**Goal**: Stress test, gather feedback, fix bugs
**Duration**: 2 weeks minimum

### 10.3 MVP Release (Week 10)
**Audience**: Public (soft launch)
**Features**: Full MVP feature set
**Goal**: Onboard first 50 communities
**Marketing**: Landing page live, SEO, local outreach

---

## 11. FUTURE ROADMAP (Post-MVP)

### Phase 2A: Payment Automation (Month 4-5)
- Stripe integration for credit card payments
- ACH/bank transfer support
- Automated HOA fee billing (recurring)
- Payment plans and late fees
- Automated email reminders

### Phase 2B: Community Features (Month 6-7)
- Amenity reservations (clubhouse, gym, pool)
- Package delivery notifications
- Maintenance request submission
- Community announcements feed
- Document storage (HOA rules, meeting minutes)

### Phase 3: Advanced Features (Month 8-12)
- GPS patrol tracking (Residentfy model)
- Facial recognition option (ComunidadFeliz model)
- AI visitor pattern recognition
- Predictive access (auto-approve frequent visitors)
- Anomaly detection (unusual access patterns)
- Smart home integration (Ring, Nest, etc.)

---

## 12. APPENDIX

### 12.1 Glossary
- **QR Code**: Quick Response code containing visitor record UID
- **Entry Limit**: Maximum number of times a visitor can use same QR code
- **Validity Period**: Date/time range when QR code is active
- **RLS**: Row Level Security (Supabase/PostgreSQL feature)
- **OneSignal**: Push notification service provider
- **Shelly Cloud**: Smart relay device for gate/door control

### 12.2 References
- Competitive Analysis: `01-competitive-analysis.md`
- Technical Architecture: `03-technical-architecture.md`
- Current System Audit: `04-current-system-audit.md`
- API Specification: `07-api-specification.md`

### 12.3 Change Log
- **2025-11-14**: Initial PRD created based on competitive research and stakeholder input

---

**Approval Signatures**:
- [ ] Product Manager: _________________ Date: _______
- [ ] Engineering Lead: _________________ Date: _______
- [ ] CEO/Founder: _____________________ Date: _______

**Next Review Date**: 2025-12-01 (or after Alpha release)
