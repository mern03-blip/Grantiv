// /** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class', // from your old config
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Add all your source file paths here
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: '#A8DD6B',
        secondary: '#8CC84B',
        night: '#121212',
        mercury: '#E2DFDE',
        alabaster: '#FAFCF5',
        mainColor: "#8CC84B",
        bgColor: "#F7F7F7",
        dark: {
          background: '#181a1b',
          surface: '#242628',
          primary: '#A8DD6B',
          secondary: '#8CC84B',
          text: '#e2e2e2',
          textMuted: '#9e9e9e',
          border: '#3a3d40',
        },
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px #A8DD6B)' },
          '50%': { filter: 'drop-shadow(0 0 10px #A8DD6B)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      fontSize: {
        h1: "26px",
        h2: "24px",
        h3: "20px",
        h4: "16px",
        h6: "12px",
        text1: "14px",
        text2: "10px",
        text3: "28px",
      },
      fontWeight: {
        b4: "400",
        b5: "500",
        b6: "600",
        b7: "700",
        b8: "800",
      },
      borderRadius: {
        custom: "10px",
      },
      borderColor: {
        custom: "#DBDBDB",
      },
    },
  },
  plugins: [],
}