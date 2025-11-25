# Brand Guidelines - Portun.app

**Date**: 2025-11-14
**Version**: 1.0

---

## Brand Identity

### Name
**Portun** (derived from Latin "portus" - gateway, harbor)

### Tagline
**"Smart Access, Simple Living"**

### Mission
Make residential community access control simple, affordable, and secure for communities of all sizes across the Americas.

---

## Logo

### Primary Logo
- Wordmark: "Portun" in Inter Bold
- Icon: Stylized gate/doorway mark
- Color: Portun Blue (#2563EB) on white

### Usage Rules
- Minimum size: 24px height
- Clear space: Equal to height of "P"
- Never stretch, rotate, or add effects
- Use white logo on dark backgrounds

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Portun Blue | `#2563EB` | Primary actions, links, logo |
| Portun Dark | `#1E40AF` | Hover states, headers |

### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#10B981` | Valid, verified, success |
| Error Red | `#EF4444` | Invalid, rejected, errors |
| Warning Amber | `#F59E0B` | Pending, caution |
| Info Blue | `#3B82F6` | Information, notifications |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| Gray 900 | `#111827` | Primary text |
| Gray 600 | `#4B5563` | Secondary text |
| Gray 400 | `#9CA3AF` | Placeholder text |
| Gray 200 | `#E5E7EB` | Borders, dividers |
| Gray 50 | `#F9FAFB` | Backgrounds |

---

## Typography

### Font Family
**Inter** (Google Font)
- Headlines: Inter Bold (700)
- Body: Inter Regular (400)
- Captions: Inter Medium (500)

### Font Sizes
| Use | Size | Weight |
|-----|------|--------|
| H1 | 32px | Bold |
| H2 | 24px | Bold |
| H3 | 20px | Semi-bold |
| Body | 16px | Regular |
| Small | 14px | Regular |
| Caption | 12px | Medium |

### Mobile Adjustments
- H1: 28px
- H2: 22px
- Body: 16px (unchanged)

---

## Voice & Tone

### Personality
- **Clear** not clever
- **Helpful** not pushy
- **Confident** not arrogant
- **Friendly** not casual

### Writing Guidelines

**Do:**
- Use simple, everyday language
- Be direct and concise
- Use active voice
- Address the user as "you"

**Don't:**
- Use jargon or buzzwords
- Be overly formal or stiff
- Use passive voice
- Sound robotic or cold

### Examples

**Headlines:**
- ✅ "Create QR codes for visitors in seconds"
- ❌ "Onboard guests with our comprehensive visitor management platform"

**Buttons:**
- ✅ "Create QR Code"
- ❌ "Generate Access Credential"

**Error Messages:**
- ✅ "QR code expired. Ask for a new one."
- ❌ "Error: Invalid temporal credential token"

**Success Messages:**
- ✅ "Entry logged. Maria has been notified."
- ❌ "Transaction completed successfully."

---

## Iconography

### Style
- Line icons, 1.5px stroke
- Rounded corners
- 24x24px default size

### Common Icons
| Action | Icon |
|--------|------|
| Create QR | `qr-code` |
| Scan | `camera` |
| Entry | `log-in` |
| Payment | `credit-card` |
| Verified | `check-circle` |
| Rejected | `x-circle` |
| Pending | `clock` |
| Settings | `cog` |
| User | `user` |
| Guard | `shield` |
| Admin | `settings` |

### Icon Library
Use [Heroicons](https://heroicons.com/) (MIT License)

---

## UI Components

### Buttons

**Primary Button:**
```css
background: #2563EB;
color: white;
border-radius: 8px;
padding: 12px 24px;
font-weight: 600;
```

**Secondary Button:**
```css
background: transparent;
color: #2563EB;
border: 1px solid #2563EB;
border-radius: 8px;
```

**Danger Button:**
```css
background: #EF4444;
color: white;
border-radius: 8px;
```

### Cards
```css
background: white;
border-radius: 12px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
padding: 16px;
```

### Status Badges

| Status | Background | Text |
|--------|------------|------|
| Verified | `#D1FAE5` | `#065F46` |
| Pending | `#FEF3C7` | `#92400E` |
| Rejected | `#FEE2E2` | `#991B1B` |

### Form Inputs
```css
border: 1px solid #E5E7EB;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
```

---

## QR Code Style

### Colors
- Foreground: Portun Blue `#2563EB`
- Background: White `#FFFFFF`

### Size
- Display: 300x300px
- Minimum: 150x150px
- Print: 1 inch minimum

### Error Correction
- Level M (15% recovery)

---

## Photography

### Style
- Natural lighting
- Authentic moments
- Diverse representation
- US + LATAM settings

### Subjects
- Residents using app
- Guards at gates
- Community amenities
- Families, visitors

### Avoid
- Stock photo clichés
- Overly corporate settings
- All-white representation
- Fake smiles

---

## Language Support

### Primary Languages
- English (US)
- Spanish (LATAM neutral)

### Localization Guidelines
- Translate meaning, not words
- Use regional Spanish (avoid Spain-specific terms)
- Keep UI strings short
- Test text expansion (Spanish ~30% longer)

### Currency/Date Formats
| Region | Currency | Date |
|--------|----------|------|
| US | $1,234.56 | MM/DD/YYYY |
| LATAM | $1.234,56 | DD/MM/YYYY |

---

## Application

### App Store Assets
- Icon: 1024x1024px, Portun logo centered
- Screenshots: Device frames, real UI
- Feature graphic: Tagline + hero image

### Marketing Materials
- Always include tagline
- Use lifestyle photography
- Highlight simplicity
- Show mobile-first

### Social Media
- Profile: Logo icon
- Cover: Tagline + abstract pattern
- Posts: Clean, minimal, informative

---

## Brand Don'ts

- ❌ Don't use gradients on the logo
- ❌ Don't change logo colors
- ❌ Don't use Comic Sans (or similar)
- ❌ Don't use stock photo watermarks
- ❌ Don't use more than 2 colors per design
- ❌ Don't crowd designs with text
- ❌ Don't use ALL CAPS for body text
- ❌ Don't add emojis to formal communications

---

*Document maintained by Portun.app Brand Team*
