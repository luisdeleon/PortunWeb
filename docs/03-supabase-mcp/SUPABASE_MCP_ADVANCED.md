# Supabase MCP - Advanced Configuration

This guide covers advanced Supabase MCP configurations for specific security needs.

---

## Current Configuration

You have the **basic secure setup**:
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

This is perfectly fine for development! This section shows how to customize further.

---

## Advanced Configuration Options

### Option 1: Project-Scoped Access

Limit MCP access to only your PortunWeb project:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF"
    }
  }
}
```

**Find your PROJECT_REF:**
1. Go to Supabase Dashboard
2. Select PortunWeb project
3. Settings → Project API
4. Copy the "Project reference ID"
5. Replace `YOUR_PROJECT_REF` in URL

**Example:**
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=abcdefghijklmnop"
    }
  }
}
```

---

### Option 2: Read-Only Mode

Restrict to read-only queries (no mutations):

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?read_only=true"
    }
  }
}
```

**Benefits:**
- No accidental data deletion
- Safe for sensitive data
- Still allows queries and views
- Blocks INSERT, UPDATE, DELETE operations

---

### Option 3: Combined Security

Use both project scope and read-only mode:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF&read_only=true"
    }
  }
}
```

This is the **most secure setup** for production access.

---

### Option 4: Manual Token Authentication

If auto-auth doesn't work, use a personal access token:

1. **Create Personal Access Token:**
   - Supabase Dashboard → Settings → Access Tokens
   - Create new token (name: "Claude MCP")
   - Copy the token

2. **Add to MCP config:**
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF",
      "headers": {
        "Authorization": "Bearer YOUR_ACCESS_TOKEN"
      }
    }
  }
}
```

**Security:** Store token in environment variable instead:
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

Then set in shell:
```bash
export SUPABASE_ACCESS_TOKEN="your_token_here"
```

---

## Alternative MCP Servers

If you want different capabilities, consider these alternatives:

### @joshuarileydev/supabase-mcp-server

Install with:
```bash
claude mcp add-json "supabase" '{
  "command": "npx",
  "args": ["y", "@joshuarileydev/supabase-mcp-server"],
  "env": {
    "SUPABASE_API_KEY": "YOUR_API_KEY"
  }
}'
```

**Requires:**
- Supabase API Key (from project settings)
- Node.js installed

---

### supabase-mcp (Cappahccino)

Install with:
```bash
claude mcp add-json "supabase" '{
  "command": "npx",
  "args": ["-y", "supabase-mcp@latest"],
  "env": {
    "SUPABASE_URL": "https://your-project.supabase.co",
    "SUPABASE_ANON_KEY": "your_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "your_service_role_key",
    "MCP_API_KEY": "your_secret_api_key"
  }
}'
```

**Requires:**
- All Supabase keys from project settings
- More control over permissions

---

## Getting Supabase Project Details

To use project-scoped configurations, find:

### Project Reference ID
1. Supabase Dashboard
2. Settings → Project API
3. Copy "Project reference ID" (e.g., `abcdefghijklmnop`)

### API Keys
1. Supabase Dashboard
2. Settings → Project API
3. Copy "anon public key" or "service_role key"

### Personal Access Token
1. Supabase Dashboard
2. Settings → Access Tokens
3. Create new → Copy token

---

## Security Comparison

| Feature | Basic | Project-Scoped | Read-Only | Combined |
|---------|-------|-----------------|-----------|----------|
| Dynamic Auth | ✅ | ✅ | ✅ | ✅ |
| Limited Scope | ❌ | ✅ | ❌ | ✅ |
| Read-Only | ❌ | ❌ | ✅ | ✅ |
| Dev Safe | ✅ | ✅ | ✅ | ✅ |
| Prod Ready | ⚠️ | ✅ | ✅ | ✅ |

**Recommendation:**
- **Development:** Use Basic (current)
- **Production:** Use Combined (project-scoped + read-only)

---

## Switching Configurations

### To switch from Basic to Project-Scoped:

1. Edit `~/.claude/mcp.json`
2. Find your PROJECT_REF from Supabase
3. Replace URL with:
```
https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF
```
4. Restart Claude Code

### To enable Read-Only:

1. Edit `~/.claude/mcp.json`
2. Add `?read_only=true` to URL
3. Restart Claude Code

### To use Token Auth:

1. Create access token in Supabase
2. Add to mcp.json headers
3. Restart Claude Code

---

## Troubleshooting Advanced Setup

### "Invalid project_ref"
- Check project reference ID is correct
- Use `abcdefgh12345678` format (32 chars)
- Find at: Supabase Dashboard → Settings → Project API

### "Unauthorized" with token
- Verify token is still valid
- Token may have expiration date
- Create new token and update config

### "Project not found"
- Verify project exists
- Check you're in right Supabase organization
- Confirm project_ref matches your project

### "Connection timeout"
- Check internet connection
- Verify Supabase status: https://status.supabase.io
- Try basic config without project_ref

---

## Environment Variables Method

For secure token storage, create `~/.env`:

```bash
# ~/.env
export SUPABASE_PROJECT_REF="your_project_ref"
export SUPABASE_ACCESS_TOKEN="your_access_token"
```

Then in mcp.json:
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=${SUPABASE_PROJECT_REF}",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

Load before Claude Code:
```bash
source ~/.env
claude code
```

---

## Migration Path

If you want to upgrade from basic to advanced:

### Step 1: Current (What you have)
```json
{"url": "https://mcp.supabase.com/mcp"}
```

### Step 2: Add Project Scope
```json
{"url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF"}
```

### Step 3: Add Read-Only
```json
{"url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF&read_only=true"}
```

No downtime needed - just edit and restart Claude Code!

---

## For PortunWeb Specifically

Your ideal advanced config:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=YOUR_PORTUN_PROJECT_REF&read_only=true"
    }
  }
}
```

