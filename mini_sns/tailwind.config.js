/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0ea5e9',
          light: '#e0f2fe',
          dark: '#0284c7',
        }
      },
    },
  },
  plugins: [],
}

