// prettier-ignore
import type { Config } from 'tailwindcss';
const colors = require('tailwindcss/colors');
const { withTV } = require('tailwind-variants/transformer');
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      orange: colors.orange,
      amber: colors.amber,
      'header-bg': '#000000',
    },
    extend: {
      colors: {
        'movie-brand-color': 'var(--theme-movie-brand)',
      },
      // prettier-ignore
      gridTemplateAreas: {
        'details-mobile': [
          "poster title",
          "poster title",
          "info info",
          "buttons buttons",
        ],
        'details': [
          "poster title",
          "poster info",
          "poster buttons",
        ],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-bottom': 'fade-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 5000ms both',
        'slide-bottom': 'slide-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 5000ms both',
        'scale-in-center': 'scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both',
        'scale-up-center': 'scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both',
        'scale-out-center': 'scale-out-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530)   both',
      },
      keyframes: {
        'fade-bottom': {
          '0%': {
            display: 'grid',
            'grid-template-rows': '1fr',
          },
          to: {
            display: 'grid',
            'grid-template-rows': '0fr',
          },
        },
        'slide-bottom': {
          '0%': {
            transform: 'translateY(0)',
          },
          to: {
            transform: 'translateY(100px)',
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
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#FAF3E1',
            foreground: '#F5E7C6',
            secondary: '#FF6D1F',
            primary: {
              50: '#3B096C',
              100: '#1D2125',
              200: '#22272B',
              300: '#2C333A',
              400: '#454F59',
              500: '#596773',
              600: '#738496',
              700: '#8C9BAB',
              800: '#9FADBC',
              900: '#B6C2CF',
              DEFAULT: '#222222',
              foreground: '#ffffff',
            },
            focus: '#222222',
          },
        },
        dark: {
          colors: {
            background: '#221F1F',
            foreground: '#F5F5F1',
            secondary: '#B81D24',
            primary: {
              50: '#3B096C',
              100: '#1D2125',
              200: '#22272B',
              300: '#2C333A',
              400: '#454F59',
              500: '#596773',
              600: '#738496',
              700: '#8C9BAB',
              800: '#9FADBC',
              900: '#B6C2CF',
              DEFAULT: '#E50914',
              foreground: '#ffffff',
            },
            focus: '#ffffff',
          },
        },
      },
    }),
    require('tailwindcss-animate'),
    require('@savvywombat/tailwindcss-grid-areas'),
  ],
};
export default withTV(config);
