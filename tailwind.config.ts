import type { Config } from 'tailwindcss';
const colors = require('tailwindcss/colors');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      primary: '#141414',
      secondary: 'rgba(109, 109, 110, 0.7)',
      'header-bg': '#000000',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'scale-in-center': 'scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both',
        'scale-up-center': 'scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both',
        'scale-out-center': 'scale-out-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530)   both',
      },
      keyframes: {
        'scale-up-center': {
          '0%': {
            transform: 'scale(.5)',
          },
          to: {
            transform: 'scale(1)',
          },
        },
        'scale-in-center': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          to: {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'scale-out-center': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          to: {
            transform: 'scale(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
