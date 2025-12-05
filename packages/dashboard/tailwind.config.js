/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0f172a',
        hunter: '#8b5cf6', // Violet
        broker: '#f59e0b', // Amber
        surgeon: '#dc2626', // Crimson
        brain: '#10b981', // Emerald
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'sans-serif'],
        display: ['Stack Sans Notch', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        bitcount: ['Bitcount Prop Single', 'system-ui'],
      },
    },
  },
  plugins: [],
}
