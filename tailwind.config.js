/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          hover: '#f1f5f9',
          emerald: '#059669', // Primary accent
          emeraldLight: '#ecfdf5',
          emeraldDark: '#047857',
          blue: '#0284c7',    // Info accent
          blueLight: '#f0f9ff',
          amber: '#d97706',   // Warning accent
          amberLight: '#fffbeb',
          dark: '#0f172a',
          text: '#334155',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}

