/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#2a0a38', // Dark purple replacement for black
        primary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d5dde9',
          300: '#b1c2d6',
          400: '#86a1bf',
          500: '#6784a9',
          600: '#526a8e',
          700: '#435674',
          800: '#3a4961',
          900: '#343f52',
          950: '#222935',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
