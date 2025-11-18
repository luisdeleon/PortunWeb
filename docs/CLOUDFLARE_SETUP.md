# Cloudflare Configuration for Portun.app

## Domain Setup

**Primary Domain**: `portun.app` (naked domain)
**Redirect**: `www.portun.app` → `portun.app`

---

## DNS Configuration

### A Records
```
Type: A
Name: @
Content: [Vercel IP addresses - auto-configured]
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### CNAME Records
```
Type: CNAME
Name: www
Content: cname.vercel-dns.com
Proxy status: Proxied (orange cloud)
TTL: Auto
```

---

## Redirect Rules (Page Rules / Redirect Rules)

### ⚠️ IMPORTANT: WWW to Naked Domain Redirect

**DO NOT CHANGE THIS RULE**

Configure in Cloudflare Dashboard:
1. Go to **Rules** → **Redirect Rules**
2. Create a new redirect rule with these settings:

**Rule Name**: `WWW to Naked Domain Redirect`

**When incoming requests match:**
```
Field: Hostname
Operator: equals
Value: www.portun.app
```

**Then:**
```
Type: Dynamic
Expression: concat("https://portun.app", http.request.uri.path)
Status code: 301 (Permanent Redirect)
Preserve query string: Yes
```

**Alternative (Using Page Rules - Legacy):**

If using Page Rules instead:
1. Go to **Rules** → **Page Rules**
2. Create rule:
   ```
   URL pattern: www.portun.app/*
   Setting: Forwarding URL
   Status Code: 301 - Permanent Redirect
   Destination URL: https://portun.app/$1
   ```

---

## SSL/TLS Configuration

**SSL/TLS encryption mode**: Full (strict)

### Edge Certificates
- ✅ Always Use HTTPS: **ON**
- ✅ Automatic HTTPS Rewrites: **ON**
- ✅ Certificate Transparency Monitoring: **ON**

---

## Security Settings

### Firewall
```
Security Level: Medium
Challenge Passage: 30 minutes
Browser Integrity Check: ON
```

### Bot Fight Mode
```
Bot Fight Mode: ON (Free plan)
```

---

## Performance Settings

### Speed Optimization
```
Auto Minify:
  - ✅ JavaScript
  - ✅ CSS
  - ✅ HTML

Brotli Compression: ON
Early Hints: ON (if available)
```

### Caching
```
Caching Level: Standard
Browser Cache TTL: 4 hours
Always Online: ON
```

---

## Verification Steps

### Test WWW Redirect
```bash
# Should redirect to https://portun.app/
curl -I https://www.portun.app/

# Expected response:
HTTP/2 301
location: https://portun.app/
```

### Test Naked Domain
```bash
# Should return 200 OK
curl -I https://portun.app/

# Expected response:
HTTP/2 200
```

### Test HTTPS Enforcement
```bash
# Should redirect to https://
curl -I http://portun.app/

# Expected response:
HTTP/1.1 301 Moved Permanently
Location: https://portun.app/
```

---

## Troubleshooting

### Redirect Not Working
1. Check Cloudflare Redirect Rules are enabled
2. Verify DNS records are proxied (orange cloud)
3. Clear Cloudflare cache: **Caching** → **Purge Everything**
4. Wait 5 minutes for propagation

### SSL Errors
1. Verify Vercel has SSL certificate for both `portun.app` and `www.portun.app`
2. Check SSL/TLS mode is "Full (strict)" in Cloudflare
3. Verify Vercel domain settings include both domains

### Mixed Content Warnings
1. Enable "Automatic HTTPS Rewrites" in SSL/TLS settings
2. Check that all resources use HTTPS URLs

---

## Vercel Integration

### Custom Domains in Vercel
Both domains should be added in Vercel dashboard:

1. `portun.app` (primary)
2. `www.portun.app` (redirect configured in Cloudflare)

### Vercel Configuration
```json
{
  "domains": [
    "portun.app",
    "www.portun.app"
  ]
}
```

---

## Important Notes

⚠️ **DO NOT:**
- Remove the www → naked domain redirect rule
- Change DNS proxy status to "DNS only" (grey cloud)
- Disable "Always Use HTTPS"
- Change SSL/TLS mode from "Full (strict)"

✅ **DO:**
- Keep redirect rules as documented above
- Monitor SSL certificate expiration (auto-renewed)
- Regularly check redirect is working
- Document any changes to this file

---

## Maintenance

### Monthly Checklist
- [ ] Verify www redirect is working
- [ ] Check SSL certificate validity (auto-renewed)
- [ ] Review Cloudflare analytics for errors
- [ ] Update this document if configuration changes

### Contact
For DNS/Cloudflare issues, contact: [Your email/team]

---

**Last Updated**: 2025-01-17
**Configuration Owner**: PortunWeb Team
**Cloudflare Account**: [Your Cloudflare account email]
