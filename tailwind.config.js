/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#eaf0ff',
          200: '#d5e2ff',
          300: '#afc6ff',
          400: '#7ea0ff',
          500: '#5879ff',
          600: '#3a55f6',
          700: '#2d43e0',
          800: '#2638b5',
          900: '#24348f',
        },
      },
    },
  },
  plugins: [],
};
