# Production Server & SPA Routing Deployment Guide

## Why Direct URL Access (e.g. `/login`, `/events`, `/admin`) Returns 404 on Live Web Servers

When you build a React Single Page Application (SPA), all routing is handled client-side in the browser by React Router (`src/app/router.jsx`).

When a visitor opens `https://ellangala.com/` and clicks links inside the app, client-side routing works seamlessly.

However, when a user accesses `https://ellangala.com/login` directly or refreshes their browser on `/login`, the live web server looks for a physical directory named `/login/index.html` on the server disk. Since `/login` is a client-side React route and not a physical folder, the web server returns a **404 Not Found error** unless configured to fallback non-file requests to `/index.html`.

---

## Solutions Provided in Source Code

The project source code has been updated with automatic fallback configuration files in `public/`:

1. **`public/_redirects`**: Automatically copied to `dist/_redirects` during `npm run build`. Solves 404s on Netlify, Vercel, and Cloudflare Pages.
2. **`public/.htaccess`**: Automatically copied to `dist/.htaccess` during `npm run build`. Solves 404s on Apache, cPanel, and Namecheap / Shared Hosting.

---

## Server-Specific Setup Instructions

### 1. Nginx (VPS / AWS EC2 / DigitalOcean)
Add `try_files $uri $uri/ /index.html;` inside your Nginx server block:

```nginx
server {
    listen 80;
    server_name ellangala.com www.ellangala.com;
    root /var/www/ellangala/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /sitemap.xml {
        proxy_pass http://localhost:5001/sitemap.xml;
    }
}
```

### 2. Node / Express Production Server (`server/index.js`)
If running the Express server directly via Node (`node server/index.js` or `pm2 start server/index.js`), SPA routing fallback is built in:
```bash
npm run build
node server/index.js
```
The server serves `dist/` and proxies all unknown routes to `dist/index.html`.

### 3. cPanel / Apache / Shared Hosting
1. Upload all contents of the `dist/` folder to your server's `public_html/` folder.
2. Make sure `.htaccess` is present in `public_html/` (it is automatically built into `dist/.htaccess`).

---

## Database (MySQL)
The server stores events, blogs, orders, enrollments, and contact messages in MySQL (`server/db/`). Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (see `.env.example`). On first boot the server creates its tables if they don't exist (`server/db/schema.sql`) and seeds events/blogs from the site's static content — no manual migration step needed.

## Admin Credentials
- **URL**: `https://ellangala.com/login`
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars before starting the server (see `.env.example`). The server refuses to start without them — there is no default password baked into the code.
