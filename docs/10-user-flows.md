# User Flows & Journey Maps

**Version**: 1.0
**Last Updated**: 2025-11-14

---

## Overview

This document visualizes the complete user journeys for all three primary user types in Portun.app.

---

## 1. RESIDENT USER JOURNEY

### Journey 1: First-Time Onboarding

```
Start: Resident receives email invitation from property manager
    ↓
┌─────────────────────────────────────────────────────┐
│ Step 1: Receives Email                              │
│ "Welcome to Portun.app"                             │
│ [Download App] button                               │
│ Touchpoint: Email                                   │
│ Emotion: 😐 Neutral, curious                        │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 2: Downloads App                               │
│ iOS App Store or Google Play                        │
│ App size: ~15MB, downloads in < 30 seconds          │
│ Touchpoint: App Store                               │
│ Emotion: 😊 Anticipating                            │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 3: Opens App & Creates Account                │
│ • Email auto-filled from invitation link            │
│ • Sets password (8+ chars, strength indicator)      │
│ • Accepts terms & privacy policy                    │
│ Touchpoint: Mobile App                              │
│ Duration: 2 minutes                                 │
│ Emotion: 😐 Focused                                 │
│ Pain Point: Password requirements unclear initially │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 4: Onboarding Tutorial (Optional Skip)        │
│ • Swipeable screens (4 screens)                     │
│ • "Create visitors", "Get notifications", etc.      │
│ • Skip button always visible                        │
│ Touchpoint: Mobile App                              │
│ Duration: 1 minute (or skip)                        │
│ Emotion: 😊 Learning                                │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 5: Lands on Home Dashboard                    │
│ • Empty state: "No active visitors"                 │
│ • Prominent "Add Visitor" button                    │
│ • Bottom nav: Home, Visitors, Scan, Stats, Profile  │
│ Touchpoint: Mobile App                              │
│ Emotion: 😀 Ready to use                            │
│ Success Metric: Reached dashboard (onboarding done) │
└─────────────────────────────────────────────────────┘
```

---

### Journey 2: Creating First Visitor QR Code

```
Start: Resident expects guest tomorrow
    ↓
┌─────────────────────────────────────────────────────┐
│ Step 1: Opens App                                   │
│ Sees empty dashboard                                │
│ Taps "Add Visitor" floating action button           │
│ Touchpoint: Mobile App                              │
│ Emotion: 😊 Motivated                               │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 2: Fills Visitor Form                         │
│ • Name: "John Doe" (text input)                     │
│ • Type: "Guest" (dropdown: Guest, Delivery, etc.)   │
│ • Validity: "Today Only" (default), changes to      │
│   "Tomorrow" by tapping date picker                 │
│ • Entries: "Single Entry" (default)                 │
│ • Notes: "Friend visiting for lunch" (optional)     │
│ Touchpoint: Mobile App                              │
│ Duration: 1 minute                                  │
│ Emotion: 😐 Focused                                 │
│ Pain Point: Unclear what "entries" means (needs     │
│             inline help tooltip)                    │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 3: Taps "Generate QR Code"                    │
│ • Loading spinner (1-2 seconds)                     │
│ • QR code appears with animation                    │
│ • Countdown timer: "Valid for 23 hours 45 min"      │
│ • Share button prominent                            │
│ Touchpoint: Mobile App                              │
│ Emotion: 😀 Delighted (QR looks professional)       │
│ Wow Moment: Instant QR generation                   │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 4: Shares QR via WhatsApp                     │
│ • Taps "Share via WhatsApp"                         │
│ • Contact picker opens                              │
│ • Selects "John Doe"                                │
│ • WhatsApp opens with QR image pre-attached         │
│ • Adds message: "Here's your access code for        │
│   tomorrow's lunch! Show this at the gate."         │
│ • Sends                                             │
│ Touchpoint: WhatsApp                                │
│ Duration: 30 seconds                                │
│ Emotion: 😀 Satisfied (easy process)                │
│ Success Metric: QR code shared                      │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 5: Next Day - Receives Notification           │
│ • Push notification: "Guest Arrived"                │
│ • "John Doe checked in at 12:35 PM"                 │
│ • Taps notification                                 │
│ Touchpoint: Push Notification                       │
│ Emotion: 😍 Delighted (knows guest arrived)         │
│ Wow Moment: Real-time notification                  │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 6: Views Entry Log                            │
│ • App opens to visitor detail                       │
│ • Shows entry photo taken by guard                  │
│ • Entry timestamp: "Nov 15, 2025 12:35 PM"          │
│ • Guard name: "Carlos M."                           │
│ Touchpoint: Mobile App                              │
│ Emotion: 😍 Impressed (transparency + photo proof)  │
│ Success Metric: Viewed entry log                    │
└─────────────────────────────────────────────────────┘

End State: Resident trusts system, will use again
```

