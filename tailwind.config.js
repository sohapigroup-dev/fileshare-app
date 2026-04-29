/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f2f5',
          100: '#d9dde6',
          200: '#b3bcd0',
          300: '#8090b0',
          400: '#566690',
          500: '#3d5070',
          600: '#2E3A52',
          700: '#243044',
          800: '#1a2336',
          900: '#101520',
        },
        brand: {
          blue: '#4285F4',
          green: '#34A853',
          orange: '#FBBC04',
          red: '#EA4335',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}