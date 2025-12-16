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
          pink: '#FFD1DC',    // Blush Pink
          lavender: '#E6E6FA', // Lavender
          peach: '#FFDAB9',    // Peach
          cream: '#FFFDD0',    // Cream
          dark: '#4A4A4A',     // Dark Gray for text
          light: '#F9F9F9',    // Off-white background
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
