# Contact Form Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    Landing Page Visitor                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
            ┌────────────────────────┐
            │   Pricing Section      │
            │  (3 Plan Cards)        │
            │  - Starter             │
            │  - Professional        │
            │  - Enterprise          │
            └──────────┬─────────────┘
                       │
                       ↓ Click "Get Started"
                       │
    ┌──────────────────────────────────────────────┐
    │  1. Store selected plan in sessionStorage    │
    │  2. Smooth scroll to Contact Form            │
    └──────────────────────┬───────────────────────┘
                          │
                          ↓
         ┌────────────────────────────────┐
         │  Contact Form Section          │
         │  ✓ Plan pre-selected           │
         │  ✓ Ready for input             │
         └──────────────┬──────────────────┘
                        │
                        ↓
         ┌────────────────────────────────┐
         │  User Fills Form:              │
         │  - Full Name                   │
         │  - Email                       │
         │  - Pricing Plan ↓              │
         │  - Message                     │
         └──────────────┬──────────────────┘
                        │
                        ↓
         ┌────────────────────────────────┐
         │  Click "Send Inquiry"          │
         │  Button shows loading state    │
         └──────────────┬──────────────────┘
                        │
                        ↓ POST to /api/send-contact-email
                        │
                        ↓
        ┌────────────────────────────────────────┐
        │   Supabase Edge Function               │
        │                                        │
        │  1. Validate all fields                │
        │  2. Check AWS credentials              │
        │  3. Create AWS SES client              │
        │  4. Format email (HTML + Text)         │
        │  5. Send email                         │
        │  6. Return response                    │
        └──────────────┬─────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ↓ Success (200)               ↓ Error (4xx/5xx)
        │                             │
    ┌─────────────┐           ┌──────────────┐
    │   AWS SES   │           │  Error Log   │
    │             │           │              │
    │ Send Email  │           │  Console     │
    └────┬────────┘           └──────────────┘
         │
         ↓
    ┌──────────────────────────────────┐
    │   Email Delivered                │
    │                                  │
    │  To: hello@portun.app            │
    │  From: noreply@portun.app        │
    │  Reply-To: customer@example.com  │
    │  BCC: customer@example.com       │
    └──────────────────────────────────┘
         │
         ↓
    Frontend Response
    │
    ├─→ Show Success Alert
    ├─→ Reset Form
    ├─→ Auto-hide alert after 5 seconds
    │
    └─→ Ready for next submission
```

## Component Communication

```
┌──────────────────────────────────────────────────────────────┐
│                    Landing Page                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Pricing Plans Component                               │ │
│  │  ┌────────┬────────────┬──────────┐                   │ │
│  │  │ Starter│Professional│Enterprise│                   │ │
│  │  ├────────┼────────────┼──────────┤                   │ │
│  │  │ Get Started buttons trigger scrollToContact()      │ │
│  │  │ sessionStorage.setItem('selectedPricingPlan', ...) │ │
│  │  └────────────────────────────────────────────────────┘ │
│  │                     │                                     │
│  │                     ↓ smooth scroll                       │
│  └──────────────────────────────────────────────────────────┘
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Contact Us Component                                  │ │
│  │                                                        │ │
│  │  onMounted():                                          │ │
│  │  - Get selected plan from sessionStorage              │ │
│  │  - Set pricingPlan ref                                │ │
│  │                                                        │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │  Form Elements                                  │  │ │
│  │  │  ✓ Name (AppTextField)                         │  │ │
│  │  │  ✓ Email (AppTextField)                        │  │ │
│  │  │  ✓ Plan (AppSelect) ← pre-filled              │  │ │
│  │  │  ✓ Message (AppTextarea)                       │  │ │
│  │  │  ✓ Submit Button                               │  │ │
│  │  └──────────────┬──────────────────────────────────┘  │ │
│  │                 │                                      │ │
│  │                 ↓ submitForm()                         │ │
│  │                 │                                      │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  1. Validate fields                              │  │ │
│  │  │  2. Set isLoading = true                         │  │ │
│  │  │  3. POST to /api/send-contact-email              │  │ │
│  │  │  4. Handle response                              │  │ │
│  │  │  5. Show success/error message                   │  │ │
│  │  │  6. Reset form                                   │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                          │
                          ↓ HTTP POST
                          │
┌──────────────────────────────────────────────────────────────┐
│                 Supabase (Backend)                           │
│                                                              │
│  Edge Function: send-contact-email                          │
│                                                              │
│  Request Body:                                              │
│  {                                                          │
│    "name": "John Doe",                                      │
│    "email": "john@example.com",                             │
│    "message": "...",                                        │
│    "pricingPlan": "Professional"                            │
│  }                                                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Processing                                          │  │
│  │  1. Validate input fields                            │  │
│  │  2. Read AWS credentials from env vars              │  │
│  │  3. Initialize SESClient                             │  │
│  │  4. Create email content (HTML + Text)              │  │
│  │  5. Send via SES                                     │  │
│  │  6. Return success or error                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                          │
                          ↓ HTTP Response
                          │
              ┌───────────────────────┐
              │ Frontend receives     │
              │ success/error         │
              │                       │
              │ Updates UI state      │
              │ Shows alert message   │
              │ Resets form           │
              └───────────────────────┘
                          │
                          ↓
                   ┌────────────────┐
                   │  AWS SES sends │
                   │  email to      │
                   │  hello@portun..│
                   └────────────────┘
```

## Data Flow

```
User Input
    ↓
Frontend Validation
├─ Required fields check
├─ Email format check
└─ Min/max length check
    ↓
