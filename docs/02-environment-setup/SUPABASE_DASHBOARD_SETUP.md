# Supabase Dashboard - Step-by-Step Setup

## Visual Guide: Setting Up Environment Variables

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Login with your account
3. Select your **PortunWeb** project

```
┌─────────────────────────────────────────┐
│ Supabase Dashboard                      │
├─────────────────────────────────────────┤
│ Projects:                               │
│ ┌──────────────────────────────────────┐│
│ │ ✓ PortunWeb          ← Click Here   ││
│ │   postgres_project1                  ││
│ │   other_projects...                  ││
│ └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

### Step 2: Go to Project Settings

1. Click **Settings** in the left sidebar
2. Click **Environment Variables** (or **Secrets** tab, depending on your Supabase version)

```
Left Sidebar:
├── Project Settings
│   ├── General
│   ├── Database
│   ├── Authentication
│   ├── Environment Variables  ← Click Here
│   ├── Secrets (alternative)  ← Or Here
│   └── ...
```

---

### Step 3: Add First Secret - AWS_ACCESS_KEY_ID

1. Click **+ New Secret** button
2. In the **Name** field, enter:
   ```
   AWS_ACCESS_KEY_ID
   ```
3. In the **Value** field, paste:
   ```
   AKIA5RT5VNJ6NSKSPC6W
   ```
4. Click **Save**

```
┌────────────────────────────────────────┐
│ New Secret                             │
├────────────────────────────────────────┤
│ Name:                                  │
│ ┌──────────────────────────────────────┐
│ │ AWS_ACCESS_KEY_ID                   │
│ └──────────────────────────────────────┘
│                                        │
│ Value:                                 │
│ ┌──────────────────────────────────────┐
│ │ AKIA5RT5VNJ6NSKSPC6W                │
│ └──────────────────────────────────────┘
│                                        │
│ [Cancel]                  [Save]       │
└────────────────────────────────────────┘
```

---

### Step 4: Add Second Secret - AWS_SECRET_ACCESS_KEY

1. Click **+ New Secret** button again
2. In the **Name** field, enter:
   ```
   AWS_SECRET_ACCESS_KEY
   ```
3. In the **Value** field, paste:
   ```
   BJ+9wydhOgIZ3br5T8AtnvGRtLvP1fujkYk4q2M8eNqW
   ```
4. Click **Save**

```
┌────────────────────────────────────────┐
│ New Secret                             │
├────────────────────────────────────────┤
│ Name:                                  │
│ ┌──────────────────────────────────────┐
│ │ AWS_SECRET_ACCESS_KEY               │
│ └──────────────────────────────────────┘
│                                        │
│ Value:                                 │
│ ┌──────────────────────────────────────┐
│ │ BJ+9wydhOgIZ3br5T8AtnvGRtLvP1fujk..│
│ └──────────────────────────────────────┘
│                                        │
│ [Cancel]                  [Save]       │
└────────────────────────────────────────┘
```

---

### Step 5: Add Third Secret - AWS_REGION

1. Click **+ New Secret** button one more time
2. In the **Name** field, enter:
   ```
   AWS_REGION
   ```
3. In the **Value** field, enter:
   ```
   us-east-1
   ```
4. Click **Save**

```
┌────────────────────────────────────────┐
│ New Secret                             │
├────────────────────────────────────────┤
│ Name:                                  │
│ ┌──────────────────────────────────────┐
│ │ AWS_REGION                          │
│ └──────────────────────────────────────┘
│                                        │
│ Value:                                 │
│ ┌──────────────────────────────────────┐
│ │ us-east-1                           │
│ └──────────────────────────────────────┘
│                                        │
│ [Cancel]                  [Save]       │
└────────────────────────────────────────┘
```

---

### Step 6: Verify All Secrets Are Saved

After saving all three, you should see a list like this:

```
┌────────────────────────────────────────┐
│ Environment Variables / Secrets        │
├────────────────────────────────────────┤
│ ✓ AWS_ACCESS_KEY_ID                   │
│   AKIA5RT5VNJ6NSKSPC6W                │
│                                        │
│ ✓ AWS_SECRET_ACCESS_KEY               │
│   BJ+9wydhOgIZ3br5T8AtnvGRtLvP1fujk..│
│                                        │
│ ✓ AWS_REGION                          │
│   us-east-1                           │
└────────────────────────────────────────┘
```

All three should have a ✓ checkmark indicating they're saved.

---

## Step 7: Deploy Edge Function

Now that the secrets are configured, deploy the Edge Function:

### Option A: Using Supabase Dashboard

1. Go to **Functions** in the left sidebar
2. Click on **send-contact-email**
3. Click the **three-dot menu** (⋮)
4. Select **Redeploy function**

```
Left Sidebar:
├── Edge Functions
│   ├── send-contact-email  ← Click Here
│   │   ⋮ (menu)            ← Click This
│   │   ├── View logs
│   │   ├── Redeploy function  ← Click Here
│   │   └── Delete
```

### Option B: Using CLI (Faster)

```bash
# In your project terminal
supabase functions deploy send-contact-email
```

Expected output:
```
Deploying function 'send-contact-email'...
Deployed function 'send-contact-email' (abc123def456)
```

---

## Step 8: Verify Deployment

1. Go to **Functions** in left sidebar
2. Click **send-contact-email**
3. You should see a green ✓ status indicating it's deployed

```
┌────────────────────────────────────────┐
│ send-contact-email                     │
├────────────────────────────────────────┤
│ Status: ✓ Active                       │
│ Region: us-east-1                      │
│ URL: https://...send-contact-email     │
│ Created: 2025-11-14                    │
└────────────────────────────────────────┘
```

---

## Step 9: Test the Function

### Quick Test in Supabase Console

1. In the **Functions** page, click **send-contact-email**
2. Click the **"Test"** or **"Invoke"** button
3. Paste this JSON in the request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Testing the contact form",
  "pricingPlan": "Professional"
}
```

