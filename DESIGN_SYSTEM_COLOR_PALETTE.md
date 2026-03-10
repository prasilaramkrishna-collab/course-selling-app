# Future Proof - Modern Design System & Color Palette

## 1. COLOR PALETTE

### Primary Colors
```css
/* Orange - Primary CTA & Highlights */
Orange-50:   #fdf2f8  /* Lightest background */
Orange-100:  #fed7aa  /* Light backgrounds */
Orange-400:  #fb923c  /* Medium buttons */
Orange-500:  #f97316  /* Primary CTA button */
Orange-600:  #ea580c  /* Hover state */
Orange-700:  #c2410c  /* Active state */

/* Slate - Dark Mode Base */
Slate-700:   #334155  /* Component backgrounds */
Slate-800:   #1e293b  /* Secondary background */
Slate-900:   #0f172a  /* Primary background */

/* Green - Success & Positive Actions */
Green-400:   #4ade80  /* Success text */
Green-500:   #22c55e  /* Active badges */
Green-600:   #16a34a  /* Hover state */
```

### Secondary Colors
```css
/* Blue - Information & Links */
Blue-400:   #60a5fa  /* Links, info text */
Blue-500:   #3b82f6  /* Buttons, sections */
Blue-600:   #2563eb  /* Hover state */
Blue-700:   #1d4ed8  /* Active state */

/* Purple - Special Features */
Purple-500: #a855f7  /* Quiz, special buttons */
Purple-600: #9333ea  /* Hover state */

/* Yellow - Warnings & Badges */
Yellow-400: #facc15  /* Warning text */
Yellow-500: #eab308  /* Warning badges */
Yellow-600: #ca8a04  /* Certificate highlight */

/* Red - Errors & Destructive */
Red-400:    #f87171  /* Error borders */
Red-500:    #ef4444  /* Error backgrounds */
```

### Neutral Colors
```css
/* Gray/Text Colors */
White:      #ffffff  /* Text on dark */
Gray-300:   #d1d5db  /* Secondary text */
Gray-400:   #9ca3af  /* Disabled text */
Gray-500:   #6b7280  /* Placeholder text */
Black:      #000000  /* Overlays */
```

---

## 2. TYPOGRAPHY SYSTEM

### Font Family
```css
/* Serif for headings */
font-family: 'Playfair Display', 'Lora', serif;

/* Sans-serif for body */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes & Weights
```
H1: 48px / 3rem    - font-bold    - Page titles
H2: 32px / 2rem    - font-bold    - Section headers
H3: 24px / 1.5rem  - font-semibold - Subsection
H4: 20px / 1.25rem - font-semibold - Card titles
Body: 16px / 1rem  - font-normal   - Main text
Small: 14px / 0.875rem - font-normal - Secondary text
Tiny: 12px / 0.75rem   - font-normal - Metadata
```

### Line Height
```
Headings: line-height: 1.2  (tight)
Body:     line-height: 1.6  (relaxed)
Lists:    line-height: 1.8  (loose)
```

---

## 3. SPACING SCALE

```
2px   (0.5)  - Minimal gaps
4px   (1)    - Small spacing
8px   (2)    - Regular padding
12px  (3)    - Comfortable spacing
16px  (4)    - Base unit spacing
24px  (6)    - Section spacing
32px  (8)    - Large sections
48px  (12)   - Extra large spacing
```

Usage:
```jsx
// Component padding
<div className="p-4 sm:p-5 lg:p-6">

// Section spacing
<section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

// Grid gaps
<div className="grid gap-4 sm:gap-6 lg:gap-8">
```

---

## 4. COMPONENT COLORS

### Buttons
```jsx
/* Primary (Orange) */
<button className="bg-orange-500 hover:bg-orange-600 text-white">
  Primary CTA
</button>

/* Secondary (Slate) */
<button className="bg-slate-700 hover:bg-slate-600 border border-slate-600">
  Secondary
</button>

/* Success (Green) */
<button className="bg-green-500 hover:bg-green-600">
  Success Action
</button>

/* Danger (Red) */
<button className="bg-red-500 hover:bg-red-600">
  Delete / Logout
</button>

/* Disabled */
<button className="bg-slate-600 text-gray-400 cursor-not-allowed">
  Disabled
</button>
```

### Cards & Containers
```jsx
/* Dark card */
<div className="bg-slate-700 hover:bg-slate-600 rounded-xl">
  Card content
</div>

/* Glass effect */
<div className="bg-slate-800/50 backdrop-blur">
  Glass effect
</div>

/* Gradient overlay */
<div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent">
  Overlay
</div>
```

### Badges & Alerts
```jsx
/* Success badge */
<span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
  Active
</span>

/* Warning alert */
<div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
  Warning message
</div>

/* Error alert */
<div className="bg-red-500/10 border border-red-500/30 text-red-400">
  Error message
</div>
```

### Borders & Dividers
```jsx
/* Thin border */
<div className="border border-slate-700">

/* Gradient border */
<div className="border-l-2 border-orange-500">

/* Subtle divider */
<hr className="border-slate-700">
```

---

## 5. SHADOWS & EFFECTS

### Elevation System
```css
/* No shadow - flat */
.shadow-none { box-shadow: none; }

/* Subtle shadow - cards */
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }

/* Medium shadow - hover */
.hover:shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

/* Large shadow - modals */
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }

/* Glowing shadow */
.shadow-lg.shadow-orange-500/20 { 
  box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.2);
}
```

### Usage
```jsx
/* Card in light state */
<article className="bg-slate-700 shadow-sm">

