/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        blue: {
          50:  '#e0f2fe',
          100: '#bae6fd',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        green: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#065f46',
        },
        surface: '#ffffff',
        bg:     '#f8fafc',
        border: '#e2e8f0',
        text:   '#0f172a',
        muted:  '#64748b',
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(14, 165, 233, 0.1)',
        'card-hover': '0 8px 32px -8px rgba(14, 165, 233, 0.2)',
      },
    },
  },
  plugins: [],
}
