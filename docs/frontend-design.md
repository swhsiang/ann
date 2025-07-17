# Frontend Design Guidelines

## Modern React + Tailwind Pattern: Minimal CSS + Utility-First

### Core Philosophy

**Tailwind IS CSS-in-JS (but better)** - utilities are co-located with components, build-time purged, with no runtime overhead.

### Recommended File Structure

```
src/
├── index.css                 # ONLY global styles, Tailwind directives, CSS variables
├── components/
│   ├── ui/                   # shadcn/ui components (pure Tailwind utilities)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── custom/               # Your custom components (pure Tailwind utilities)
│       ├── Header.tsx
│       └── Sidebar.tsx
```

### Modern Styling Approach

**✅ Recommended: Minimal CSS + Utility-First**

```tsx
// Single CSS file (src/index.css) ONLY for:
// - @tailwind directives
// - CSS custom properties
// - Global base styles

// Everything else in JSX with utilities:
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition-colors">
  Click me
</button>

// For complex variants, use cva():
import { cva } from "class-variance-authority";

const buttonVariants = cva("px-4 py-2 rounded-lg font-medium transition-colors", {
  variants: {
    variant: {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
      destructive: "bg-red-500 hover:bg-red-600 text-white"
    },
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg"
    }
  }
});
```

**❌ Avoid: Traditional CSS-in-JS**

```tsx
// Don't do this with Tailwind:
const StyledButton = styled.button`
  background: blue;
  padding: 8px 16px;
  &:hover { background: darkblue; }
`;

// Don't create separate CSS files for components:
import './Button.css'  // ❌ Avoid
import styles from './Button.module.css'  // ❌ Usually unnecessary
```

### Why This Pattern?

**Performance Benefits:**
- No runtime style injection overhead
- Smaller JavaScript bundles (20-30% improvement)
- Build-time purging (only used utilities included)
- Better caching (CSS cached separately)
- Faster hydration in SSR

**Developer Experience:**
- Co-located styling with components
- No context switching between files
- Excellent TypeScript support with `cn()` utility
- Consistent design system through utilities

### Industry Adoption

- **Vercel/Next.js**: Uses this pattern
- **GitHub**: Migrated away from CSS-in-JS to utilities
- **Shopify**: Utility-first approach
- **shadcn/ui**: Built entirely on this pattern

### CSS Variable Management

All CSS custom properties should be defined in `src/index.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    /* ... other variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode overrides */
  }
}
```

This approach ensures:
- Consistent theming across the application
- Easy dark/light mode switching
- Centralized color management
- Compatibility with shadcn/ui components