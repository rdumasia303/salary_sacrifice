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
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        gridpan: {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '120px 120px, 120px 120px' },
        },
        glowpulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(124,58,237,0.3), 0 0 24px rgba(6,182,212,0.15)' },
          '50%': { boxShadow: '0 0 18px rgba(124,58,237,0.55), 0 0 36px rgba(6,182,212,0.35)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        aurora: 'aurora 20s ease infinite',
        gridpan: 'gridpan 12s linear infinite',
        glowpulse: 'glowpulse 2.4s ease-in-out infinite',
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
