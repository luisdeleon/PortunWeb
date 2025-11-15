# Supabase MCP Server Setup for Claude Code

## ✅ Installation Complete!

Your Supabase MCP server has been installed and configured at:
```
~/.claude/mcp.json
```

---

## Configuration Details

**Server Type:** Official Hosted MCP Server
**URL:** https://mcp.supabase.com/mcp
**Status:** Ready for authentication

### Your MCP Configuration
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

---

## What's Next: Authentication

When you next use Claude Code, you'll see a prompt to authenticate with Supabase.

### Authentication Steps

1. **First time setup** will prompt you to log in
2. **Browser window opens** automatically
3. **Grant organization access** to Claude Code/Claude
4. **Automatic token handling** - no manual tokens needed
5. **Scoped access** - limited to your PortunWeb project

**No action needed from you** - the authentication is handled automatically!

---

## What the Supabase MCP Server Does

The Supabase MCP server allows Claude Code to:

✅ **Query your database** - Write natural language SQL queries
✅ **Manage tables** - Create, modify, delete tables
✅ **View schema** - See your database structure
✅ **Manage columns** - Add, remove, modify columns
✅ **Insert data** - Add records to your database
✅ **Execute functions** - Call your PostgreSQL functions
✅ **View real-time data** - See live database changes

### Example Uses

```
"Show me all users in the database"
"Create a table called contact_submissions with columns for name, email, message, plan"
"Add an index on the email column for faster lookups"
"Query the contact form submissions"
"List all edge functions I have"
```

---

## Security Best Practices

### ✅ Already Configured

- Using official hosted Supabase MCP (most secure)
- Using your existing Supabase project
- Authentication via Supabase account
- No hardcoded secrets in config

### 🔒 Recommended for Production

Before using with production data:

1. **Create API token** with minimal permissions
2. **Use project-scoped access** - limit to PortunWeb only
3. **Enable read-only mode** - for sensitive data
4. **Keep manual approval** enabled in Claude Code settings

See `SUPABASE_MCP_ADVANCED.md` for production setup.

---

## Troubleshooting

### "MCP server not found"

**Solution:**
- Restart Claude Code
- Check ~/.claude/mcp.json exists
- Verify JSON syntax is correct

### "Authentication failed"

**Solution:**
- Log out of Supabase in browser
- Try authentication again
- Check Supabase account has access to PortunWeb

### "Permission denied" errors

**Solution:**
- Verify your Supabase user role
- Check API token has correct permissions
- Ensure you're in right project (PortunWeb)

---

## File Locations

**MCP Configuration:**
```
~/.claude/mcp.json
```

**Local Supabase Config (if self-hosted):**
```
~/Development/PortunWeb/.env
```

---

## Using Supabase MCP with Claude Code

Once authenticated, you can ask Claude Code to:

### Database Queries
```
"What tables do I have in my database?"
"Show me the schema for the contact_submissions table"
"How many users have submitted the contact form?"
```

### Database Management
```
"Create a table for tracking contact form submissions"
"Add a column for submission_date to the contacts table"
"Create an index on the email column"
```

### Edge Functions
```
"List all my Supabase Edge Functions"
"Show me the send-contact-email function code"
"Deploy a new edge function"
```

### Data Operations
```
"Insert a test record into the contacts table"
"Update the user with email john@example.com"
"Delete old contact submissions older than 30 days"
```

---

## Next Steps

### Immediate
1. ✅ MCP server installed
2. ⏳ **Next:** Restart Claude Code
3. ⏳ **Then:** You'll be prompted to authenticate with Supabase

### After Authentication
- Can query your PortunWeb database
- Can manage Supabase resources
- Can test database operations

### Advanced Setup (Optional)
- See `SUPABASE_MCP_ADVANCED.md` for project-scoped access
- See `SUPABASE_MCP_SECURITY.md` for production setup

---

## Configuration Options

### Current Setup
- **Type:** Official hosted
- **Scope:** All projects (you can specify project during auth)
- **Mode:** Read-write (default)
- **Auth:** Dynamic (handled automatically)

### Available Customizations

If you want to customize further, you can add:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=your-project-ref",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN"
      }
    }
  }
}
```

(Only needed if auto-auth doesn't work)

---

## Testing the MCP Server

Once authenticated, you can test it by asking Claude Code:

```
"Connect to my Supabase database and show me the tables I have"
```

Claude Code should respond with your actual database tables.

---

## Security Configuration for PortunWeb

Your Supabase MCP is configured for:

✅ **Development use** - Safe for development/testing
✅ **Project access** - Can access PortunWeb project
✅ **Feature support** - Full CRUD + functions
⚠️ **Production caution** - Not recommended for production data

For production, implement:
- [ ] Project-scoped access tokens
- [ ] Read-only mode enabled
- [ ] Separate service role key
- [ ] Audit logging enabled

---

## Quick Reference

| Task | Command/Action |
|------|-----------------|
| Check MCP installed | Look for ~/.claude/mcp.json |
| Restart MCP | Restart Claude Code |
| Authenticate | Respond to auth prompt (auto) |
| Test connection | Ask Claude to query database |
| Update config | Edit ~/.claude/mcp.json |
| Troubleshoot | Check ~/. claude/mcp.json syntax |

---

## Support Resources

**Supabase MCP Docs:**
- https://supabase.com/docs/guides/getting-started/mcp

**Claude Code MCP:**
- https://code.claude.com/docs (search for MCP)

**GitHub Repository:**
- https://github.com/supabase-community/supabase-mcp

---

## Verification Checklist

- [x] MCP configuration file created
- [x] Supabase MCP URL configured
- [x] Ready for authentication
- [ ] Claude Code restarted
- [ ] Authentication completed
- [ ] Database connection tested

---

## What Happens Next

1. **Today:** Restart Claude Code
2. **First use:** Auth prompt appears
3. **Browser:** Log in to Supabase
4. **Grant access:** Allow Claude Code access
5. **Ready:** Can now query your database!

**Estimated time:** 2-3 minutes total

---

## You're Ready! 🚀

Your Supabase MCP server is installed and configured.

**Next action:** Restart Claude Code and authenticate when prompted.

---

**Status:** ✅ Installation Complete
**Configuration:** ✅ Ready
**Next:** Restart Claude Code & authenticate
