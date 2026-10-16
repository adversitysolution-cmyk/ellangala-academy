import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function dynamicSitemapPlugin() {
  return {
    name: 'dynamic-sitemap-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/sitemap.xml') {
          // Loaded lazily (only on an actual /sitemap.xml dev request) so a
          // plain `vite build` never needs a live DB connection just to load this config.
          const { ensureSchema } = await import('./server/db/store.js');
          const { getDynamicSitemapXml } = await import('./server/lib/sitemapGenerator.js');
          await ensureSchema();
          const xml = await getDynamicSitemapXml();
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
          res.statusCode = 200;
          return res.end(xml);
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), dynamicSitemapPlugin()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/xlsx')) return 'vendor-xlsx';
          if (id.includes('node_modules/pdf-lib') || id.includes('node_modules/@pdf-lib') || id.includes('node_modules/pdfkit')) return 'vendor-pdf';
          if (id.includes('node_modules/react-quill-new') || id.includes('node_modules/quill')) return 'vendor-quill';
          if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router') || id.includes('node_modules/react-helmet-async')) return 'vendor-react-core';
        }
      }
    }
  },
});
