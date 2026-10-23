/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#00F0FF',
          indigo: '#6366F1',
          purple: '#8B5CF6',
          teal: '#14B8A6',
          darkBg: '#090D1A',
          darkSurface: '#0E1426',
          darkCard: '#131A2E',
          lightBg: '#F8FAFC',
          lightSurface: '#FFFFFF',
          lightCard: '#FFFFFF'
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.35)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.35)',
      }
    },
  },
  plugins: [],
}
