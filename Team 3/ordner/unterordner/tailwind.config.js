/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'atolls-yellow': '#F4FF48',
        'atolls-dark': '#252525',
        'atolls-orange': '#FF804D',
        'atolls-blue': '#6FCDFF',
      },
    },
  },
  plugins: [],
}