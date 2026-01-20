/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        success: '#10B981',
        background: '#F9FAFB',
        'background-secondary': '#F3F4F6',
        'text-primary': '#1F2937',
      },
    },
  },
  plugins: [],
}
