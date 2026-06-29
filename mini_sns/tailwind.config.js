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
          primary: '#6366f1',
          light: '#ede9fe',
          dark: '#4f46e5',
        }
      },
    },
  },
  plugins: [],
}

