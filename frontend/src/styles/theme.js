import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'yellow',
  colors: {
    // Warm, earthy color palette matching background image
    yellow: [
      '#fff9e6',
      '#fff3cc',
      '#ffe8a3',
      '#ffd966',
      '#ffcc33',
      '#FFB84D', // Primary - warmer, more earthy
      '#ffa733',
      '#ff9919',
      '#e67e00',
      '#cc6600',
    ],
    // Earthy accent colors
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd1a3',
      '#ffba66',
      '#ffa333',
      '#ff8c00', // Warm orange accent
      '#e67e00',
      '#cc7000',
      '#b36200',
      '#995400',
    ],
    // Warm brown/terracotta
    brown: [
      '#f5ebe0',
      '#ead6c7',
      '#d4b29a',
      '#be8e6d',
      '#a86a40',
      '#8B4513', // Warm brown
      '#7a3d10',
      '#69350d',
      '#582d0a',
      '#472507',
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 700,
    sizes: {
      h1: { fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: '1.2' },
      h2: { fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: '1.3' },
      h3: { fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: '1.4' },
      h4: { fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', lineHeight: '1.4' },
      h5: { fontSize: '1.25rem', lineHeight: '1.5' },
      h6: { fontSize: '1rem', lineHeight: '1.5' },
    },
  },
  defaultRadius: 'lg',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    xs: '0 2px 4px rgba(139, 69, 19, 0.08)',
    sm: '0 4px 8px rgba(139, 69, 19, 0.12)',
    md: '0 8px 16px rgba(139, 69, 19, 0.15)',
    lg: '0 16px 32px rgba(139, 69, 19, 0.18)',
    xl: '0 24px 48px rgba(139, 69, 19, 0.20)',
  },
  other: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breakpoints: {
    xs: '36em',   // 576px
    sm: '48em',   // 768px
    md: '62em',   // 992px
    lg: '75em',   // 1200px
    xl: '88em',   // 1408px
  },
})

