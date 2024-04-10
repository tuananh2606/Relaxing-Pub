import type { Config } from 'tailwindcss';
const colors = require('tailwindcss/colors');
const { withTV } = require('tailwind-variants/transformer');
const { nextui } = require('@nextui-org/react');

const config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/auth/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: '',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      orange: colors.orange,
      amber: colors.amber,
      red: colors.red,
      blue: colors.blue,
      green: colors.green,
      emerald: colors.emerald,
      'header-bg': '#000000',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        '3xl': '1600px',
      },
      colors: {
        'movie-brand-color': 'var(--theme-movie-brand)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
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
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-bottom': 'fade-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 5000ms both',
        'slide-bottom': 'slide-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 5000ms both',
        'scale-in-center': 'scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both',
        'scale-up-center': 'scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both',
        'scale-out-center': 'scale-out-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530)   both',
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
        'search': [
          "sidebar results",
        ],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
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
} satisfies Config;

export default withTV(config);
