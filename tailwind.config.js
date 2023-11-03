/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Varela Round',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      boxShadow: {
        'pop-in-shallow':
          '2px 2px 2px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 2px 0px rgba(255, 255, 255, 0.80) inset',
        'pop-in-deep':
          '4px 4px 4px 0px rgba(0, 0, 0, 0.25) inset, -4px -4px 4px 0px rgba(255, 255, 255, 0.80) inset',
        'pop-out-shallow':
          '-2px -2px 4px 0px rgba(255, 255, 255, 0.80), 2px 2px 4px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#31344B',

          secondary: '#E6E7EE',

          accent: '#9eed80',

          neutral: '#E6E7EE',

          'base-100': '#E6E7EE',

          info: '#2D4CC8',

          success: '#18634B',

          warning: '#c26b14',

          error: '#f90b27',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
