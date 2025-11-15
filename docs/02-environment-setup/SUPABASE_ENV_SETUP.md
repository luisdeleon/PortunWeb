# Supabase Environment Variables Setup

## Your AWS SES Credentials

**IAM User:** `ses-smtp-user.20251101-205712`
**Region:** `us-east-1`
**AWS Access Key ID:** `AKIA5RT5VNJ6NSKSPC6W`
**AWS Secret Access Key:** `BJ+9wydhOgIZ3br5T8AtnvGRtLvP1fujkYk4q2M8eNqW`

---

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to **Supabase Dashboard**
2. Select your **PortunWeb project**
3. Go to **Project Settings** → **Environment Variables** (or **Secrets** tab)
4. Click **Add New Secret** and enter these values:

#### Secret 1:
```
Name: AWS_ACCESS_KEY_ID
Value: AKIA5RT5VNJ6NSKSPC6W
```

#### Secret 2:
```
Name: AWS_SECRET_ACCESS_KEY
Value: BJ+9wydhOgIZ3br5T8AtnvGRtLvP1fujkYk4q2M8eNqW
```

#### Secret 3:
```
Name: AWS_REGION
Value: us-east-1
```

5. Click **Save** for each secret
6. Redeploy the Edge Function:
   ```bash
   supabase functions deploy send-contact-email
   ```

### Option 2: Using Supabase CLI

```bash
# Set the credentials
supabase secrets set AWS_ACCESS_KEY_ID=AKIA5RT5VNJ6NSKSPC6W
supabase secrets set AWS_SECRET_ACCESS_KEY=BJ+9wydhOgIZ3br5T8AtnvGRtLvP1fujkYk4q2M8eNqW
supabase secrets set AWS_REGION=us-east-1

# Deploy the function
supabase functions deploy send-contact-email
```

---

## Verification Checklist

After setting up the credentials, verify everything is configured:

- [ ] All three environment variables are set in Supabase
- [ ] Environment variables are not exposing secrets in the dashboard
- [ ] Edge Function has been redeployed
- [ ] No errors appear in Supabase logs

---

## Testing

Once credentials are set, test the Edge Function:

```bash
# Option 1: Local testing
supabase functions serve

# Option 2: Test with curl (local)
curl -X POST http://localhost:54321/functions/v1/send-contact-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Testing AWS SES setup",
    "pricingPlan": "Professional"
  }'

# Expected response:
# {"success": true, "message": "Email sent successfully", "messageId": "..."}
```

---

## What Happens Next

1. **AWS SES sends email** from `noreply@portun.app`
2. **Email arrives** at `hello@portun.app`
3. **Customer receives BCC** at their email address
4. **Success message** shows in browser

---

## Security Note

⚠️ **Important:** These credentials are sensitive!
- Never commit them to git
- Never expose them in frontend code (they're secure in Supabase)
- They're stored as encrypted secrets in Supabase
- Only the Edge Function can access them

---

## Troubleshooting

### Credentials not working
- Verify the exact values are copied (no extra spaces)
- Check AWS SES is enabled in us-east-1 region
- Ensure IAM user has SES permissions

### Email not sending
- Check Supabase logs for errors
- Verify noreply@portun.app is verified in AWS SES
- Check AWS SES Sandbox Mode limits

### Deploy issues
- Ensure Supabase CLI is linked: `supabase link --project-ref <ref>`
- Try redeploying: `supabase functions deploy send-contact-email`

---

**Setup Status:** Ready to configure
**Next Step:** Add secrets to Supabase and redeploy
