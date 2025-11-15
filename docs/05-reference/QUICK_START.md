# Contact Form - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- AWS account with SES service
- Supabase project set up
- Verified email addresses in AWS SES

### Deploy Now

```bash
# 1. Set AWS SES credentials in Supabase Dashboard
# Settings → Environment Variables
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1

# 2. Deploy Edge Function
supabase functions deploy send-contact-email

# 3. Test the form in browser
# Click "Get Started" on pricing card → Form scrolls with plan selected

# 4. Submit and check hello@portun.app for email
```

## 🎯 What Works Out of Box

✅ Pricing cards have "Get Started" buttons
✅ Clicking button scrolls to contact form
✅ Form has plan dropdown (pre-filled from card clicked)
✅ Form has Name, Email, Plan, Message fields
✅ Submit shows loading state
✅ Success message displays
✅ Form resets after success
✅ Email sent to hello@portun.app with customer copy (BCC)

## 📋 Form Data Sent to hello@portun.app

```
From: noreply@portun.app
Subject: New Inquiry - [Name] ([Plan] Plan)

Email contains:
- Customer name
- Customer email (reply-to)
- Selected pricing plan
- Custom message
- Auto-formatted HTML email
```

## 🔧 What You Need to Do

### 1. AWS Setup (15 min)
- [ ] Create IAM user with SES permission
- [ ] Verify `noreply@portun.app`
- [ ] Verify `hello@portun.app`
- [ ] Copy Access Key & Secret Key

### 2. Supabase Setup (5 min)
- [ ] Add AWS credentials to environment variables
- [ ] Deploy Edge Function: `supabase functions deploy send-contact-email`

### 3. Test (10 min)
- [ ] Test locally: `supabase functions serve`
- [ ] Test in browser
- [ ] Check hello@portun.app for email

## 📧 What Emails Will Look Like

```
TO: hello@portun.app
FROM: noreply@portun.app
BCC: customer@example.com (automatic)
REPLY-TO: customer@example.com
SUBJECT: New Inquiry - John Doe (Professional Plan)

BODY:
Name: John Doe
Email: john@example.com
Plan: Professional

Message:
Hi, I'm interested in learning more about your Professional plan
for our 100-unit community...
```

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| "AWS not configured" | Add AWS credentials to Supabase env vars |
| "Email not verified" | Verify addresses in AWS SES console |
| Form won't submit | Check Edge Function deployed & AWS creds |
| No email received | Check AWS SES Sandbox mode limits |

## 📚 Full Documentation

- **Setup Guide:** `CONTACT_FORM_SETUP.md`
- **Implementation:** `CONTACT_FORM_IMPLEMENTATION.md`
- **Diagrams:** `CONTACT_FLOW_DIAGRAM.md`
- **Full Guide:** `README_CONTACT_FORM.md`

## 🧪 Test Command

```bash
# With Edge Function running locally
curl -X POST http://localhost:54321/functions/v1/send-contact-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Testing the form",
    "pricingPlan": "Professional"
  }'

# Should return:
# {"success": true, "message": "Email sent successfully"}
```

## 📞 Test Form in Browser

1. Go to http://localhost:5173
2. Scroll to pricing section
3. Click any "Get Started" button
4. Form scrolls into view with plan selected
5. Fill in: Name, Email, Message
6. Click "Send Inquiry"
7. See success message
8. Check hello@portun.app for email

## 🔐 Environment Variables Needed

```bash
# In Supabase Project Settings → Environment Variables
AWS_ACCESS_KEY_ID=<your-key-from-iam>
AWS_SECRET_ACCESS_KEY=<your-secret-from-iam>
AWS_REGION=us-east-1
```

## 💡 Pro Tips

1. **Test with AWS Sandbox Mode first** - No production access needed
2. **Verify all emails before sending** - Required in Sandbox mode
3. **Monitor SES dashboard** - Track delivery, bounces, etc.
4. **Request production access** - For unlimited sending
5. **Add reCAPTCHA later** - Easy to add to Edge Function

## 📊 Next Steps (After Launching)

- [ ] Monitor email delivery in AWS SES dashboard
- [ ] Track form submissions for analytics
- [ ] Request AWS SES production access if needed
- [ ] Add form submission logging to database
- [ ] Add spam protection (reCAPTCHA)
- [ ] Customize email template/branding
- [ ] Set up email response automation

---

**That's it!** Your contact form is ready. Just add AWS credentials and deploy. 🎉
