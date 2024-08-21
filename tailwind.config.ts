// tailwind.config.ts
import type { Config } from 'tailwindcss'

const { nextui } = require("@nextui-org/react");

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily:{
      sans:['"Inter"', "-apple-system", "BlinkMacSystemFont", '"San Francisco"', '"Segoe UI"', "Roboto", '"Helvetica Neue"', "sans-serif"]
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
      border: '0px 1px 3px 0px rgba(63, 63, 68, 0.15), 0px 0px 0px 1px rgba(63, 63, 68, 0.05)',
    },
    fontWeight: {
      normal: '450',
      medium: '550',
      semibold: '650',
      bold: '750',
    },
    extend: {
      colors: {
        'subdued': '#616161',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    layout: {
      radius: {
        small: "4px", // rounded-small
        medium: "6px", // rounded-medium
        large: "8px", // rounded-large
      },

    },
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#FF5924",
          },
          danger: {
            DEFAULT: "#e51c00",
          },
        }
      },
    }
  })],
} satisfies Config
