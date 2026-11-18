/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FAF9F6', // Warm alabaster / ivory
          dark: '#0B0F17',  // Deep obsidian slate
        },
        surface: {
          light: '#FFFFFF',
          'light-subtle': '#F4F3EF',
          dark: '#121824',
          'dark-subtle': '#182132',
        },
        oxford: {
          DEFAULT: '#0F2537',
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          500: '#0F2537',
          600: '#0B1D2C',
          800: '#07131D',
          900: '#040B10',
        },
        emerald: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
          subtle: '#E8F5E9',
          'subtle-dark': '#0E291E',
        },
        amber: {
          DEFAULT: '#D97706',
          subtle: '#FEF3C7',
          'subtle-dark': '#2E1E05',
        },
        crimson: {
          DEFAULT: '#DC2626',
          subtle: '#FEE2E2',
          'subtle-dark': '#310C0C',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
