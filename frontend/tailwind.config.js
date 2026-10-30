/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // vibrant indigo
          hover: '#4338ca',
          soft: '#eef2ff',
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#06b6d4',
          soft: '#ecfeff'
        },
        success: {
          DEFAULT: '#10b981',
          soft: '#ecfdf5'
        },
        warning: {
          DEFAULT: '#f59e0b',
          soft: '#fffbeb'
        },
        destructive: {
          DEFAULT: '#ef4444',
          soft: '#fef2f2'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Manrope"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
