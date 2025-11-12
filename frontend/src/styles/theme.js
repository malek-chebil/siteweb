import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'yellow',
  colors: {
    yellow: [
      '#fffbf0',
      '#fff8e1',
      '#ffecb3',
      '#ffe082',
      '#ffd54f',
      '#FFC300', // Primary
      '#ffb300',
      '#ffa000',
      '#ff8f00',
      '#ff6f00',
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
  defaultRadius: 'md',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.12)',
    xl: '0 20px 30px rgba(0, 0, 0, 0.15)',
  },
  other: {
    transition: 'all 0.2s ease',
  },
  breakpoints: {
    xs: '36em',   // 576px
    sm: '48em',   // 768px
    md: '62em',   // 992px
    lg: '75em',   // 1200px
    xl: '88em',   // 1408px
  },
})

