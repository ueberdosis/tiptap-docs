import type { Config } from 'tailwindcss'
import { PluginCreator } from 'tailwindcss/types/config'

const containerPlugin: PluginCreator = ({ addComponents }) => {
  addComponents({
    '.container': {
      maxWidth: '86.25rem',
      width: '100%',
      paddingLeft: '0.625rem',
      paddingRight: '0.625rem',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  })
}

const gradientText: PluginCreator = ({ addUtilities }) => {
  addUtilities({
    '.gradient-text': {
      background: 'linear-gradient(90deg, #73F 0%, #976BB5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  })
}

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#0D0D0D',
        warmGray: '#F5F4F4',
        gray: {
          50: '#FAF9F9',
          100: '#F5F4F4',
          200: '#E7E5E4',
          300: '#CECCCA',
          400: '#9B9997',
          500: '#747270',
          600: '#545251',
          700: '#42403E',
          800: '#201E1D',
          900: '#151413',
          950: '#0C0A09',
          DEFAULT: '#747270',
        },
        grayAlpha: {
          50: 'rgba(118, 65, 30, 0.03)',
          100: 'rgba(61, 37, 20, 0.05)',
          200: 'rgba(38, 23, 13, 0.11)',
          300: 'rgba(3, 3, 2, 0.2)',
          400: 'rgba(29, 25, 22, .45)',
          500: 'rgba(28, 25, 23, .62)',
          600: 'rgba(28, 25, 23, .75)',
          700: 'rgba(28, 25, 23, .83)',
          800: 'rgba(28, 25, 23, .95)',
          900: 'rgba(28, 25, 23, 1)',
          DEFAULT: 'rgba(28, 25, 23, .62)',
        },
        whiteAlpha: {
          50: 'rgba(253, 252, 252, .08)',
          100: 'rgba(253, 252, 252, .1)',
          200: 'rgba(253, 252, 252, .15)',
          300: 'rgba(253, 252, 252, .22)',
          400: 'rgba(253, 252, 252, .3)',
          500: 'rgba(253, 252, 252, .43)',
          600: 'rgba(253, 252, 252, .59)',
          700: 'rgba(253, 252, 252, .8)',
          800: 'rgba(253, 252, 252, .95)',
          900: 'rgba(253, 252, 252, 1)',
          DEFAULT: 'rgba(253, 252, 252, .43)',
        },
        blue: {
          50: '#E9E6FE',
          100: '#D2CEFD',
          200: '#BCB5FD',
          300: '#A69CFC',
          400: '#796BFA',
          500: '#4C39F9',
          600: '#2008F7',
          700: '#1906C6',
          800: '#130594',
          900: '#0D0363',
          DEFAULT: '#4C39F9',
        },
        purple: {
          50: '#F1E6FF',
          100: '#E2CCFF',
          200: '#D4B3FF',
          300: '#C599FF',
          400: '#A866FF',
          500: '#8B33FF',
          600: '#6F00FF',
          700: '#5800CC',
          800: '#420099',
          900: '#2C0066',
          DEFAULT: '#8B33FF',
        },
        purpleAlpha: {
          800: '#3D0099',
          500: '#5500FF80',
          50: '#5800FF10',
        },
        green: {
          50: '#E7FEF4',
          100: '#CFFCE9',
          200: '#B6FBDD',
          300: '#9EFAD2',
          400: '#6EF7BC',
          500: '#3DF5A5',
          600: '#0DF28F',
          700: '#0BDA81',
          800: '#0AC272',
          900: '#089156',
          DEFAULT: '#3DF5A5',
        },
        lime: {
          50: '#ECFBE9',
          100: '#DAF7D4',
          200: '#B4F0AB',
          300: '#8FE87D',
          400: '#69E052',
          500: '#44D926',
          600: '#36AD1F',
          700: '#298217',
          DEFAULT: '#44D926',
        },
        red: {
          50: '#FFEBE5',
          100: '#FFD6CC',
          200: '#FFC2B2',
          300: '#FFAD99',
          400: '#FF8566',
          500: '#FF5C33',
          600: '#FF3300',
          700: '#CC2900',
          800: '#B22400',
          900: '#7F1A00',
          DEFAULT: '#FF5C33',
        },
        code: {
          blue: '#789DEB',
          cyan: '#53CCFF',
          green: '#A6E684',
          orange: '#E3AD6D',
          purple: '#B56AE7',
          red: '#E36D74',
          text: '#EEFFFF',
        },
      },
      fontSize: {
        labelSm: ['0.6875rem', '120%'],
        label: ['0.75rem', '120%'],
        buttonSm: ['0.75rem', '110%'],
        button: ['0.875rem', '110%'],
        formDescription: ['0.75rem', '140%'],
      },
      fontFamily: {
        sans: [
          'Inter',
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
        deco: [
          'PolySans',
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
        serif: ['PP Cirka', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: [
          'Jetbrains Mono NL',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      boxShadow: {
        slim: '0px 1px 0px 0px rgba(0, 0, 0, 0.08)',
        cardLight:
          '0px 0.543px 1.495px 0px rgba(0, 0, 0, 0.02), 0px 1.503px 4.132px 0px rgba(0, 0, 0, 0.03), 0px 3.618px 9.949px 0px rgba(0, 0, 0, 0.04), 0px 12px 20px 0px rgba(0, 0, 0, 0.00)',
        cardHover:
          '0px 12px 33px 0px rgba(0, 0, 0, 0.06), 0px 3.618px 9.949px 0px rgba(0, 0, 0, 0.04), 0px 1.503px 4.132px 0px rgba(0, 0, 0, 0.03), 0px 0.543px 1.495px 0px rgba(0, 0, 0, 0.02)',
      },
      borderRadius: {
        pilled: '0.875rem',
      },
      height: {
        '124': '40rem',
      },
    },
  },
  plugins: [
    containerPlugin,
    gradientText,
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
export default config
