// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
    './data/**/*.md',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        // sans: ['var(--font-space-grotesk)', ...fontFamily.sans],
        sans: [
          '"IBM Plex Mono"',
          'monospace',
          // 'Helvetica',
          // 'InterVariable',
          ...fontFamily.sans,
        ],
      },
      colors: {
        // primary: colors.pink,
        // gray: colors.gray,
        primary: colors.cyan,
        secondary: colors.indigo,
        gray: colors.neutral,
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.sky.950'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')} !important`,
              },
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              fontWeight: '700',
              fontSize: '1.50em',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.sky.950'),
            },
            h2: {
              fontWeight: '700',
              fontSize: '1.25em',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.sky.950'),
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.125em',
              letterSpacing: theme('letterSpacing.tight'),
              color: theme('colors.sky.950'),
            },
            'h4,h5,h6': {
              color: theme('colors.sky.950'),
            },
            p: {
              letterSpacing: theme('letterSpacing.tight'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
            },
            code: {
              color: theme('colors.pink.500'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
              lineHeight: 1.2,
              whiteSpace: 'pre',
            },
            '.code-line': {
              paddingLeft: '2rem',
              counterIncrement: 'line-number',
            },
            '.code-line::before': {
              content: 'counter(line-number)',
              left: 0,
              width: '2rem',
              paddingRight: '0.5rem',
              textAlign: 'right',
              color: theme('colors.gray.500'), //appropriate color for dark mode if needed
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            details: {
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            hr: { borderColor: theme('colors.gray.200') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.gray.500'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.gray.500'),
            },
            strong: { color: theme('colors.gray.600') },
            blockquote: {
              color: theme('colors.gray.900'),
              borderLeftColor: theme('colors.gray.200'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')} !important`,
              },
              code: { color: theme('colors.primary.400') },
            },
            h1: {
              color: theme('colors.gray.300'),
            },
            h2: {
              color: theme('colors.gray.300'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.300'),
            },
            'h4,h5,h6': {
              color: theme('colors.gray.300'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
            },
            details: {
              backgroundColor: theme('colors.gray.800'),
            },
            hr: { borderColor: theme('colors.gray.700') },
            'ol li::marker': {
              fontWeight: '600',
              color: theme('colors.gray.400'),
            },
            'ul li::marker': {
              backgroundColor: theme('colors.gray.400'),
            },
            strong: { color: theme('colors.gray.300') },
            thead: {
              th: {
                color: theme('colors.gray.300'),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700'),
              },
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