/* Card in hover state */
<article className="hover:shadow-xl hover:shadow-orange-500/20">
```

---

## 6. ANIMATIONS & TRANSITIONS

### Durations
```
Fast:    duration-200  (0.2s)  - Button interactions
Normal:  duration-300  (0.3s)  - Hover effects, transitions
Slow:    duration-500  (0.5s)  - Page transitions
```

### Common Animations
```jsx
/* Smooth transition */
<div className="transition-all duration-300">

/* Color transition */
<a className="text-white hover:text-orange-400 transition-colors duration-300">

/* Scale effect */
<img className="group-hover:scale-110 transition-transform duration-300" />

/* Fade in */
<div className="opacity-0 hover:opacity-100 transition-opacity duration-300" />

/* Slide up */
<div className="translate-y-0 group-hover:translate-y-1 transition-transform" />

/* Pulse animation */
<span className="animate-pulse">Loading...</span>

/* Bounce animation */
<div className="animate-bounce">↓</div>

/* Spin animation */
<div className="animate-spin">⏳</div>
```

---

## 7. Dark MODE THEME

### Background Layers
```
Layer 1 (Darkest):  bg-slate-900  - Page background
Layer 2:            bg-slate-800  - Sidebar, main sections
Layer 3:            bg-slate-700  - Cards, components
Layer 4 (Lightest): bg-slate-600  - Hover states
```

### Text Colors
```
Primary text:      text-white      - Main headings
Secondary text:    text-gray-300   - Body text
Tertiary text:     text-gray-400   - Metadata, hints
Disabled text:     text-gray-500   - Disabled items
```

### Usage
```jsx
<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <h1 className="text-white">Heading</h1>
  <p className="text-gray-300">Body text</p>
  <span className="text-gray-400">Metadata</span>
</div>
```

---

## 8. INTERACTIVE ELEMENTS

### Hover States
```jsx
/* Button hover */
<button className="hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20">

/* Link hover */
<a className="hover:text-orange-400 hover:underline">

/* Card hover */
<article className="hover:bg-slate-600 hover:shadow-xl hover:scale-105">
```

### Focus States (Accessibility)
```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900">

<input className="focus:ring-2 focus:ring-orange-500 focus:border-transparent">
```

### Active States
```jsx
<button className="data-[active=true]:bg-orange-500/20 data-[active=true]:border-l-2 data-[active=true]:border-orange-500">
```

---

## 9. RESPONSIVE BREAKPOINTS

```
Mobile:      0px    (default)
sm:          640px  (tablets)
md:          768px  (small laptops)
lg:          1024px (desktops)
xl:          1280px (large screens)
2xl:         1536px (ultra wide)
```

### Mobile-First Pattern
```jsx
/* Default: mobile layout */
<div className="block">
  
  /* sm: show on tablets+ */
  <div className="hidden sm:block">
    
    /* md: show on larger screens */
    <div className="hidden md:flex">
```

---

## 10. ICON THEME

### Emoji Icons (Already Implemented)
```
Home:         🏠
Courses:      📚 for materials, 📘 for course plan
Purchases:    📥 or 🛍️
Certificates: 🏆
Quiz:         📝
Settings:     ⚙️
Video:        🎥
PDF:          📄
Download:     ⬇️
Success:      ✓
Error:        ✗
Warning:      ⚠️
Loading:      ⏳
Cart:         🛒
```

### Icon Integration with Colors
```jsx
<span className="text-2xl text-orange-400 animate-bounce">🎓</span>
<span className="text-3xl text-green-500">✓</span>
<span className="text-lg text-yellow-400">⚠️</span>
```

---

## 11. GRADIENT SYSTEM

### Background Gradients
```jsx
/* Page background */
<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

/* Card gradient */
<div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/10">

/* Text gradient */
<h1 className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
```

### Overlay Gradients
```jsx
/* Fade to dark */
<div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent">

/* Left to right fade */
<div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent">
```

---

## 12. COMPONENT LIBRARY EXAMPLES

### Modern Card
```jsx
<article className="group rounded-xl overflow-hidden bg-slate-700 hover:bg-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20">
  <img className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
  <div className="p-5 space-y-3">
    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400">Title</h3>
    <p className="text-sm text-gray-400">Description</p>
    <button className="w-full px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors">
      Action
    </button>
  </div>
</article>
```

### Modern Button Group
```jsx
<div className="flex gap-3">
  <button className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all hover:shadow-lg">
    Primary
  </button>
  <button className="px-6 py-3 rounded-lg border border-slate-600 text-white hover:bg-slate-700 transition-colors">
    Secondary
  </button>
</div>
```

### Modern Badge
```jsx
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
  <span>✓</span> Active
</span>
```

### Modern Alert
```jsx
<div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 space-y-2">
  <p className="font-semibold">⚠️ Warning Title</p>
  <p className="text-sm">Description of the warning</p>
</div>
```

---

## 13. BEST PRACTICES

1. **Consistency**: Always use colors from this palette
2. **Contrast**: Ensure 4.5:1 ratio for text
3. **Spacing**: Use multiples of 4px/8px for consistency
4. **Animations**: Keep under 500ms for responsiveness
5. **Dark Mode**: Always test on dark backgrounds
6. **Accessibility**: Include focus states and ARIA labels
7. **Mobile First**: Design mobile, then add responsive breakpoints
8. **Performance**: Use CSS transitions, not JavaScript animations

---

## 14. FIGMA/DESIGN TOKENS

```json
{
  "colors": {
    "primary": "#f97316",
    "secondary": "#1e293b",
    "success": "#22c55e",
    "danger": "#ef4444",
    "warning": "#eab308"
  },
  "typography": {
    "h1": {"size": "48px", "weight": 700},
    "body": {"size": "16px", "weight": 400}
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px"
  }
}
```

---

**Last Updated:** March 6, 2026
**Version:** 1.0
**Design System:** Modern Dark Mode with Orange Accent
