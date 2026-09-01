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
          purple: '#4c1d95', // Roxo marcante do Açaí
          dark: '#2e1065',
          accent: '#16a34a', // Verde para botões de confirmação/WhatsApp
          light: '#f3e8ff'
        }
      }
    },
  },
  plugins: [],
}
