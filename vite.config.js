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
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
