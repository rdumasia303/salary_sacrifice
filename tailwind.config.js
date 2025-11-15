import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        monoTech: ['"Share Tech Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        aurora: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.6' },
        },
        gridpan: {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '120px 120px, 120px 120px' },
        },
        glowpulse: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        aurora: 'aurora 8s ease-in-out infinite',
        gridpan: 'gridpan 20s linear infinite',
        glowpulse: 'glowpulse 3s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-in',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        nocturne: {
          primary: '#7c3aed',
          'primary-content': '#0b0f14',
          secondary: '#06b6d4',
          accent: '#22c55e',
          neutral: '#0b0f14',
          'base-100': '#0b0f14',
          'base-200': '#0e141c',
          'base-300': '#111925',
          'base-content': '#e5e7eb',
          info: '#60a5fa',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
  },
};
