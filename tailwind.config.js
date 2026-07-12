/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'paper': '#FDFBF7',
        'grid-line': '#E0E8F0',
        'magic-red': '#FF4A4A',
        'hand-black': '#000000',
      },
      fontFamily: {
        'hand': ['Georgia', 'serif'],
        'body': ['system-ui', 'sans-serif'],
      },
      boxShadow: {
        'hand-drawn': '4px 4px 0px 0px rgba(0,0,0,1)',
        'hand-drawn-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      animation: {
        'shake': 'shake 0.5s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'ink-spread': 'ink-spread 1s ease-out forwards',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '50%': { transform: 'translateX(2px) rotate(1deg)' },
          '75%': { transform: 'translateX(-1px) rotate(-0.5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 74, 74, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 74, 74, 0.8)' },
        },
        'ink-spread': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.5)' },
        },
      },
    },
  },
  plugins: [],
};
