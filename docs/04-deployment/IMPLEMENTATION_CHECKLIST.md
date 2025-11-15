# Implementation Checklist

## ✅ What's Already Done

### Frontend (Vue Components)

- [x] **Contact Form (`contact-us.vue`)**
  - [x] Added pricing plan dropdown (Starter, Professional, Enterprise)
  - [x] Form fields: Name, Email, Plan, Message
  - [x] Submit handler that posts to `/api/send-contact-email`
  - [x] Loading state on submit button
  - [x] Success alert message
  - [x] Form validation (all fields required)
  - [x] Auto-reset after submission
  - [x] OnMounted hook to load selected plan from sessionStorage

- [x] **Pricing Component (`pricing-plans.vue`)**
  - [x] "Get Started" buttons call `scrollToContact(plan.title)`
  - [x] Stores selected plan in sessionStorage
  - [x] Smooth scroll to #contact-us section

### Backend (Supabase Edge Function)

- [x] **`/supabase/functions/send-contact-email/index.ts`**
  - [x] Deno/TypeScript implementation
  - [x] AWS SES integration
  - [x] Request validation (POST only, required fields)
  - [x] Email formatting (HTML + Plain text)
  - [x] Email sending logic
  - [x] Success/error response handling
  - [x] CORS headers
  - [x] Environment variable management

- [x] **Configuration (`deno.json`)**
  - [x] Dependencies configured

### Documentation

- [x] `QUICK_START.md` - Quick reference guide
- [x] `CONTACT_FORM_SETUP.md` - Complete setup instructions
- [x] `CONTACT_FORM_IMPLEMENTATION.md` - Implementation details
- [x] `CONTACT_FLOW_DIAGRAM.md` - Visual diagrams
- [x] `README_CONTACT_FORM.md` - Full documentation

## 🔧 What You Need to Do (Setup)

### Phase 1: AWS Configuration (Do First)

- [ ] **Create AWS Account** (if not already done)
  - Visit: https://aws.amazon.com

- [ ] **Create IAM User for SES**
  - Go to AWS IAM Console
  - Create user: `portun-ses-user`
  - Attach policy: `AmazonSESFullAccess`
  - Generate Access Key ID & Secret Access Key
  - **SAVE THESE - YOU'LL NEED THEM**

- [ ] **Verify Email Addresses in AWS SES**
  - Go to AWS SES Console
  - Verify: `noreply@portun.app`
  - Verify: `hello@portun.app`
  - Follow verification process (DNS or email confirmation)

**Time Estimate:** 15-30 minutes

### Phase 2: Supabase Configuration (Do Second)

- [ ] **Set Environment Variables in Supabase**
  - Go to Supabase Dashboard
  - Project Settings → Environment Variables
  - Add:
    ```
    AWS_ACCESS_KEY_ID = <from IAM>
    AWS_SECRET_ACCESS_KEY = <from IAM>
    AWS_REGION = us-east-1
    ```

- [ ] **Install Supabase CLI** (if not installed)
  ```bash
  npm install -g supabase
  ```

- [ ] **Link Supabase Project**
  ```bash
  supabase link --project-ref <your-project-ref>
  ```

**Time Estimate:** 5 minutes

### Phase 3: Deploy Edge Function (Do Third)

- [ ] **Deploy the Edge Function**
  ```bash
  supabase functions deploy send-contact-email
  ```

- [ ] **Verify Deployment**
  - Check Supabase Dashboard → Edge Functions
  - Should see `send-contact-email` function

**Time Estimate:** 2-3 minutes

### Phase 4: Local Testing (Do Fourth)

- [ ] **Test Edge Function Locally**
  ```bash
  supabase functions serve
  ```

- [ ] **Make Test Request**
  ```bash
  curl -X POST http://localhost:54321/functions/v1/send-contact-email \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "message": "Test message",
      "pricingPlan": "Professional"
    }'
  ```

- [ ] **Verify Response**
  - Should return: `{"success": true, "message": "Email sent successfully"}`

**Time Estimate:** 5-10 minutes

### Phase 5: Browser Testing (Do Fifth)

- [ ] **Start Dev Server**
  ```bash
  npm run dev
  ```

- [ ] **Test Form Flow**
  - Open http://localhost:5173
  - Scroll to pricing section
  - Click "Get Started" on any card
  - Verify form auto-scrolls
  - Verify plan is pre-selected in dropdown
  - Fill in Name, Email, Message
  - Click "Send Inquiry"
  - Verify button shows loading state
  - Verify success message appears
  - Verify form resets

- [ ] **Check Email Delivery**
  - Check `hello@portun.app` inbox
  - Should have email with subject: "New Inquiry - [Name] ([Plan] Plan)"
  - Should contain customer details and message
  - Customer should receive BCC copy

**Time Estimate:** 10-15 minutes

### Phase 6: Production Deployment (Do Last)

- [ ] **Ensure All Tests Pass**
  - Local Edge Function test passed
  - Browser form submission test passed
  - Email delivery confirmed

- [ ] **Deploy Frontend Changes**
  - Your frontend changes are already in place
  - Deploy to your hosting (Vercel)