This:
- ✅ Limits access to PortunWeb only
- ✅ Prevents accidental changes
- ✅ Allows querying database
- ✅ Works for development
- ✅ Can work for production

---

## What Features Are Available by Configuration

### Basic Config
- ✅ Query tables
- ✅ View schema
- ✅ List Edge Functions
- ✅ Insert/Update/Delete data
- ❌ Limited project scope

### Project-Scoped
- ✅ All basic features
- ✅ Single project access
- ✅ Prevents accidental org access
- ❌ Still allows data changes

### Read-Only
- ✅ Query tables
- ✅ View schema
- ✅ List Edge Functions
- ❌ Cannot modify data (safe!)

### Combined (Recommended)
- ✅ All safe features
- ✅ Single project scope
- ✅ Data safe from changes
- ✅ Perfect for production

---

## When to Use Each Configuration

| Use Case | Config | Reason |
|----------|--------|--------|
| Local development | Basic | Quick setup, safe environment |
| Team development | Project-scoped | Prevents accidental prod access |
| Shared database | Read-only | Prevents data loss |
| Production access | Combined | Maximum safety |
| Learning MCP | Basic | Simple to understand |
| Integration testing | Read-only | Safe test queries |

---

## Monitoring & Logging

To monitor MCP usage:

1. **Check logs:**
```bash
tail -f ~/.claude/debug/* | grep supabase
```

2. **Supabase Dashboard:**
   - Settings → Logs
   - See all API requests
   - Monitor token usage

3. **Enable audit logging:**
   - Supabase Dashboard → Settings → Audit
   - Track all database changes

---

## Production Checklist

Before using MCP with production data:

- [ ] Use combined security config (project-scoped + read-only)
- [ ] Create dedicated access token
- [ ] Enable audit logging
- [ ] Set token expiration date
- [ ] Restrict to read-only operations
- [ ] Document which Claude Code instances have access
- [ ] Review Supabase logs monthly
- [ ] Rotate tokens regularly

---

## Support & Resources

**Official Docs:**
- https://supabase.com/docs/guides/getting-started/mcp

**GitHub Issues:**
- https://github.com/supabase-community/supabase-mcp/issues

**Claude Code Docs:**
- Search "MCP" at https://code.claude.com/docs

---

## Quick Commands

```bash
# View current config
cat ~/.claude/mcp.json

# Edit config
nano ~/.claude/mcp.json

# Check Supabase status
curl -s https://status.supabase.io | jq .

# Find project ref (must be logged in)
supabase projects list
```

---

## Summary

You have **basic secure setup** ready to use.

If you need advanced features later:
1. Find your project reference
2. Edit ~/.claude/mcp.json
3. Add project_ref to URL
4. Add read_only=true if needed
5. Restart Claude Code

No rush - basic setup is perfectly fine for development!

---

**Current Status:** ✅ Basic secure config installed
**When to upgrade:** Only if needed for specific security requirements
**Time to upgrade:** 5 minutes (just edit one JSON file)
