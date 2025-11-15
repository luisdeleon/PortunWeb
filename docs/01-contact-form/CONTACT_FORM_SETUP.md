# Contact Form Setup Guide

## Overview

This guide explains how to set up the contact form with AWS SES email integration on Supabase Edge Functions.

## Features

- **Get Started buttons** on pricing cards scroll to contact form
- **Pricing plan dropdown** in contact form (Starter, Professional, Enterprise)
- **Form validation** with required fields
- **AWS SES integration** to send emails to `hello@portun.app`
- **Success message** after submission
- **Email BCC** to customer's email address

## Setup Steps

### 1. AWS SES Configuration

#### Create AWS IAM User for SES

1. Go to AWS IAM Console
2. Create a new user (e.g., `portun-ses-user`)
3. Attach policy: `AmazonSESFullAccess` or create custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

4. Generate Access Key ID and Secret Access Key
5. Copy these credentials (you'll need them for Supabase)

#### Verify Email Addresses in SES

1. Go to AWS SES Console
2. Go to "Verified identities"
3. Add and verify these email addresses:
   - `noreply@portun.app` (sender email)
   - `hello@portun.app` (recipient email)
4. Follow AWS verification process (DNS or email confirmation)

### 2. Supabase Configuration

#### Set Environment Variables

In Supabase dashboard:

1. Go to Project Settings → Environment Variables
2. Add the following secrets:
   ```
   AWS_ACCESS_KEY_ID=<your-access-key-id>
   AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
   AWS_REGION=us-east-1  # or your preferred region
   ```

#### Deploy Edge Function

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. Deploy the Edge Function:
   ```bash
   supabase functions deploy send-contact-email
   ```

4. Grant permissions (if needed):
   ```bash
   supabase functions secrets set AWS_ACCESS_KEY_ID <value>
   supabase functions secrets set AWS_SECRET_ACCESS_KEY <value>
   supabase functions secrets set AWS_REGION us-east-1
   ```

### 3. Frontend Configuration

The contact form is already configured. The frontend makes a POST request to:

```
/api/send-contact-email
```

This endpoint maps to your Supabase Edge Function.

## API Endpoint

### Request

**POST** `/api/send-contact-email`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in learning more about Portun.app",
  "pricingPlan": "Professional"
}
```

### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "0000014a-1234-5678-9999-aaaabbbbcccc"
}
```

**Error (400/500):**
```json
{
  "error": "Failed to send email",
  "details": "Invalid email address"
}
```

## Testing

### Local Testing

1. Set environment variables locally:
   ```bash
   export AWS_ACCESS_KEY_ID=<your-key>
   export AWS_SECRET_ACCESS_KEY=<your-secret>
   export AWS_REGION=us-east-1
   ```

2. Test Edge Function locally:
   ```bash
   supabase functions serve
   ```

3. Make a test request:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/send-contact-email \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "message": "Test message",
       "pricingPlan": "Starter"
     }'
   ```

### Production Testing

1. Visit the landing page
2. Click "Get Started" on any pricing card
3. Form auto-scrolls to contact section
4. Fill in the form
5. Click "Send Inquiry"
6. Should see success message
7. Email should arrive at `hello@portun.app`

## Frontend Files Modified

- `/src/views/front-pages/landing-page/contact-us.vue` - Enhanced with plan dropdown and email submission
- `/src/views/front-pages/landing-page/pricing-plans.vue` - Updated Get Started buttons to scroll to contact form

## Email Features

- **To:** `hello@portun.app`
- **From:** `noreply@portun.app`
- **Reply-To:** Customer's email
- **BCC:** Automatically sent to customer's email as reference
- **Format:** HTML + Plain text
- **Subject:** `New Inquiry - [Name] ([Plan] Plan)`

## Troubleshooting

### "AWS credentials not configured" error

- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set in Supabase
- Check they're not in quotes

### "Email not verified" error

- Ensure `noreply@portun.app` and `hello@portun.app` are verified in AWS SES
- Check region is correct

### "Invalid email" error

- Verify customer email format is valid
- Check for no typos in email field

### CORS errors

- Edge Function has CORS headers configured
- Check browser console for specific errors

## AWS SES Sandbox Mode

By default, new AWS SES accounts are in **Sandbox Mode** with limitations:
- Can only send to verified email addresses
- Daily sending limit: 200 emails
- Max send rate: 1 email/second

To increase limits, request production access from AWS SES console.

## Security Considerations

- AWS credentials stored securely in Supabase environment variables
- Credentials never exposed to frontend
- Email validation on backend
- CORS configured to prevent unauthorized access
- No sensitive data logged in Edge Function

## Future Enhancements

- Add spam protection (reCAPTCHA)
- Rate limiting per IP
- Email templates with more styling
- Attachment support
- Webhook notifications
- Email delivery tracking
