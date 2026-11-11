import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function assetVersionPlugin() {
  return {
    name: 'asset-version-plugin',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const indexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const hashCache = new Map();
      const getHash = (assetPath) => {
        if (hashCache.has(assetPath)) return hashCache.get(assetPath);
        const diskPath = path.join(distDir, assetPath.replace(/^\/+/, ''));
        if (!fs.existsSync(diskPath) || fs.statSync(diskPath).isDirectory()) {
          return null;
        }
        const digest = crypto
          .createHash('sha256')
          .update(fs.readFileSync(diskPath))
          .digest('hex')
          .slice(0, 8);
        hashCache.set(assetPath, digest);
        return digest;
      };

      const manifestPath = path.join(distDir, '.vite', 'manifest.json');
      const viteHashedFiles = new Set();
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          for (const entry of Object.values(manifest)) {
            if (entry?.file) viteHashedFiles.add(`/${entry.file.replace(/^\/+/, '')}`);
            for (const f of entry?.css || []) viteHashedFiles.add(`/${f.replace(/^\/+/, '')}`);
            for (const f of entry?.assets || []) viteHashedFiles.add(`/${f.replace(/^\/+/, '')}`);
          }
        } catch {
          // Ignore malformed manifest and fall back to pattern check
        }
      }

      const html = fs.readFileSync(indexPath, 'utf-8');
      // Append ?v=<sha256_8> to unhashed static stylesheets, scripts, icons, and manifests in /assets/
      // Skip image preloads so they continue to match CSS background-image URLs identically.
      const updated = html.replace(
        /(<(?:link|script)\b[^>]*?\b(?:href|src)=["'])(\/assets\/[^"'?#]+)(["'][^>]*>)/gi,
        (full, prefix, urlPath, suffix) => {
          if (/\bas=["']image["']/i.test(full)) return full;
          if (viteHashedFiles.has(urlPath)) return full;
          const hash = getHash(urlPath);
          if (!hash) return full;
          return `${prefix}${urlPath}?v=${hash}${suffix}`;
        }
      );

      if (updated !== html) {
        fs.writeFileSync(indexPath, updated, 'utf-8');
      }
    }
  };
}

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
  plugins: [react(), dynamicSitemapPlugin(), assetVersionPlugin()],
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
    manifest: true,
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
