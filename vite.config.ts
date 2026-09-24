import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router',
        'react-router-dom',
        'lucide-react',
        'motion/react',
        'canvas-confetti',
        'recharts'
      ],
    },
    build: {
      chunkSizeWarningLimit: 1500,
      sourcemap: false,
      target: 'es2022',
      rollupOptions: {
        cache: false,
        external: ['express', 'path', 'fs', 'sanity', 'sanity/structure', '@sanity/vision'],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/sanity') || id.includes('node_modules/@sanity')) {
              return 'sanity-vendor';
            }
            if (id.includes('node_modules/recharts')) {
              return 'recharts-vendor';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'lucide-vendor';
            }
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
              return 'react-vendor';
            }
          },
        },
      }
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
