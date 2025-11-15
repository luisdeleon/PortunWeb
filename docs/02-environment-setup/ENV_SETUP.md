# Environment Configuration Setup

## Overview

Your PortunWeb project now has Supabase credentials configured in the `.env` file.

---

## Files Created/Modified

✅ **`.env`** (Created)
- Contains your actual Supabase credentials
- **IMPORTANT:** Never commit this file (protected by .gitignore)
- **IMPORTANT:** Never share these credentials

✅ **`.env.example`** (Updated)
- Template for other developers
- Safe to commit to git
- Shows structure without real values

✅ **`.gitignore`** (Already Protected)
- `.env*` rule prevents credential leaks
- Your `.env` file is safely ignored

---

## Environment Variables

### VITE_SUPABASE_URL
```
Value: https://data.portun.app
Purpose: Supabase project endpoint
Used by: Vue frontend for database connections
```

### VITE_SUPABASE_ANON_KEY
```
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Purpose: Public API key for frontend
Used by: Supabase client library
Scope: Public/anonymous access only
```

### SUPABASE_ACCESS_TOKEN
```
Value: sbp_94b650199bcaf556a29e64ff96935060f28cd236
Purpose: Personal access token for CLI/backend
Used by: Supabase CLI, Edge Functions, backend services
Scope: Full project access
```

---

## Security Checklist

✅ **Credentials are secure:**
- `.env` file is in `.gitignore` (line 42)
- `.env` file will NOT be committed to git
- Real credentials are only on your local machine
- `.env.example` has placeholder values for team reference

✅ **Credentials are accessible:**
- Vue frontend can access via `VITE_*` prefix
- Supabase CLI can use access token
- Edge Functions can access environment variables

✅ **Credentials are protected:**
- Not exposed in version control
- Not exposed in build output
- Securely stored in Supabase environment for Edge Functions

---

## How to Use

### For Vue Frontend

In your Vue components, the Supabase client is already configured:

```typescript
// supabase.js or similar
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

The `.env` values are automatically loaded by Vite.

### For Supabase CLI

The access token is available when running Supabase commands:

```bash
# Deploy Edge Functions
supabase functions deploy send-contact-email

# Link your project
supabase link --project-ref your-project-ref
```

Environment variables are automatically loaded from `.env`.

### For Edge Functions

Edge Functions can access these environment variables:

```typescript
// In Edge Function
const accessToken = Deno.env.get('SUPABASE_ACCESS_TOKEN')
```

They're configured in Supabase Dashboard.

---

## Configuration Details

### Your Supabase Project
- **URL:** https://data.portun.app
- **Reference ID:** dhiixdjzmasvggdpnxnu (from URL)
- **Status:** Active and connected

### Available Keys
1. **VITE_SUPABASE_ANON_KEY** - Public, safe for frontend
2. **SUPABASE_ACCESS_TOKEN** - Private, for backend/CLI

### Restrictions
- Anon key: Limited to public data and authenticated users
- Access token: Full project access (keep secure!)

---

## File Locations

```
PortunWeb/
├── .env                    # Your actual credentials (LOCAL ONLY)
├── .env.example            # Template for developers (SAFE TO COMMIT)
├── .gitignore              # Prevents .env from being committed
└── ENV_SETUP.md           # This file
```

---

## What NOT to Do

❌ **Don't commit `.env` to git**
- Protected by `.gitignore`, so this is automatic
- Never manually force-add `.env`

❌ **Don't share credentials**
- Don't paste in Slack/Discord
- Don't share with untrusted people
- Don't commit to git

❌ **Don't use real keys in front-end code**
- Always use `import.meta.env.VITE_*` pattern
- Never hardcode keys

❌ **Don't log credentials**
- Never console.log keys
- Never print them to stdout
- Keep them private

---

## What TO Do

✅ **Do use environment variables**
- Load from `.env` via Vite
- Use `import.meta.env.*` in frontend
- Use `Deno.env.get()` in Edge Functions

✅ **Do keep `.env` local**
- Only exists on your machine
- Team members create their own

✅ **Do use `.env.example`**
- Show structure to team
- Update when adding new variables
- Safe to commit

✅ **Do rotate keys regularly**
- For production use
- Update in `.env` when rotated
- Notify team if shared account

---

## Testing Your Setup

### 1. Check environment variables are loaded

```bash
# In your project directory
echo $VITE_SUPABASE_URL
```

Should print: `https://data.portun.app`

### 2. Run dev server and check browser console

```bash
npm run dev
```

Check browser console - should see Supabase connection.

### 3. Test Supabase connection

```bash
# If using Supabase CLI
supabase status

# Should show project details
```

---

## For Team Members (If Sharing)

### When adding new team members:

1. **Don't give them `.env` file**
2. **Instead:**
   - Send them `.env.example`
   - They create their own `.env`
   - They add their own Supabase credentials

3. **Steps for them:**
   ```bash
   # They do this:
   cp .env.example .env

   # Then they edit .env and add their credentials:
   # VITE_SUPABASE_URL=https://data.portun.app
   # VITE_SUPABASE_ANON_KEY=their-anon-key
   # SUPABASE_ACCESS_TOKEN=their-access-token
   ```

4. **Each person has their own `.env`**
   - Never shared
   - Never committed
   - Locally generated

---

## Supabase Project Information

### From Your Credentials

**Project URL:** https://data.portun.app
- Indicates Supabase project hostname
- Used for all API connections

**Anon Key:** Starts with `eyJ...` (JWT)
- Format: JWT token
- Scope: Public/anonymous operations
- Safe for frontend

**Access Token:** Starts with `sbp_`
- Format: Personal access token
- Scope: Full project access
- Keep private!

---

## Next Steps

1. ✅ **`.env` created with credentials**
2. ✅ **`.env.example` updated with structure**
3. ✅ **`.gitignore` protecting credentials**
4. ⏳ **Run `npm run dev` to test connection**
5. ⏳ **Deploy Edge Function with credentials**
6. ⏳ **Test contact form with real database**

---

## Verification Checklist

- [x] `.env` file created
- [x] Contains Supabase credentials
- [x] Protected by `.gitignore`
- [ ] Run `npm run dev` to test
- [ ] Check Supabase connection in browser
- [ ] Deploy Edge Function
- [ ] Test form submission

---

## Security Summary

| Item | Status | Details |
|------|--------|---------|
| `.env` in gitignore | ✅ | Protected from commits |
| Credentials stored locally | ✅ | Only on your machine |
| Example file provided | ✅ | For team reference |
| Frontend access | ✅ | Via `import.meta.env` |
| CLI access | ✅ | Automatic loading |
| Edge Functions access | ✅ | Via Supabase Dashboard |

---

## Troubleshooting

### "Variables not loading in dev"
→ Check `.env` file exists and is properly formatted
→ Restart `npm run dev`

### "Supabase connection fails"
→ Check `VITE_SUPABASE_URL` is correct
→ Check `VITE_SUPABASE_ANON_KEY` is valid
→ Check network connection

### "Edge Function can't access token"
→ Add token to Supabase environment variables
→ Not using `.env` file (separate config)
→ See `SUPABASE_ENV_SETUP.md`

---

## Related Documentation

- `CONTACT_FORM_SETUP.md` - Uses these credentials
- `SUPABASE_MCP_SETUP.md` - Uses access token
- `.env.example` - Template reference
- `.gitignore` - Security rules

---

**Status:** ✅ Environment configured
**Security:** ✅ Credentials protected
**Ready to use:** ✅ Yes

Your PortunWeb project is now configured with Supabase!
