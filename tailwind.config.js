/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        console: {
          darkest: '#09131f',
          dark: '#0d1b2a',
          surface: 'rgba(16, 32, 50, 0.85)',
          surfaceHover: 'rgba(23, 44, 69, 0.9)',
          border: 'rgba(148, 163, 184, 0.18)',
          amber: '#f59e0b',
          amberDark: '#d97706',
          cyan: '#22d3ee',
          teal: '#14b8a6',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(34, 211, 238, 0.28)',
        'cyan-glow-lg': '0 0 35px rgba(34, 211, 238, 0.4)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.25)',
        'emerald-glow': '0 0 25px rgba(16, 185, 129, 0.35)',
      },
      letterSpacing: {
        'super-wide': '0.18em',
        'wide-track': '0.12em',
      }
    },
  },
  plugins: [],
}
