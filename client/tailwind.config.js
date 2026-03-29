export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        etOrange: '#FF6B00',
        appBg: '#FFFFFF',
        appBgAlt: '#F8F9FA',
        card: '#FFFFFF',
        border: '#E5E7EB',
        textPrimary: '#111111',
        textSecondary: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bricolage Grotesque', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        navPop: {
          '0%': { transform: 'scale(0.96)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 300ms ease-out both',
        navPop: 'navPop 180ms ease-out both',
      },
    },
  },
  plugins: [],
}
