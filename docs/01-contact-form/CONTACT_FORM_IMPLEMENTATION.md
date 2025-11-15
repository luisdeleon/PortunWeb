# Contact Form Implementation Summary

## What Was Implemented

Your contact form is now fully integrated with AWS SES email delivery. Here's what's ready to use:

## User Flow

1. **User visits landing page**
2. **User clicks "Get Started" on any pricing card** → Page smoothly scrolls down to contact form
3. **Contact form is pre-populated** with selected pricing plan (Starter/Professional/Enterprise)
4. **User fills in:**
   - Full Name (required)
   - Email Address (required, validated)
   - Pricing Plan dropdown (required)
   - Message (required)
5. **User clicks "Send Inquiry"**
   - Loading state shown on button
   - Form submits to `/api/send-contact-email`
6. **Success message displays** confirming email will be sent to `hello@portun.app`
7. **Email is sent via AWS SES** with:
   - HTML formatted email
   - Plain text fallback
   - Reply-to set to customer's email
   - BCC sent to customer for their records

## Files Created

### 1. Supabase Edge Function
**Location:** `/supabase/functions/send-contact-email/index.ts`

- Receives form data from frontend
- Validates all required fields
- Sends email via AWS SES
- Returns success/error response
- Handles CORS properly

**Environment Variables Needed:**
- `AWS_ACCESS_KEY_ID` - AWS IAM user access key
- `AWS_SECRET_ACCESS_KEY` - AWS IAM user secret key
- `AWS_REGION` - AWS region (default: us-east-1)

### 2. Configuration Files
**Location:** `/supabase/functions/send-contact-email/deno.json`
- Deno configuration for Edge Function

## Files Modified

### 1. Contact Form Component
**Location:** `/src/views/front-pages/landing-page/contact-us.vue`

**Changes:**
- Added `pricingPlan` ref with default value 'Starter'
- Added `isLoading` and `submitted` refs for UI state
- Added `pricingPlans` array with three options
- Added `onMounted` hook to load selected plan from pricing section
- Added `submitForm` async function that:
  - Validates required fields
  - Calls `/api/send-contact-email` endpoint
  - Handles success/error states
  - Resets form after success
- Updated template to:
  - Add success alert message
  - Add pricing plan dropdown field
  - Add form validation attributes
  - Add loading state to submit button
  - Update submit handler to call `submitForm`

### 2. Pricing Component
**Location:** `/src/views/front-pages/landing-page/pricing-plans.vue`

**Changes:**
- Added `scrollToContact` function that:
  - Stores selected plan in sessionStorage
  - Smoothly scrolls to contact form
- Updated "Get Started" button `@click` to call `scrollToContact(plan.title)`

## Setup Instructions

### 1. AWS SES Setup (Required)

See `CONTACT_FORM_SETUP.md` for detailed AWS SES configuration:
1. Create IAM user with SES permissions
2. Verify email addresses (`noreply@portun.app` and `hello@portun.app`)
3. Generate access keys

### 2. Supabase Edge Function Deployment

```bash
# Install CLI
npm install -g supabase

# Link project
supabase link --project-ref <your-project-ref>

# Set environment variables
supabase functions secrets set AWS_ACCESS_KEY_ID <value>
supabase functions secrets set AWS_SECRET_ACCESS_KEY <value>
supabase functions secrets set AWS_REGION us-east-1

# Deploy function
supabase functions deploy send-contact-email
```

## Testing the Form

### Before Deployment
```bash
# Local testing
supabase functions serve

# In another terminal
curl -X POST http://localhost:54321/functions/v1/send-contact-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "pricingPlan": "Professional"
  }'
```

### After Deployment
1. Open landing page
2. Click "Get Started" on any pricing card
3. Form auto-scrolls and plan is pre-selected
4. Fill in form and submit
5. Check `hello@portun.app` for email

## Email Format

**Subject:** `New Inquiry - [Name] ([Plan] Plan)`

**Recipients:**
- **To:** hello@portun.app
- **From:** noreply@portun.app
- **Reply-To:** Customer's email
- **BCC:** Customer's email (so they get a copy)

**Content:**
- HTML formatted with customer details
- Plain text version for email clients
- Message preserved as-is
- Timestamp can be added if needed

## Security Features

✅ AWS credentials never exposed to frontend
✅ Email validation on backend
✅ CORS headers configured
✅ Rate limiting ready (can be added to Edge Function)
✅ No sensitive data logged
✅ HTTPS enforced

## Next Steps

1. **Set up AWS SES** following the setup guide
2. **Configure Supabase environment variables** with AWS credentials
3. **Deploy Edge Function** to Supabase
4. **Test form** on local and production
5. **(Optional) Add features** like reCAPTCHA, rate limiting, email templates

## Troubleshooting

See `CONTACT_FORM_SETUP.md` for detailed troubleshooting guide covering:
- AWS credential issues
- Email verification problems
- CORS errors
- SES Sandbox Mode limitations

## API Contract

### POST `/api/send-contact-email`

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "message": "string (required)",
  "pricingPlan": "Starter | Professional | Enterprise (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "string"
}
```

**Response (4xx/5xx):**
```json
{
  "error": "string",
  "details": "string"
}
```

## Form Validation

Client-side:
- All fields required
- Email validated by HTML5
- Button disabled until all fields filled

Server-side:
- All fields checked
- AWS credentials verified
- Email format validated
- AWS SES error handling

## What Happens When User Submits

```
User fills form → Clicks Submit
    ↓
Frontend validates → Shows loading state
    ↓
POST to /api/send-contact-email
    ↓
Edge Function validates input
    ↓
Initialize AWS SES client
    ↓
Format HTML & text email
    ↓
Send via AWS SES
    ↓
Return success/error response
    ↓
Frontend shows success message
    ↓
Form resets after 5 seconds
    ↓
Email arrives in hello@portun.app inbox
```

## Analytics Ready

The email includes:
- Customer name
- Customer email (for follow-up)
- Interested pricing plan (for sales insights)
- Custom message
- Timestamp (can track in SES dashboard)

This data helps you understand which plans generate the most interest!
