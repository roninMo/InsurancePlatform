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
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-in-slow': 'fade-in 0.64s ease-out forwards',
        'fade-out': 'fade-out 0.3s ease-in forwards',

        'fill-bar': 'fill-bar 1.25s ease-in forwards',
        'loading-bar': 'loading-bar 1.25s ease-in-out infinite',

        'skeleton-bg': 'skeleton-bg 1.25s ease-in-out infinite',
        'skeleton-bg-dark': 'skeleton-bg-dark 1.25s ease-in-out infinite',

        'skeleton-bar': 'skeleton-bar 1.25 ease-in-out infinite',
        'skeleton-bar-dark': 'skeleton-bar-dark 1.25 ease-in-out infinite',

        'skeleton-text': 'skeleton-text 1.25s ease-in-out infinite',
        'skeleton-text-dark': 'skeleton-text-dark 1.25s ease-in-out infinite',
      },


      keyframes: {
        'fade-in':      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-in-slow': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-out':     { '0%': { opacity: '1' }, '100%': { opacity: '0' } },

        'fill-bar': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(150%)' } }, // w-2/3
        'loading-bar': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(150%)' } }, // w-2/3
        
        'skeleton-bg': {
          '0%, 100%': { background: '#1e293b' }, // slate-800 (darker)
          '50%': { background: '#94a3b8' },      // slate-400 (lighter)
        },
        'skeleton-bg-dark': {
          '0%, 100%': { background: '#475569' }, // slate-600 (darker)
          '50%': { background: '#94a3b8' },      // slate-400 (lighter)
        },
        
        'skeleton-bar': { 
          '0%': { borderBottom: '#1e293b', transform: 'translateX(-100%)' }, // slate-800 (darker)
          '50%': { borderBottom: '#94a3b8' },      // slate-400 (lighter)
          '100%': {  borderBottom: '#1e293b', transform: 'translateX(150%)' }
        },
        'skeleton-bar-dark': { 
          '0%, 100%': { borderBottom: '#475569' }, // slate-800 (darker)
          '50%': { borderBottom: '#94a3b8' },      // slate-400 (lighter)
          '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(150%)' }
        },
        
        'skeleton-text': {
          '0%, 100%': { color: '#1e293b' }, // slate-800 (darker)
          '50%': { color: '#94a3b8' },      // slate-400 (lighter)
        },
        'skeleton-text-dark': {
          '0%, 100%': { color: '#475569' }, // slate-600 (darker)
          '50%': { color: '#94a3b8' },      // slate-400 (lighter)
        }
        
      }
    },
  },
  plugins: [],
};
