const colors = require('tailwindcss/colors');
const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  mode: 'jit',
  darkMode: 'class', // 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        'true-gray': colors.trueGray,
        blue: colors.blue,
        sky: colors.sky,
        red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        yellow: colors.yellow,
        green: colors.green,
      },
      zIndex: {
        1: '1',
      },
      letterSpacing: {
        logo: '0.2em',
      },
      inset: {
        '4/5': '80%',
      },
      maxWidth: {
        64: '16rem',
      },
      spacing: {
        10.5: '2.625rem',
        30: '7.5rem',
      },
      padding: {
        full: '100%',
      },
      fontFamily: {
        'open-sans': 'Open Sans,sans-serif',
      },
      boxShadow: {
        'bottom-nav': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [forms, lineClamp],
};
