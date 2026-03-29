export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        etOrange: '#FF6B00',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,107,0,0.35), 0 10px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
