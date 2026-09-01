# Pointing a domain at the app

The Express server (`server/index.js`) already serves everything: the built
`dist/` SPA, `/api`, `/uploads`, `/sitemap.xml`, and the SPA fallback. So the
web server in front only has to **reverse-proxy the whole domain to
`localhost:5001`** — no static-file config, no `.htaccess` proxying.

Current state (2026-09): the VPS runs LiteSpeed + WordPress on 80/443 and the
Node app on :5001 with nothing routing to it. `ellangala.com` DNS points at the
Hostinger WordPress stack.

## Recommended: use a subdomain, leave WordPress alone

Lowest risk. In Hostinger hPanel → DNS, add:

```
Type  Name   Value              TTL
A     app    <VPS_IP>           300
```

Then on the VPS create a vhost for `app.ellangala.com` that proxies to :5001,
issue a cert, done. WordPress on the apex is untouched.

### nginx

```nginx
server {
    listen 80;
    server_name app.ellangala.com;

    client_max_body_size 12M;   # spreadsheet + image uploads

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d app.ellangala.com
```

### LiteSpeed (if that's the web server, not nginx)

WebAdmin console → Virtual Hosts → add `app.ellangala.com`:
- **External App**: type = Web Server, address = `127.0.0.1:5001`
- **Context** `/` → type = Proxy → handler = that external app
- Listener for the domain on 80 + 443, attach the vhost
- Issue the cert from hPanel (SSL) or `certbot` with the DNS challenge

`client_max_body_size` equivalent: raise **Max Request Body Size** to ≥ 12M.

## Then

On the VPS `.env` (`/opt/mindgym-academy/.env`):

```
PUBLIC_BASE_URL=https://app.ellangala.com
SMTP_HOST=ellangala.com
SMTP_PORT=465
SMTP_USER=info@ellangala.com
SMTP_PASS=...
MAIL_FROM="Ellangala's Academy" <info@ellangala.com>
```

```bash
pm2 restart mindgym-academy --update-env
curl -s https://app.ellangala.com/api/events | head -c 200   # expect JSON
```

## If you really want the app on the apex `ellangala.com`

Same vhost, `server_name ellangala.com www.ellangala.com`, `-d ellangala.com -d
www.ellangala.com` for certbot. Then in hPanel change the `@` and `www` A
records from the Hostinger IPs to `<VPS_IP>`. **This removes the WordPress site
from that domain** — export/back it up first. Propagation is ~5–60 min; keep the
old records noted so you can roll back.
