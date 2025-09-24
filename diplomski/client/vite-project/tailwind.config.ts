import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        textMuted: '#475569',
        primary: '#2563EB',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626'
      },
      borderRadius: {
        '2xl': '1rem',
        'soft': '12px'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08)'
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config;
