/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19',
          800: '#151C2C',
          700: '#1F293D',
          600: '#2D3A54'
        }
      }
    },
  },
  plugins: [],
}
