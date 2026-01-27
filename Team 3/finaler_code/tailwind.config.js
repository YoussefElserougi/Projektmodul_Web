/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand accents (fallbacks)
        'atolls-yellow': '#F4FF48',
        'atolls-blue': '#6FCDFF',

        // Theme tokens (driven by CSS variables in globals.css)
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        border: 'var(--border)',

        // CTA tokens
        'cta-primary': 'var(--cta-primary)',
        'cta-primary-hover': 'var(--cta-primary-hover)',
        'cta-secondary': 'var(--cta-secondary)',
        'cta-secondary-hover': 'var(--cta-secondary-hover)',
      },
    },
  },
  plugins: [],
}