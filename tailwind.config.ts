import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * Colours resolve to CSS custom properties (defined in src/app/globals.css),
 * not literal hex — this is what lets us flip a --brand-* variable for
 * seasonal theming or dark mode later without touching every component.
 * The literal values live in src/lib/design-tokens.ts as the documented
 * source of truth; keep the two in sync.
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        forest: 'hsl(var(--color-forest) / <alpha-value>)',
        gold: 'hsl(var(--color-gold) / <alpha-value>)',
        wine: 'hsl(var(--color-wine) / <alpha-value>)',
        ivory: 'hsl(var(--color-ivory) / <alpha-value>)',
        ink: 'hsl(var(--color-ink) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--color-forest) / <alpha-value>)',
          foreground: 'hsl(var(--color-ivory) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-gold) / <alpha-value>)',
          foreground: 'hsl(var(--color-ink) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-wine) / <alpha-value>)',
          foreground: 'hsl(var(--color-ivory) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        utility: ['var(--font-utility)'],
      },
      letterSpacing: {
        // Noir edition: wider caps-tracking — the couture label register.
        utility: '0.14em',
      },
      borderRadius: {
        // Noir edition: sharper corners read more tailored on black.
        sm: '1px',
        DEFAULT: '2px',
        md: '4px',
        lg: '8px',
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
