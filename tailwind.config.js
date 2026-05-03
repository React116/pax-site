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
          navy:    '#001F54',
          navyDeep:'#0a192f',
          blue:    '#2563EB',
          cyan:    '#06b6d4',
          slate:   '#0f172a',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'sans-serif'],
        code:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card-hover': '0 20px 60px rgba(37, 99, 235, 0.12)',
        'terminal':   '0 40px 80px -20px rgba(0,0,0,0.5)',
        'float':      '0 8px 32px rgba(0,0,0,0.12)',
        'glow-blue':  '0 0 30px rgba(37, 99, 235, 0.35)',
        'glow-teal':  '0 0 30px rgba(20, 184, 166, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
