# ⚡ Momentum Logo Guide

## Logo Files Created

### 1. **`logo.svg`** - Main Logo (200x200)
- Full decorative version with motion arcs
- Perfect for: Landing pages, presentations, marketing materials
- Features: Lightning bolt with forward motion arcs and energy particles

### 2. **`logo-icon.svg`** - Icon Version (100x100)
- Compact circular icon with lightning bolt
- Perfect for: App icons, social media profiles, small spaces
- Features: Gradient background circle with bold lightning bolt

### 3. **`logo-full.svg`** - Full Logo with Text (400x120)
- Complete branding with icon + "MOMENTUM" text + tagline
- Perfect for: Headers, email signatures, documentation
- Features: Full wordmark with "BUILD • PROGRESS • ACHIEVE" tagline

### 4. **`favicon.svg`** - Favicon (32x32)
- Optimized for browser tabs
- Perfect for: Browser favicon, PWA icon
- Features: Simple, recognizable lightning bolt on gradient background

### 5. **`Logo.jsx`** - React Component
- Reusable React component with props
- Sizes: xs, sm, md, lg, xl
- Options: animated, showText, variant

## 🎨 Design Elements

### Color Palette
```
Primary Blue:   #0ea5e9 (Cyan/Sky Blue)
Primary Purple: #6366f1 (Indigo)
Accent Purple:  #a855f7 (Purple)
Gold:          #fbbf24 (Amber)
Orange:        #f59e0b (Orange)
```

### Symbolism
- **⚡ Lightning Bolt**: Energy, power, instant transformation
- **Forward Motion Arcs**: Progress, momentum, continuous movement
- **Gradient Circle**: Wholeness, journey, growth
- **Energy Particles**: Small wins, daily progress
- **Gold/Orange Colors**: Achievement, success, energy

## 💻 Usage in Code

### Using the Logo Component

```jsx
import Logo from '../components/Logo';

// Icon only - Small
<Logo size="sm" />

// Icon only - Medium (default)
<Logo size="md" />

// Icon only - Large
<Logo size="lg" />

// With text
<Logo size="md" showText={true} />

// Without animation
<Logo size="lg" animated={false} />

// Extra large with text
<Logo size="xl" showText={true} />
```

### Using SVG Files Directly

```jsx
// In HTML
<img src="/logo.svg" alt="Momentum Logo" />
<img src="/logo-icon.svg" alt="Momentum Icon" />
<img src="/logo-full.svg" alt="Momentum Full Logo" />

// As background
<div style={{ backgroundImage: 'url(/logo.svg)' }} />
```

### In CSS
```css
.logo-bg {
  background-image: url('/logo-icon.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

## 📐 Logo Variations & When to Use

| Logo File | Size | Use Case | Where to Use |
|-----------|------|----------|--------------|
| `logo-icon.svg` | 100x100 | App icon, small spaces | Sidebar, mobile header, favicon |
| `logo.svg` | 200x200 | Decorative | Hero sections, splash screens |
| `logo-full.svg` | 400x120 | Full branding | Website header, email, documents |
| `favicon.svg` | 32x32 | Browser tab | Browser favicon, PWA icons |

## 🎯 Logo Component Props

```typescript
interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Default: 'md'
  variant?: 'icon' | 'full';                // Default: 'icon'
  showText?: boolean;                        // Default: false
  animated?: boolean;                        // Default: true
}
```

### Size Reference
```
xs: 24px icon, text-lg text
sm: 32px icon, text-xl text
md: 48px icon, text-2xl text (default)
lg: 64px icon, text-3xl text
xl: 96px icon, text-4xl text
```

## 🔄 Updating Existing Components

### Update Layout Component
Replace the Flame icon with the Logo component:

```jsx
import Logo from '../components/Logo';

// Old:
<Flame className="text-primary-500" />
<h1 className="text-2xl font-bold">Momentum</h1>

// New:
<Logo size="md" showText={true} />
```

### Update Login/Register Pages
```jsx
import Logo from '../components/Logo';

// Replace existing logo section:
<Logo size="lg" showText={true} animated={true} />
```

## 🌐 Export for Different Platforms

### For Social Media
- **Twitter/X**: Use `logo-icon.svg` (400x400 recommended)
- **LinkedIn**: Use `logo-full.svg` for company page
- **Facebook**: Use `logo-icon.svg` (180x180)
- **Instagram**: Use `logo.svg` (1080x1080)

### For App Stores
- **iOS App Icon**: Export `logo-icon.svg` as PNG at 1024x1024
- **Android**: Multiple sizes from 48x48 to 512x512
- **PWA**: Use `favicon.svg` or export as multiple PNG sizes

### For Print
- Export SVGs at 300 DPI
- Use `logo-full.svg` for business cards
- Use `logo.svg` for posters/banners

## 🎨 Customization

### Changing Colors
Edit the `<linearGradient>` elements in the SVG files:

```svg
<!-- Primary gradient -->
<linearGradient id="iconGradient">
  <stop offset="0%" style="stop-color:#0ea5e9" />
  <stop offset="100%" style="stop-color:#6366f1" />
</linearGradient>

<!-- Lightning bolt gradient -->
<linearGradient id="boltGradient">
  <stop offset="0%" style="stop-color:#fbbf24" />
  <stop offset="100%" style="stop-color:#f59e0b" />
</linearGradient>
```

### Adding Glow Effect
The logos use a filter for glow:
```svg
<filter id="glow">
  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

## 📱 Responsive Logo

For different screen sizes:

```jsx
// Mobile
<Logo size="sm" />

// Tablet
<Logo size="md" showText={true} />

// Desktop
<Logo size="lg" showText={true} />
```

## ✅ Logo Checklist

- [x] Main logo created (`logo.svg`)
- [x] Icon version created (`logo-icon.svg`)
- [x] Full branding created (`logo-full.svg`)
- [x] Favicon created (`favicon.svg`)
- [x] React component created (`Logo.jsx`)
- [x] Favicon updated in `index.html`
- [ ] Update Layout.jsx to use Logo component
- [ ] Update Login.jsx to use Logo component
- [ ] Update Register.jsx to use Logo component
- [ ] Export PNG versions for social media
- [ ] Create app icons for iOS/Android

## 🚀 Next Steps

1. **Test the logos**: Open your app and check all logo placements
2. **Update components**: Replace Flame icons with Logo component
3. **Export for platforms**: Create PNG versions for different platforms
4. **Create variations**: Dark mode version, monochrome version
5. **Brand guidelines**: Document spacing, minimum sizes, usage rules

---

**Your Momentum logo represents:**
- ⚡ Energy and transformation
- 🚀 Forward progress
- 💎 Consistency and dedication
- 🎯 Achievement and growth

**Keep building momentum! ⚡**

