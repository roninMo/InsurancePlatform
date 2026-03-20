const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'fade-in-slow': 'fade-in 0.64s ease-out forwards',
        'fade-out': 'fade-out 0.3s ease-in forwards'
        
      },
      keyframes: {
        'fade-in':      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-in-slow': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-out':     { '0%': { opacity: '1' }, '100%': { opacity: '0' } }
      }
    },
  },
  plugins: [],
};
