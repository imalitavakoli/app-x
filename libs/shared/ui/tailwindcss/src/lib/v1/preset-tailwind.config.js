import {
  scopedPreflightStyles,
  isolateInsideOfContainer,
} from 'tailwindcss-scoped-preflight';
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    colors: {
      eday: {
        lighter: 'rgb(var(--e-day-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-day-color) / <alpha-value>)',
        darker: 'rgb(var(--e-day-darker-color) / <alpha-value>)',
      },
      enight: {
        lighter: 'rgb(var(--e-night-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-night-color) / <alpha-value>)',
        darker: 'rgb(var(--e-night-darker-color) / <alpha-value>)',
      },
      einformative: {
        lighter: 'rgb(var(--e-informative-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-informative-color) / <alpha-value>)',
        darker: 'rgb(var(--e-informative-darker-color) / <alpha-value>)',
      },
      epositive: {
        lighter: 'rgb(var(--e-positive-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-positive-color) / <alpha-value>)',
        darker: 'rgb(var(--e-positive-darker-color) / <alpha-value>)',
      },
      enegative: {
        lighter: 'rgb(var(--e-negative-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-negative-color) / <alpha-value>)',
        darker: 'rgb(var(--e-negative-darker-color) / <alpha-value>)',
      },
      enotice: {
        lighter: 'rgb(var(--e-notice-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-notice-color) / <alpha-value>)',
        darker: 'rgb(var(--e-notice-darker-color) / <alpha-value>)',
      },
      eneutral: {
        lighter: 'rgb(var(--e-neutral-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-neutral-color) / <alpha-value>)',
        darker: 'rgb(var(--e-neutral-darker-color) / <alpha-value>)',
      },
      eprimary: {
        lighter: 'rgb(var(--e-primary-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-primary-color) / <alpha-value>)',
        darker: 'rgb(var(--e-primary-darker-color) / <alpha-value>)',
      },
      eaccent: {
        lighter: 'rgb(var(--e-accent-lighter-color) / <alpha-value>)',
        DEFAULT: 'rgb(var(--e-accent-color) / <alpha-value>)',
        darker: 'rgb(var(--e-accent-darker-color) / <alpha-value>)',
      },

      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['e', ...defaultTheme.fontFamily.sans],
      },
      zIndex: {
        10001: '10001',
      },
    },
  },
  plugins: [
    // https://github.com/tailwindlabs/tailwindcss-forms
    // Available CSS classes:
    // form-input, form-textarea, form-select, form-multiselect, form-checkbox, form-radio
    require('@tailwindcss/forms')({ strategy: 'class' }),

    require('daisyui'),

    // https://github.com/Roman86/tailwindcss-scoped-preflight
    // Read more: https://stackoverflow.com/questions/76615907/how-to-apply-tailwind-styles-only-in-a-certain-element
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('.e-main'),
    }),
  ],
  darkMode: ['class', '.e-dark'],

  // https://daisyui.com/docs/config/
  daisyui: {
    themes: [
      {
        'e-default': {
          primary: '#000000',
          secondary: '#333333',
          accent: '#666666',
          neutral: '#999999',
          'base-100': '#bbbbbb',
          '--border-btn': '0',
        },
      },
    ],
    prefix: '',
    base: false,
    logs: false,
  },
};
