import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          primary: 'var(--primary)',
          primary2: 'var(--primary-2)',
          accent: 'var(--accent)',
          accentHover: 'var(--accent-hover)',
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          soft: 'var(--surface-soft)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          border: 'var(--border)'
        }
      },
      boxShadow: { app: 'var(--shadow)' }
    }
  },
  plugins: []
} satisfies Config;