HTTP Request (JSON)
{
  name: "John Doe",
  email: "john@example.com",
  message: "Interested in learning more",
  pricingPlan: "Professional"
}
    ↓
Supabase Edge Function
├─ Receive request
├─ Validate all fields
├─ Load AWS credentials from env vars
├─ Initialize AWS SES client
└─ Create email
    ↓
AWS SES
├─ Authenticate request
├─ Format email
├─ Queue for delivery
└─ Send to recipient(s)
    ↓
Email Delivery
├─ To: hello@portun.app (primary inbox)
├─ From: noreply@portun.app (verified sender)
├─ Reply-To: john@example.com (customer can reply)
└─ BCC: john@example.com (customer gets copy)
```

## State Management

```
Contact Form Component State:

┌────────────────────────────────────────────┐
│  Reactive References (ref)                 │
├────────────────────────────────────────────┤
│ name: ref('') ← User enters Full Name     │
│ email: ref('') ← User enters Email        │
│ message: ref('') ← User enters Message    │
│ pricingPlan: ref('Starter') ← From price  │
│ isLoading: ref(false) ← During submit     │
│ submitted: ref(false) ← After success     │
└────────────────────────────────────────────┘

Lifecycle:

1. Component Mounted
   └─ Load plan from sessionStorage
      └─ Update pricingPlan ref

2. User Interacting
   ├─ name, email, message updated via v-model
   └─ pricingPlan updated via AppSelect

3. Form Submitted
   ├─ isLoading = true (disable button, show spinner)
   ├─ POST request sent
   ├─ Wait for response
   └─ Handle response
      ├─ Success: submitted = true, reset form, hide message after 5s
      └─ Error: log error, show error feedback

4. Form Reset
   ├─ name = ''
   ├─ email = ''
   ├─ message = ''
   ├─ pricingPlan = 'Starter'
   ├─ isLoading = false
   └─ submitted = false
```

## API Contract

```
REQUEST
═══════════════════════════════════════════════════════════════

Method: POST
Endpoint: /api/send-contact-email
Headers:
  Content-Type: application/json

Body:
{
  "name": "string (required, 1-100 chars)",
  "email": "string (required, valid email)",
  "message": "string (required, 1-5000 chars)",
  "pricingPlan": "Starter|Professional|Enterprise (required)"
}


RESPONSE - SUCCESS (200 OK)
═══════════════════════════════════════════════════════════════

{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "0000014a-1234-5678-9999-aaaabbbbcccc"
}


RESPONSE - CLIENT ERROR (400 Bad Request)
═══════════════════════════════════════════════════════════════

{
  "error": "Missing required fields",
  "details": "name, email, message, pricingPlan required"
}


RESPONSE - SERVER ERROR (500 Internal Server Error)
═══════════════════════════════════════════════════════════════

{
  "error": "Failed to send email",
  "details": "Email address not verified in SES"
}
```

## Pricing Plan Selection Flow

```
User on Landing Page
    ↓
Views Pricing Cards:
├─ Starter (10-50 units)
├─ Professional (51-200 units)
└─ Enterprise (201+ units)
    ↓
Clicks "Get Started" on one card
    ↓
scrollToContact(plan.title) executed
├─ sessionStorage.setItem('selectedPricingPlan', 'Professional')
├─ contactElement = document.getElementById('contact-us')
├─ contactElement.scrollIntoView({ behavior: 'smooth' })
└─ Page smoothly scrolls to #contact-us section
    ↓
Contact Form onMounted hook runs
├─ selectedPlan = sessionStorage.getItem('selectedPricingPlan')
├─ pricingPlan.value = 'Professional'
├─ sessionStorage.removeItem('selectedPricingPlan')
└─ Form displays with plan pre-selected
    ↓
User sees dropdown with "Professional" already selected
    ↓
User can change plan if desired or keep selection
```

## Email Composition

```
┌─────────────────────────────────────────────────────────────┐
│                    EMAIL STRUCTURE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  From: noreply@portun.app                                  │
│  To: hello@portun.app                                      │
│  BCC: customer@example.com                                 │
│  Reply-To: customer@example.com                            │
│  Subject: New Inquiry - John Doe (Professional Plan)       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ MIME-Version: 1.0                                   │   │
│  │ Content-Type: multipart/alternative                 │   │
│  │                                                     │   │
│  │ Part 1: HTML Version                               │   │
│  │ ──────────────────────────                         │   │
│  │ <html>                                              │   │
│  │  <h2>New Contact Form Submission</h2>              │   │
│  │                                                     │   │
│  │  <div style="background-color: #f8f9fa;">          │   │
│  │   <p><strong>Name:</strong> John Doe</p>           │   │
│  │   <p><strong>Email:</strong> john@ex.com</p>       │   │
│  │   <p><strong>Plan:</strong> Professional</p>       │   │
│  │  </div>                                             │   │
│  │                                                     │   │
│  │  <h3>Message:</h3>                                 │   │
│  │  <p>I'm interested in learning more about...</p>   │   │
│  │ </html>                                             │   │
│  │                                                     │   │
│  │ Part 2: Plain Text Version                         │   │
│  │ ──────────────────────────                         │   │
│  │ New Contact Form Submission                        │   │
│  │                                                     │   │
│  │ Name: John Doe                                      │   │
│  │ Email: john@example.com                            │   │
│  │ Plan: Professional                                 │   │
│  │                                                     │   │
│  │ Message:                                            │   │
│  │ I'm interested in learning more about...           │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
