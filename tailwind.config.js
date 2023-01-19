/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      base: {
        100: 'hsl(270deg, 10%, 20%)',
        200: 'hsl(270deg, 10%, 16%)',
        300: 'hsl(270deg, 10%, 12%)',
        content: 'hsl(270deg, 10%, 79%)'
      },
      primary: {
        DEFAULT: 'hsl(158deg, 64%, 32%)',
        focus: 'hsl(158deg, 64%, 28%)',
        content: 'hsl(158deg, 64%, 100%)'
      },
      secondary: {
        DEFAULT: 'hsl(198deg, 64%, 32%)',
        focus: 'hsl(198deg, 64%, 28%)',
        content: 'hsl(198deg, 64%, 100%)'
      },
      error: {
        DEFAULT: 'hsl(5deg, 91%, 67%)',
        focus: 'hsl(5deg, 91%, 63%)',
        content: 'hsl(5deg, 91%, 20%)'
      },
      current: 'currentColor',
      transparent: 'transparent'
    },
    extend: {}
  },
  plugins: []
}
