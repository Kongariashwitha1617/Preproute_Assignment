/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#F8FAFC',
        primary: {
          DEFAULT: '#5A8DEE',
          50: '#EBF2FE',
          100: '#D6E4FD',
          200: '#B3CDFB',
          300: '#8BB4F8',
          400: '#6E9FF5',
          500: '#5A8DEE',
          600: '#4A7DE8',
          700: '#3B6AD4',
          800: '#2F56B0',
          900: '#1E3A8A',
        },
        navy: {
          DEFAULT: '#1E1B4B',
        },
        teal: {
          badge: '#14B8A6',
        },
        amber: {
          badge: '#FEF3C7',
          text: '#92400E',
        },
      },
      borderRadius: {
        figma: '6px',
      },
      boxShadow: {
        card: 'none',
        tab: '0 1px 2px rgb(94 140 240 / 0.12)',
        'tab-active': '0 0 0 1px rgb(90 141 238 / 0.25), 0 2px 8px rgb(90 141 238 / 0.12)',
        modal: '0 20px 40px rgb(15 23 42 / 0.12)',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};