4. Click **Send**
5. You should see response:

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "0000014a-..."
}
```

### Test via Browser

1. Open http://localhost:5173
2. Scroll to pricing section
3. Click "Get Started" on any card
4. Form scrolls into view with plan selected
5. Fill in the form
6. Click "Send Inquiry"
7. Should see success message
8. Check hello@portun.app for email (check spam folder too)

---

## Troubleshooting Dashboard Setup

### Secret Not Saving

**Problem:** Secret shows error after clicking Save

**Solution:**
1. Check for typos in the name
2. Ensure no extra spaces before/after values
3. Try copying directly from this document
4. Check your browser console for errors

### Function Not Redeploying

**Problem:** Function shows "Deploying..." for too long

**Solution:**
1. Check your internet connection
2. Try using CLI instead: `supabase functions deploy send-contact-email`
3. Check Supabase status page: https://status.supabase.io
4. Refresh the page and try again

### Test Shows Error

**Problem:** Test request returns error like "AWS credentials not configured"

**Solution:**
1. Verify all three secrets are saved (with ✓)
2. Redeploy the function after saving secrets
3. Wait 30 seconds for secrets to propagate
4. Try test again

### Email Not Arriving

**Problem:** Test succeeds but no email in hello@portun.app

**Solution:**
1. Check spam/junk folder
2. Verify noreply@portun.app is verified in AWS SES
3. Check AWS SES Sandbox Mode status
4. Look at Supabase function logs for errors

---

## Verification Checklist

After completing all steps:

- [ ] AWS_ACCESS_KEY_ID secret saved
- [ ] AWS_SECRET_ACCESS_KEY secret saved
- [ ] AWS_REGION secret saved
- [ ] All three secrets show ✓ status
- [ ] Edge Function redeployed
- [ ] Edge Function shows "Active" status
- [ ] Test request succeeded with messageId
- [ ] Email arrived at hello@portun.app

---

## Quick Summary

| Step | Action | Status |
|------|--------|--------|
| 1 | Go to Supabase Dashboard | ⏳ |
| 2 | Go to Environment Variables | ⏳ |
| 3 | Add AWS_ACCESS_KEY_ID | ⏳ |
| 4 | Add AWS_SECRET_ACCESS_KEY | ⏳ |
| 5 | Add AWS_REGION | ⏳ |
| 6 | Verify all 3 secrets saved | ⏳ |
| 7 | Redeploy Edge Function | ⏳ |
| 8 | Verify function is Active | ⏳ |
| 9 | Test with curl/dashboard | ⏳ |
| 10 | Test in browser | ⏳ |

---

## You're All Set! 🎉

Once all checks are complete:

1. Your contact form is fully operational
2. Users can submit inquiries from pricing cards
3. Emails are sent to hello@portun.app
4. Everything is production-ready

**Next:** Test the form in your browser and launch!
