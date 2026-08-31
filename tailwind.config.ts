import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bubble: {
          pink: '#FFD7E5',
          blue: '#C3E5FF',
          purple: '#E5CBFF',
          yellow: '#FFF4C3',
          green: '#D0F5D0',
          peach: '#FFE4D6',
        },
        primary: {
          DEFAULT: '#FF6B9D',
          dark: '#FF5285',
        },
        secondary: '#A78BFA',
        accent: {
          DEFAULT: '#C77DFF',
          purple: '#C77DFF',
          blue: '#60A5FA',
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        serif: ['Fredoka', 'Georgia', 'serif'],
        handwriting: ['var(--font-handwriting)', 'cursive'],
      },
      borderRadius: {
        'bubble': '28px',
        'bubble-lg': '32px',
      },
      boxShadow: {
        'bubble': '0 2px 8px rgba(255, 107, 157, 0.08)',
        'bubble-md': '0 4px 16px rgba(255, 107, 157, 0.12)',
        'bubble-lg': '0 8px 24px rgba(255, 107, 157, 0.16)',
        'bubble-float': '0 12px 32px rgba(255, 107, 157, 0.2)',
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["light"],
    base: false,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
    themeRoot: ":root",
  },
};

export default config;