- [ ] **Monitor First Week**
  - Check AWS SES dashboard for delivery metrics
  - Monitor hello@portun.app for incoming inquiries
  - Verify email formatting and content

## 📋 Testing Checklist

### Form Functionality
- [ ] Page loads without errors
- [ ] Pricing cards display correctly
- [ ] "Get Started" buttons appear on all cards
- [ ] Clicking "Get Started" scrolls to form
- [ ] Form appears in viewport
- [ ] Plan dropdown is pre-filled
- [ ] All form fields are visible

### Form Submission
- [ ] Name field accepts input
- [ ] Email field validates email format
- [ ] Plan dropdown shows three options
- [ ] Message field accepts multi-line text
- [ ] Submit button is enabled when all fields filled
- [ ] Submit button shows loading state during submission
- [ ] Success message appears after submission
- [ ] Form fields reset after success
- [ ] Success message disappears after 5 seconds

### Email Delivery
- [ ] Email arrives at hello@portun.app
- [ ] Email subject contains name and plan
- [ ] Email contains customer details
- [ ] Email is formatted (HTML + plain text)
- [ ] Customer receives BCC copy
- [ ] Reply-To is set to customer's email
- [ ] Email is within reasonable time (< 5 seconds)

### Error Handling
- [ ] Submitting empty form shows validation message
- [ ] Invalid email shows error
- [ ] AWS credential errors handled gracefully
- [ ] Network errors show user-friendly message
- [ ] Edge Function errors don't crash frontend

### Responsive Design
- [ ] Form works on mobile (< 600px)
- [ ] Form works on tablet (600px - 900px)
- [ ] Form works on desktop (> 900px)
- [ ] Pricing cards stack correctly on mobile
- [ ] Form fields are accessible

### Security
- [ ] AWS credentials not exposed in frontend code
- [ ] AWS credentials not logged to console
- [ ] CORS headers are correct
- [ ] Form data is POSTed (not sent in URL)
- [ ] Email addresses are validated

## 🚨 Troubleshooting During Setup

| Issue | Solution | Docs |
|-------|----------|------|
| AWS credentials not working | Verify Access Key and Secret Key are correct | CONTACT_FORM_SETUP.md |
| Email not verified error | Check AWS SES console, ensure emails are verified | CONTACT_FORM_SETUP.md |
| Edge Function 404 | Ensure function is deployed: `supabase functions deploy` | CONTACT_FORM_SETUP.md |
| CORS error in browser | Check Edge Function has CORS headers | CONTACT_FORM_SETUP.md |
| Form not scrolling | Verify scrollToContact() is called | pricing-plans.vue |
| Plan not pre-filling | Check sessionStorage is being used | contact-us.vue |

## 📞 When You're Stuck

1. **Check:** `CONTACT_FORM_SETUP.md` - Troubleshooting section
2. **Look at:** AWS SES Dashboard - Check delivery status
3. **Test with:** curl command - Verify Edge Function works
4. **Review:** Browser console - Check for JavaScript errors
5. **Verify:** Supabase dashboard - Confirm function is deployed

## 🎯 Success Criteria

When everything is working correctly:

✅ User clicks "Get Started" on pricing card
✅ Form scrolls into view with plan pre-selected
✅ User fills in all form fields
✅ User clicks "Send Inquiry"
✅ Button shows loading state (2-3 seconds)
✅ Success message appears
✅ Form resets
✅ Email arrives at hello@portun.app within 5 seconds
✅ Email contains all customer information
✅ Email is properly formatted and readable
✅ User receives BCC copy at their email
✅ No errors in browser console
✅ No errors in Supabase logs

## 📊 Timeline

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | AWS SES Setup | 15-30 min | ⏳ To Do |
| 2 | Supabase Config | 5 min | ⏳ To Do |
| 3 | Deploy Function | 5 min | ⏳ To Do |
| 4 | Local Testing | 10 min | ⏳ To Do |
| 5 | Browser Testing | 10 min | ⏳ To Do |
| 6 | Production Deploy | 10 min | ⏳ To Do |
| | **TOTAL** | **~60 min** | ⏳ |

## 📝 Notes Section

Use this space to track your progress:

```
AWS Setup:
- [ ] IAM user created
- [ ] Access keys generated
- [ ] noreply@portun.app verified (Date: ___)
- [ ] hello@portun.app verified (Date: ___)

Supabase:
- [ ] Environment variables set (Date: ___)
- [ ] Edge Function deployed (Date: ___)

Testing:
- [ ] Local curl test passed (Date: ___)
- [ ] Browser test passed (Date: ___)
- [ ] Email received (Date: ___)
- [ ] Production deployed (Date: ___)
```

## ✅ Final Sign-Off

When complete, confirm:

- [ ] All setup steps completed
- [ ] All tests passing
- [ ] Form working in production
- [ ] Emails being delivered
- [ ] No outstanding issues

**Ready to go live!** 🚀

---

**Start with Phase 1 (AWS Configuration) first. Follow the phases in order for best results.**
