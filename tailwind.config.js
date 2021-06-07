const colors = require('tailwindcss/colors');
const forms = require('@tailwindcss/forms');

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
        'light-blue': colors.lightBlue,
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
      },
      padding: {
        full: '100%',
      },
      fontFamily: {
        'open-sans': 'Open Sans,sans-serif',
      },
    },
  },

  plugins: [forms],
};