---

### Journey 3: Uploading Payment Receipt

```
Start: Resident pays HOA fee via bank transfer
    ↓
┌─────────────────────────────────────────────────────┐
│ Step 1: Completes Bank Transfer                    │
│ • Sends $250 to HOA account                         │
│ • Takes screenshot of confirmation                  │
│ Touchpoint: Banking App                             │
│ Emotion: 😐 Task completion                         │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 2: Opens Portun App → Payments Tab            │
│ • Sees previous payments history                    │
│ • Taps "Upload Receipt" button                      │
│ Touchpoint: Mobile App                              │
│ Emotion: 😊 Motivated (wants proof on file)         │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 3: Takes Photo of Receipt                     │
│ • Chooses "Take Photo" (vs "Choose from Gallery")   │
│ • Camera opens                                      │
│ • Centers bank statement on screen                  │
│ • Taps capture button                               │
│ • Preview shows, resident taps "Use Photo"          │
│ Touchpoint: Camera                                  │
│ Duration: 30 seconds                                │
│ Emotion: 😐 Focused                                 │
│ Pain Point: Lighting might require retake           │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 4: Fills Payment Details                      │
│ • Amount: $250.00 (auto-formats with $ symbol)      │
│ • Date: Nov 14, 2025 (defaults to today)            │
│ • Reference: "Wire Transfer" (types manually)       │
│ • Notes: (leaves blank)                             │
│ Touchpoint: Mobile App                              │
│ Duration: 1 minute                                  │
│ Emotion: 😐 Focused                                 │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 5: Submits Receipt                            │
│ • Taps "Submit"                                     │
│ • Upload progress bar (2-3 seconds)                 │
│ • Success message: "Receipt submitted for           │
│   verification"                                     │
│ • Receipt appears in history with "Pending" badge   │
│ Touchpoint: Mobile App                              │
│ Emotion: 😊 Relieved (task done)                    │
│ Success Metric: Receipt uploaded                    │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 6: Waits for Verification (1-2 days later)    │
│ • Receives push notification: "Payment Verified"    │
│ • "$250 payment confirmed by admin"                 │
│ • Taps notification                                 │
│ Touchpoint: Push Notification                       │
│ Emotion: 😀 Satisfied                               │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 7: Views Updated Payment History              │
│ • Receipt status changed to "Verified ✓"            │
│ • Verified date shown                               │
│ • Can download receipt PDF for taxes                │
│ Touchpoint: Mobile App                              │
│ Emotion: 😍 Delighted (peace of mind)               │
│ Success Metric: Payment verified and recorded       │
└─────────────────────────────────────────────────────┘

End State: Resident has proof of payment, trusts process
```

---

## 2. SECURITY GUARD USER JOURNEY

### Journey: Validating Visitor at Gate

