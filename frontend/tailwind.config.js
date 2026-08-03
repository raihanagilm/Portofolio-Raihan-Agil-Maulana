/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003ec7',
        'primary-container': '#0052ff',
        'primary-fixed': '#dde1ff',
        'on-primary': '#ffffff',
        'on-primary-container': '#dfe3ff',

        secondary: '#505f76',
        'secondary-container': '#d0e1fb',
        'on-secondary-container': '#54647a',

        tertiary: '#4b4e50',

        background: '#faf8ff',
        surface: '#faf8ff',
        'surface-bright': '#faf8ff',
        'surface-container': '#eaedff',
        'surface-container-low': '#f2f3ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e2e7ff',
        'surface-variant': '#dae2fd',

        'on-background': '#131b2e',
        'on-surface': '#131b2e',
        'on-surface-variant': '#434656',

        outline: '#737688',
        'outline-variant': '#c3c5d9',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
      },
    },
  },
  plugins: [],
}
