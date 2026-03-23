/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563EB', // Blue 600
          dark: '#3B82F6',  // Blue 500
          DEFAULT: '#2563EB',
        },
        emerald: {
          500: '#10B981',
          400: '#34D399',
          600: '#059669',
        },
        slate: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        background: {
          light: '#F8FAFC',
          dark: '#020617', // Deeper Slate 950
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a', // Slate 900
        }
      },
      borderRadius: {
        'px': '1px',
        'sm': '2px',
        'md': '4px',
        'lg': '6px', // FinControl Precision Baseline
        'xl': '12px',
        '2xl': '20px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}
