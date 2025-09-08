/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220, 10%, 95%)',
        accent: 'hsl(150, 70%, 45%)',
        primary: 'hsl(220, 80%, 50%)',
        surface: 'hsl(220, 10%, 100%)',
        'text-primary': 'hsl(220, 15%, 15%)',
        'text-secondary': 'hsl(220, 10%, 40%)',
        // Dark theme colors for the app
        'dark-bg': 'hsl(240, 20%, 8%)',
        'dark-surface': 'hsl(240, 15%, 12%)',
        'purple-primary': 'hsl(260, 70%, 60%)',
        'purple-secondary': 'hsl(280, 60%, 50%)',
        'glass-bg': 'hsla(240, 15%, 12%, 0.8)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(220, 15%, 15%, 0.12)',
        'glass': '0 8px 32px hsla(260, 70%, 60%, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
