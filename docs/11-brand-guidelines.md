# Portun.app Brand Guidelines

**Version**: 1.0
**Last Updated**: 2025-11-14
**Status**: MVP Brand Identity

---

## Brand Overview

**Brand Name**: Portun (pronounced "pour-TOON")
**Tagline**: "Smart Access, Simple Living"
**Positioning**: Accessible, secure QR access control for residential communities

---

## Brand Personality

**Core Attributes**:
- **Trustworthy**: Security you can rely on
- **Simple**: Complexity hidden, simplicity shown
- **Accessible**: For everyone, not just tech-savvy users
- **Professional**: Enterprise-grade at affordable pricing
- **Bilingual**: Equally strong in English and Spanish

**Voice & Tone**:
- **Clear, not clever**: "Create QR Code" not "Invite Magic"
- **Helpful, not pushy**: "You may want to..." not "You must..."
- **Professional, not stuffy**: Friendly but competent
- **Inclusive**: Equally welcoming to US and LATAM users

---

## Visual Identity

### Logo

**Primary Logo** (To be designed):
```
┌─────────────────┐
│   [P] PORTUN    │  ← Stylized "P" in door/gate shape
│   Smart Access   │  ← Tagline underneath
└─────────────────┘
```

**Logo Variations**:
- Primary: Full color with tagline
- Secondary: Icon only (for app icon)
- Monochrome: Black or white for print

**Logo Usage**:
- Minimum size: 120px wide (digital), 1 inch (print)
- Clear space: 1x logo height on all sides
- Don't stretch, rotate, or add effects

---

### Color Palette

**Primary Colors**:

```
Portun Blue (Primary)
HEX: #2563EB
RGB: 37, 99, 235
CMYK: 84, 58, 0, 8
Use: Primary buttons, links, accents

Portun Dark (Secondary)
HEX: #1E293B
RGB: 30, 41, 59
CMYK: 49, 30, 0, 77
Use: Text, headings, dark backgrounds
```

**Accent Colors**:

```
Success Green
HEX: #10B981
Use: Success states, verified badges, approve buttons

Warning Amber
HEX: #F59E0B
Use: Pending status, warnings

Error Red
HEX: #EF4444
Use: Errors, denied access, critical alerts

Neutral Gray
HEX: #64748B
Use: Secondary text, disabled states
```

**Background Colors**:

```
Light Background
HEX: #F8FAFC
Use: Page backgrounds, cards (light mode)

Dark Background
HEX: #0F172A
Use: Dark mode backgrounds

White
HEX: #FFFFFF
Use: Content areas, modals
```

---

### Typography

**Primary Font**: Inter (Google Font)
- Headings: Inter Bold (700)
- Body text: Inter Regular (400)
- Emphasis: Inter Medium (500)

**Fallbacks**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Font Sizes** (Desktop):
```
H1: 36px / Bold
H2: 30px / Bold
H3: 24px / Semi-Bold
H4: 20px / Semi-Bold
Body: 16px / Regular
Small: 14px / Regular
Tiny: 12px / Regular
```

**Font Sizes** (Mobile):
```
H1: 28px / Bold
H2: 24px / Bold
H3: 20px / Semi-Bold
H4: 18px / Semi-Bold
Body: 16px / Regular
Small: 14px / Regular
Tiny: 12px / Regular
```

**Line Height**: 1.5 (body text), 1.2 (headings)

---

### Iconography

**Icon Set**: Tabler Icons (consistent with Vuexy theme)
**Style**: Outline (not filled)
**Stroke Width**: 2px
**Size**: 20px, 24px, 32px (standard sizes)

**Core Icons**:
- QR Code: `tabler-qrcode`
- Visitor: `tabler-user`
- Guard: `tabler-shield-check`
- Payment: `tabler-receipt`
- Approved: `tabler-circle-check`
- Denied: `tabler-circle-x`
- Settings: `tabler-settings`
- Notifications: `tabler-bell`

---

### Imagery

**Photo Style**:
- Bright, high-contrast
- Real people (diverse, not stock photos if possible)
- Residential settings (modern homes, gates, communities)
- Authentic situations (guards at gates, residents with phones)

**Illustration Style** (if used):
- Flat design with subtle shadows
- Use brand color palette
- Minimal detail (keep it simple)