```
Start: Visitor arrives at gate with QR code on phone
    ↓
┌─────────────────────────────────────────────────────┐
│ Step 1: Guard Sees Vehicle Approach                │
│ • Visitor stops at gate                             │
│ • Rolls down window                                 │
│ • Shows phone with QR code                          │
│ Touchpoint: Physical Gate                           │
│ Emotion: 😐 Routine task                            │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 2: Opens Guard App                            │
│ • App requires biometric unlock (Face ID/Fingerprint)│
│ • Guard uses fingerprint                            │
│ • App opens directly to scanner (auto-launch)       │
│ Touchpoint: Mobile App (Guard App)                  │
│ Duration: 3 seconds                                 │
│ Emotion: 😊 Efficient (quick unlock)                │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 3: Scans QR Code                              │
│ • Camera scanner active (red laser line visible)    │
│ • Guard points at visitor's phone                   │
│ • QR scanned instantly                              │
│ • "VIS-12345-ABC" decoded                           │
│ Touchpoint: Camera Scanner                          │
│ Duration: 2 seconds                                 │
│ Emotion: 😊 Satisfied (quick scan)                  │
│ Wow Moment: Near-instant validation                 │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 4: Views Validation Result                    │
│ ┌─────────────────────────────────────────────┐   │
│ │ ✅ ACCESS GRANTED                            │   │
│ │                                              │   │
│ │ Visitor: John Doe                            │   │
│ │ Type: Guest                                  │   │
│ │ Host: Jane Smith (Unit 101)                  │   │
│ │ Entries: 0 of 1 used                         │   │
│ │ Valid until: Nov 15, 2025 11:59 PM           │   │
│ │ Notes: "Friend visiting for lunch"           │   │
│ │                                              │   │
│ │ [Take Entry Photo] ▶                         │   │
│ └─────────────────────────────────────────────┘   │
│ Touchpoint: Mobile App                              │
│ Duration: 5 seconds (reviews details)               │
│ Emotion: 😊 Confident (all info needed)             │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 5: Takes Entry Photo                          │
│ • Taps "Take Entry Photo"                           │
│ • Camera opens (facing visitor)                     │
│ • Guard says "Look at camera please"                │
│ • Taps capture button                               │
│ • Photo preview shown                               │
│ • Guard taps "Use Photo" (or retake if blurry)      │
│ Touchpoint: Camera                                  │
│ Duration: 10 seconds                                │
│ Emotion: 😐 Routine                                 │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 6: Approves Entry                             │
│ • Taps "Approve Entry" button (green, prominent)    │
│ • Photo uploads in background                       │
│ • Entry logged to database                          │
│ • Notification sent to resident                     │
│ • Optional: Gate opens automatically (Shelly relay) │
│ Touchpoint: Mobile App + Physical Gate              │
│ Duration: 3 seconds                                 │
│ Emotion: 😊 Satisfied (smooth process)              │
│ Success Metric: Entry logged, visitor proceeds      │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 7: Visitor Enters, Guard Returns to Standby   │
│ • Success screen: "Entry logged successfully"       │
│ • App returns to scanner automatically after 2 sec  │
│ • Ready for next visitor                            │
│ Touchpoint: Mobile App                              │
│ Emotion: 😀 Accomplished                            │
└─────────────────────────────────────────────────────┘

End State: Guard efficiently processed visitor, resident notified
Total Time: < 30 seconds (vs 2-3 minutes with phone call)
```

---

### Alternative Flow: Denied Access

```
Step 3: Scans QR Code
    ↓
┌─────────────────────────────────────────────────────┐
│ Step 4: Views Denial Result                        │
│ ┌─────────────────────────────────────────────┐   │
│ │ ❌ ACCESS DENIED                             │   │
│ │                                              │   │
│ │ Reason: QR Code Expired                      │   │
│ │                                              │   │
│ │ Visitor: John Doe                            │   │
│ │ Host: Jane Smith (Unit 101)                  │   │
│ │ Phone: (512) 555-1234                        │   │
│ │                                              │   │
│ │ Expired on: Nov 14, 2025 11:59 PM            │   │
│ │                                              │   │
│ │ Please contact resident for new QR code.     │   │
│ │                                              │   │
│ │ [Call Resident] [Deny Entry]                 │   │
│ └─────────────────────────────────────────────┘   │
│ Touchpoint: Mobile App                              │
│ Emotion: 😐 Need to handle (clear instructions)     │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Option A: Guard Calls Resident                     │
│ • Taps "Call Resident" button                       │
│ • Phone dialer opens with number                    │
│ • Explains situation                                │
│ • Resident creates new QR, shares with visitor      │
│ • Guard scans new QR                                │
│ Emotion: 😊 Problem solved                          │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Option B: Guard Denies Entry                       │
│ • Taps "Deny Entry" button                          │
│ • Logs denial with reason                           │
│ • Visitor turns away                                │
│ • Guard notes incident in system                    │
│ Emotion: 😐 Followed protocol                       │
└─────────────────────────────────────────────────────┘
```

---

## 3. PROPERTY ADMIN USER JOURNEY

### Journey: Verifying Pending Payments

