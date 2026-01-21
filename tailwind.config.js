/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ashvi: {
          pink: '#BE185D',    // Vibrant Rose (Accent) - Visible text/buttons
          soft: '#FCE7F3',     // Light Pink Tint (Backgrounds)
          lavender: '#FAE8FF', // Soft Purple
          peach: '#FFDAB9',    // Peach
          cream: '#FFFDD0',    // Cream
          dark: '#831843',     // Deep Wine/Magenta (Logo Main Color)
          light: '#FFF1F2',    // Very Light Rose background
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