**QR Code Design**:
- Always high contrast (dark blue on white)
- Error correction level: M (medium, 15% recovery)
- Include Portun logo in center (small, doesn't interfere with scanning)

---

## Writing Style

### Tone of Voice

**Do**:
- Use simple, everyday language
- Address users as "you"
- Be specific: "Create a QR code" not "Get started"
- Explain the benefit: "So your guest can enter quickly"

**Don't**:
- Use jargon: "Onboard" → "Sign up"
- Use passive voice: "Your code will be created" → "We'll create your code"
- Over-explain: Keep it concise
- Use ALL CAPS (except acronyms like QR)

### Example Messaging

**Welcome Screen**:
✅ "Welcome to Portun! Create QR codes for visitors in seconds."
❌ "Welcome to the Portun platform. Get started with our comprehensive visitor management solution."

**Error Messages**:
✅ "This QR code has expired. Please ask the resident to create a new one."
❌ "Error: QR code validation failed due to timestamp exceeding validity period."

**Success Messages**:
✅ "QR code created! Share it with your visitor."
❌ "Visitor record successfully inserted into database."

---

## Bilingual Guidelines (English/Spanish)

**Language Selection**:
- Auto-detect from device settings
- Manual toggle in app settings
- Remember preference

**Translation Quality**:
- Professional translation (not Google Translate)
- Culturally appropriate (US Spanish vs LATAM Spanish)
- Same tone and clarity in both languages

**Example Translations**:
```
English: "Create Visitor QR Code"
Spanish: "Crear Código QR para Visitante"

English: "Guest Arrived"
Spanish: "Invitado Llegó"

English: "Access Granted"
Spanish: "Acceso Permitido"
```

---

## UI Component Standards

### Buttons

**Primary Button**:
- Background: Portun Blue (#2563EB)
- Text: White
- Border radius: 8px
- Padding: 12px 24px
- Font: Inter Medium 16px
- Hover: Darker blue (#1D4ED8)
- Example: "Create QR Code", "Verify Payment"

**Secondary Button**:
- Background: Transparent
- Border: 2px solid Portun Blue
- Text: Portun Blue
- Same sizing as primary
- Example: "Cancel", "Skip"

**Destructive Button**:
- Background: Error Red (#EF4444)
- Text: White
- Same sizing
- Example: "Delete Visitor", "Deny Access"

---

### Status Badges

**Pending**:
- Background: Warning Amber 10% opacity
- Text: Warning Amber (dark)
- Icon: ⏳ (tabler-clock)

**Verified/Approved**:
- Background: Success Green 10% opacity
- Text: Success Green (dark)
- Icon: ✓ (tabler-circle-check)

**Rejected/Denied**:
- Background: Error Red 10% opacity
- Text: Error Red (dark)
- Icon: ✕ (tabler-circle-x)

---

### Cards & Containers

**Card Style**:
- Background: White (light mode), #1E293B (dark mode)
- Border: None (shadow only)
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Border radius: 12px
- Padding: 20px

**Hover State**:
- Shadow: 0 4px 12px rgba(0,0,0,0.15)
- Transition: 200ms ease

---

### Forms

**Input Fields**:
- Border: 1px solid #CBD5E1
- Border radius: 8px
- Padding: 12px 16px
- Font: Inter Regular 16px
- Focus: Border color changes to Portun Blue, shadow added

**Labels**:
- Above input (not placeholder)
- Font: Inter Medium 14px
- Color: Portun Dark
- Required fields marked with *

**Error States**:
- Border color: Error Red
- Error message below input in Error Red
- Icon: ⚠ (tabler-alert-circle)

---

## Marketing Materials

### Website (www.portun.app)

**Hero Section**:
- H1: "Smart Access Control for Modern Communities"
- Subheading: "QR-based visitor management at 1/3 the cost of competitors"
- CTA: "Start Free Trial" (primary button)
- Image: Resident sharing QR code via phone

**Features Section** (3 columns):
1. **QR Access Control**
   - Icon: QR code
   - Description: "Create visitor QR codes in seconds. Guards validate instantly."

2. **Payment Tracking**
   - Icon: Receipt
   - Description: "Upload payment receipts. Admins verify with one click."

3. **Real-time Notifications**
   - Icon: Bell
   - Description: "Know the moment your guest arrives. Full audit trail."

**Pricing Section**:
- Transparent pricing calculator
- Slider: 10-500 units
- Displayed price: "$X per unit/month" (bold, large)
- Comparison: "vs $Y with competitors"
- CTA: "Start 30-Day Free Trial"

---

### App Store Listings

**App Name**: Portun - Smart Access
**Subtitle**: QR Visitor Access Control

**Description**:
```
Create QR codes for your visitors. They scan at the gate. You get notified instantly.

KEY FEATURES:
• Generate visitor QR codes in seconds
• Share codes via WhatsApp, SMS, or email
• Real-time entry notifications with photos
• View complete entry history
• Upload payment receipts
• Track payment status

Perfect for homeowners, HOA residents, and property managers who want secure, convenient visitor access control.

TRUSTED BY 50+ COMMUNITIES
```

**Keywords**: visitor management, QR code, access control, HOA, gated community, security

**Screenshots** (6):
1. QR code generation screen
2. Entry notification
3. Visitor list
4. Payment upload
5. Guard scanning QR
6. Admin dashboard

---

### Social Media

**Profile Picture**: Portun icon (just the "P" logo)
**Cover Image**: Hero image from website

**Post Examples**:

LinkedIn:
> Tired of manual visitor logs and phone calls at the gate?
>
> Portun.app transforms visitor management with QR codes. Residents create codes in seconds. Guards validate instantly. Everyone gets notified.
>
> Try it free for 30 days. No credit card required.
>
> #PropTech #AccessControl #HOA

Twitter/X:
> Manual visitor logs? 📝
> Phone calls to residents? 📞
> 5-minute gate waits? ⏰
>
> There's a better way.
>
> Portun: QR-based visitor access in < 30 seconds.
>
> $2/unit/month. Try free: portun.app

---

## Brand Don'ts

❌ **Don't**:
- Use competitor names in marketing (focus on our value)
- Promise features not yet built (transparent roadmap)
- Use "enterprise-grade" or buzzwords (be specific)
- Ignore Spanish speakers (bilingual first)
- Overcomplicate messaging (simple always wins)

✅ **Do**:
- Show real screenshots and demos
- Share customer success stories
- Be transparent about pricing
- Highlight time saved and cost savings
- Celebrate small communities (our target market)

---

## Brand Assets Repository

**To be created**:
- `/assets/branding/`
  - `logo-primary.svg`
  - `logo-icon.svg`
  - `logo-white.svg`
  - `color-palette.pdf`
  - `typography-guide.pdf`
  - `screenshot-templates.psd`

---

## Approval Process

**Logo & Visual Identity**: Needs professional design (budget: $500-1000)
**Marketing Copy**: Product Manager approval required
**Website Content**: CEO approval for messaging
**Social Media**: Marketing Lead approval

---

**Next Review**: After MVP launch (gather user feedback on brand perception)