```
Start: Admin receives email: "3 new payment receipts to verify"
    ↓
┌─────────────────────────────────────────────────────┐
│ Step 1: Opens Admin Portal on Computer             │
│ • Goes to www.portun.app/admin                      │
│ • Logs in with email + password                     │
│ • 2FA code sent to phone (SMS or authenticator)     │
│ • Enters code                                       │
│ Touchpoint: Web Browser (Desktop)                   │
│ Duration: 1 minute                                  │
│ Emotion: 😐 Routine login                           │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 2: Navigates to Payments Page                 │
│ • Dashboard shows "3 pending payments" badge        │
│ • Clicks "Payments" in sidebar                      │
│ • Pending queue loads (3 receipts)                  │
│ Touchpoint: Admin Portal                            │
│ Duration: 5 seconds                                 │
│ Emotion: 😊 Clear what needs attention              │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 3: Reviews First Receipt                      │
│ ┌─────────────────────────────────────────────┐   │
│ │ Jane Doe • Unit 101 • $250.00               │   │
│ │ Submitted: Nov 14, 2025 3:30 PM             │   │
│ │ Reference: Wire Transfer                     │   │
│ │ [View Receipt] [Verify] [Reject]             │   │
│ └─────────────────────────────────────────────┘   │
│ • Clicks "View Receipt"                             │
│ • Modal opens with enlarged image                   │
│ • Zooms in to check amount: $250.00 ✓               │
│ • Date: Nov 14, 2025 ✓                              │
│ • Bank logo visible, looks legitimate ✓             │
│ Touchpoint: Admin Portal                            │
│ Duration: 30 seconds                                │
│ Emotion: 😊 Straightforward verification            │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 4: Verifies Receipt                           │
│ • Clicks "Verify" button                            │
│ • Confirmation dialog: "Mark as verified?"          │
│ • Clicks "Yes"                                      │
│ • Success message: "Payment verified"               │
│ • Push notification sent to Jane Doe                │
│ • Receipt moves to "Verified" list                  │
│ Touchpoint: Admin Portal                            │
│ Duration: 5 seconds                                 │
│ Emotion: 😊 Productive                              │
│ Success Metric: 1 receipt verified                  │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 5: Next Receipt Auto-Loads                    │
│ • Second receipt appears automatically              │
│ • Admin repeats verification process                │
│ • All 3 receipts verified in < 3 minutes total      │
│ Touchpoint: Admin Portal                            │
│ Emotion: 😀 Efficient workflow                      │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 6: Exports Monthly Report                     │
│ • Clicks "Export CSV" button                        │
│ • Selects date range: "This Month"                  │
│ • CSV downloads instantly                           │
│ • Opens in Excel for board meeting presentation     │
│ Touchpoint: Admin Portal + Excel                    │
│ Duration: 30 seconds                                │
│ Emotion: 😍 Delighted (report generation easy)      │
│ Success Metric: Report ready for board             │
└─────────────────────────────────────────────────────┘

End State: All payments verified, report prepared
Total Time: 5 minutes (vs 30 minutes manual review)
```

---

## EMOTION JOURNEY SUMMARY

### Resident Emotional Arc
```
Initial State: 😐 Neutral (receives invitation)
    ↓
Onboarding: 😊 Curious → 😐 Learning → 😀 Ready
    ↓
First QR: 😊 Motivated → 😐 Focused → 😀 Delighted (instant QR)
    ↓
Notification: 😍 Wow Moment (real-time alert)
    ↓
Entry Log: 😍 Impressed (transparency + photo)
    ↓
Final State: 😍 Delighted, Trust Established
```

### Guard Emotional Arc
```
Initial State: 😐 Routine (visitor arrives)
    ↓
Scanner: 😊 Efficient (quick unlock)
    ↓
Validation: 😊 Confident (all info clear)
    ↓
Photo: 😐 Routine (standard process)
    ↓
Approval: 😊 Satisfied (smooth)
    ↓
Final State: 😀 Accomplished (faster than before)
```

### Admin Emotional Arc
```
Initial State: 😐 Routine (email notification)
    ↓
Login: 😐 Standard (2FA expected)
    ↓
Queue: 😊 Clear (knows what to do)
    ↓
Review: 😊 Straightforward (image clear)
    ↓
Batch: 😀 Productive (multiple verified quickly)
    ↓
Export: 😍 Delighted (report instant)
    ↓
Final State: 😍 Efficient, Time Saved
```

---

## KEY TOUCHPOINTS

| User Type | Primary Touchpoints | Critical Moments |
|-----------|---------------------|------------------|
| **Resident** | Mobile App (90%), Push Notifications (10%) | QR generation, Entry notification |
| **Guard** | Mobile App (100%), Physical Gate | QR scan result, Entry approval |
| **Admin** | Web Portal (80%), Email (20%) | Receipt review, Batch verification |

---

## PAIN POINTS & SOLUTIONS

| Pain Point | User | Solution |
|------------|------|----------|
| "I forgot to create QR in advance" | Resident | Offline QR generation |
| "QR code is too small on my phone" | Visitor | Large QR display, pinch to zoom |
| "Guard can't scan QR through windshield" | Guard | High-contrast QR, works in sunlight |
| "Visitor arrived but I got no notification" | Resident | Redundant push + SMS option |
| "Receipt photo is blurry, can't verify" | Admin | Reject with reason, prompt re-upload |
| "Too many clicks to verify receipt" | Admin | Keyboard shortcuts (V = verify) |

---

**Next Steps**: Use these flows to inform UI design, error handling, and feature prioritization.
