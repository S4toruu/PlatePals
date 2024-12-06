module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    {
      pattern: /(orange|purple|green|blue|grey|black|turquoise|red)/
    }
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',
      blue: '#05b9f0',
      purple: '#7536f0',
      orange: '#ff4200',
      green: '#72bf44',
      red: '#D92D20',
      turquoise: '#19cec0',
      yellow: '#d8f94e',
      'grey-cool-50': '#F9FAFB',
      'grey-cool-100': '#F3F4F6',
      'grey-cool-200': '#E5E7EB',
      'grey-cool-300': '#D1D5DB',
      'grey-cool-400': '#9CA3AF',
      'grey-cool-450': '#6B7280',
      'grey-cool-500': '#5C6371',
      'grey-cool-600': '#4B5563',
      'grey-cool-700': '#374151',
      'grey-cool-800': '#1F2937',
      'grey-cool-900': '#111827',
      'grey-true-50': '#FAFAFA',
      'grey-true-100': '#F5F5F5',
      'grey-true-200': '#E5E5E5',
      'grey-true-300': '#D4D4D4',
      'grey-true-400': '#A3A3A3',
      'grey-true-450': '#737373',
      'grey-true-500': '#616161',
      'grey-true-600': '#525252',
      'grey-true-700': '#404040',
      'grey-true-800': '#262626',
      'grey-true-900': '#171717',
      'grey-warm-50': '#FAFAF9',
      'grey-warm-100': '#F5F5F4',
      'grey-warm-200': '#E7E5E4',
      'grey-warm-300': '#D6D3D1',
      'grey-warm-400': '#A8A29E',
      'grey-warm-500': '#78716C',
      'grey-warm-600': '#57534E',
      'grey-warm-700': '#44403C',
      'grey-warm-800': '#292524',
      'grey-warm-900': '#111827'
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      '2lg': '1152px',
      xl: '1280px',
      '1xl': '1440px',
      '2xl': '1536px'
    },
    fontFamily: {
      quicksand: ['var(--font-quicksand)', 'sans-serif'],
      rubik: ['var(--font-rubik)', 'sans-serif'],
      montserrat: ['var(--font-montserrat)', 'sans-serif']
    },
    fontSize: {
      base: '1.125rem',
      xs: '0.875rem',
      sm: '1rem',
      '6xl': '4rem',
      '5xl': '3rem',
      '4xl': '2.5rem',
      '3xl': '1.875rem',
      '1xl': '1.5rem',
      '2xl': '1.625rem',
      xl: '1.25rem'
    },
    fontWeight: {
      bold: 700,
      600: 600,
      500: 500,
      medium: 400
    },
    borderRadius: {
      none: '0',
      sm: '8px',
      md: '20px',
      lg: '100px',
      full: '9999px'
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      }
    },
    extend: {
      spacing: {
        68: '4.25rem',
        footer: '33.75rem'
      },
      margin: {
        auto: 'auto'
      },
      zIndex: {
        '-1': '-1'
      },
      maxWidth: {
        logo: '9.375rem',
        'logo-xs': '2.75rem',
        'icon-xs': '0.813rem',
        1920: '120rem'
      },
      maxHeight: {
        'half-screen': '50vh'
      },
      width: {
        110: '45rem',
        'circle-svg': '135px'
      },
      strokeWidth: {
        3: '3',
        4: '4',
        5: '5'
      },
      backgroundPosition: {
        'banner-desktop': '90% center'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
}
