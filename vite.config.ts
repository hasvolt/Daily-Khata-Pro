import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'daily-Khata-Pro.png', 'daily-Khata-Pro.jpg'],
        manifest: {
          name: 'Daily Khata: Pro',
          short_name: 'Khata Pro',
          description: 'Daily Income & Expense Tracker with automated 6-fund money allocation.',
          theme_color: '#101A24',
          background_color: '#05080E',
          display: 'standalone',
          icons: [
            {
              src: 'daily-Khata-Pro.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'daily-Khata-Pro.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'daily-Khata-Pro.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
        },
        devOptions: {
          enabled: process.env.DISABLE_HMR !== 'true'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
