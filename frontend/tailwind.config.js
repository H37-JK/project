/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'spinner-fade': 'spinner-fade 1.2s linear infinite',
      },
      keyframes: {
        'spinner-fade': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('@tailwindcss/forms'),
  ],
}