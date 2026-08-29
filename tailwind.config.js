/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0071e3',
          dark: '#0a0a0c',
          gray: '#86868b',
          light: '#f5f5f7'
        }
      }
    },
  },
  plugins: [],
}
