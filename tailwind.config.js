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
          purple: '#3b0764',      // Roxo Açaí Profundo
          purpleDark: '#2a0547',  // Roxo escuro para cabeçalhos e destaques
          gold: '#d97706',        // Dourado/Âmbar acolhedor
          goldHover: '#b45309',   // Dourado para estado ativo/hover
          goldLight: '#fef3c7',   // Dourado bem suave para fundos de destaque
          bgSoft: '#faf8f5',      // Off-white suave descanso visual
          cardBg: '#ffffff',      // Branco limpo para os cards de produtos
          green: '#16a34a',       // Verde WhatsApp intuitivo
        }
      }
    },
  },
  plugins: [],
}
