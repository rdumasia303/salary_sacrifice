import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // Read from process.env so CI can inject BASE_PATH
  const raw = process.env.BASE_PATH || '/';
  let base = raw;
  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;

  return {
    plugins: [react()],
    base,
  };
});
