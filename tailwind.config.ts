import flowBitePlugin from 'flowbite/plugin';
import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';

const customPlugin = plugin(({ addComponents, theme }) => {
  addComponents({
    '.scrollbar': {
      scrollbarColor: `${theme('colors.grey-2')} transparent`,
      scrollbarWidth: 'auto',
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
        borderRadius: theme('spacing.2'),
      },
      '&::-webkit-scrollbar': {
        width: theme('spacing.2'),
        height: theme('spacing.2'),
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: theme('spacing.2'),
        backgroundColor: theme('colors.grey-2'),
        width: theme('spacing.2'),
        height: theme('spacing.2'),
      },
    },
  });
});

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1559DD',
        'primary-hover': '#083B9F',
        white: '#FFFFFF',
        background: '#E7E3E0',
        grey: {
          1: '#EDEFF1',
          2: '#DDE0E4',
          3: '#C6CBD2',
          4: '#757A82',
        },
        black: '#17191C',
        success: '#3E8D2B',
        warning: '#F59432',
        alert: '#F53E32',
        'text-gray-900': '#17191C',
      },
      fontSize: {
        '2xl': [
          '1.5rem',
          {
            fontWeight: 500,
          },
        ],
        xl: '1.25rem',
        lg: ['1.125rem', '150%'],
        base: ['1rem', '150%'],
        sm: ['0.875rem', '150%'],
      },
      spacing: {
        '19': '4.75rem',
      },
    },
  },
  plugins: [flowBitePlugin, customPlugin],
};

export default config;
