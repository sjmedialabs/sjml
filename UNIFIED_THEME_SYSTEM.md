# Unified Dark/Light Mode Theme System

## Overview
The website now has a complete dark/light mode theme system that syncs across both the public website and admin panel. When you toggle the theme in either location, it persists across the entire site using localStorage.

## Key Features

### ✅ Unified Theme Management
- **Single Theme Provider**: Both admin and website use the same `ThemeProvider` from `/hooks/use-theme.tsx`
- **Persistent Storage**: Theme preference saved in `localStorage` as `site-theme`
- **Sync Across Sections**: Changing theme in admin automatically updates website and vice versa

### ✅ Theme Toggle Locations
1. **Website Header**: Sun/Moon icon in top navigation (desktop & mobile)
2. **Admin Sidebar**: Sun/Moon icon in admin navigation panel

### ✅ Semantic Color System
All colors use CSS variables that automatically adapt to theme:

**Dark Mode (Default)**
- Background: `#0a0a0a` (near black)
- Foreground: `#ffffff` (white text)
- Primary: `#e63946` (red accent)
- Border: `#222222` (dark gray)
- Muted: `#1a1a1a` (slightly lighter black)

**Light Mode**
- Background: `#ffffff` (white)
- Foreground: `#0a0a0a` (black text)
- Primary: `#e63946` (red accent - same)
- Border: `#e5e5e5` (light gray)
- Muted: `#f5f5f5` (very light gray)

## Implementation Details

### File Structure
```
/hooks/
  ├── use-theme.tsx           # Unified theme provider & hook
  └── use-admin-theme.tsx     # Deprecated (kept for reference)

/components/
  ├── theme-toggle.tsx        # Theme toggle button component
  └── header.tsx              # Website header with theme toggle

/app/
  ├── layout.tsx              # Root layout with ThemeProvider
  ├── globals.css             # Theme color definitions
  └── admin/
      └── layout.tsx          # Admin layout (uses parent theme)
```

### Usage in Components

**Import the hook:**
```tsx
import { useTheme } from "@/hooks/use-theme"

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  )
}
```

**Using semantic color classes:**
```tsx
// These automatically adapt to theme
<div className="bg-background text-foreground">
  <div className="border border-border bg-card">
    <p className="text-muted-foreground">Muted text</p>
    <button className="bg-primary text-primary-foreground">
      Action
    </button>
  </div>
</div>
```

### Color Variables Reference

| Variable | Purpose | Dark Value | Light Value |
|----------|---------|------------|-------------|
| `--background` | Main background | `#0a0a0a` | `#ffffff` |
| `--foreground` | Main text color | `#ffffff` | `#0a0a0a` |
| `--card` | Card backgrounds | `#111111` | `#ffffff` |
| `--primary` | Brand color | `#e63946` | `#e63946` |
| `--secondary` | Secondary backgrounds | `#1a1a1a` | `#f5f5f5` |
| `--muted` | Muted backgrounds | `#1a1a1a` | `#f5f5f5` |
| `--muted-foreground` | Muted text | `#888888` | `#666666` |
| `--border` | Border color | `#222222` | `#e5e5e5` |
| `--input` | Input backgrounds | `#1a1a1a` | `#f5f5f5` |

## How It Works

1. **Theme Provider Wraps Root Layout**
   - `/app/layout.tsx` wraps all content with `<ThemeProvider>`
   - Theme state managed at the root level

2. **Theme Stored in localStorage**
   - Key: `site-theme`
   - Values: `"dark"` or `"light"`
   - Default: `"dark"`

3. **CSS Classes Applied to HTML**
   - Light mode: `<html class="light">`
   - Dark mode: `<html class="dark">`
   - CSS variables change based on class

4. **Components Use Semantic Variables**
   - Instead of hardcoded colors like `text-white` or `bg-black`
   - Use semantic classes like `text-foreground` or `bg-background`
   - Colors automatically adapt to current theme

## Migration Notes

### Old Admin Theme (Deprecated)
- File: `/hooks/use-admin-theme.tsx`
- Storage key: `admin-theme`
- Class: `admin-light`

### New Unified Theme (Current)
- File: `/hooks/use-theme.tsx`
- Storage key: `site-theme`
- Classes: `light` / `dark`

### Backward Compatibility
The old `admin-light` class still has CSS definitions for compatibility, but all new code should use the unified theme system.

## Testing the Theme

1. **Open Website**: https://sjmedialabs.com
2. **Click Theme Toggle**: Sun/Moon icon in header
3. **Verify**: Page background and text colors change
4. **Open Admin**: https://sjmedialabs.com/admin
5. **Verify**: Theme preference persists from website
6. **Toggle in Admin**: Click theme icon in sidebar
7. **Return to Website**: Theme change should persist

## Troubleshooting

**Theme doesn't persist after reload:**
- Check browser console for localStorage errors
- Verify `site-theme` key exists in localStorage

**Colors don't change:**
- Verify component uses semantic color classes (`bg-background`, `text-foreground`, etc.)
- Check if hardcoded colors are used (like `bg-black`, `text-white`)

**Flash of wrong theme on load:**
- This is expected on first load (mounting delay)
- The `suppressHydrationWarning` prop on `<html>` minimizes this

## Future Enhancements

Potential improvements:
- [ ] System preference detection (prefers-color-scheme)
- [ ] Smooth theme transition animations
- [ ] More color scheme variants (e.g., high contrast)
- [ ] Per-section theme overrides
- [ ] Theme preview in admin settings

## Summary

The unified theme system provides a seamless dark/light mode experience across your entire website and admin panel. All colors use CSS variables for easy customization, and the theme preference persists across sessions using localStorage.
