#!/usr/bin/env bash
# Point host nginx at the pm2 app (this repo) and serve it on the domain over TLS.
# Safe: backs up, validates with `nginx -t` before every reload, rolls back on failure.
# Touches ONLY host nginx + the pm2 process — never the Docker stack.
#
#   sudo bash deploy/go-live.sh
#
set -uo pipefail

DOMAIN=ellangala.com
ALT=www.ellangala.com
APP=mindgym-academy

say() { printf '\n\033[1m== %s ==\033[0m\n' "$*"; }
die() { printf '\n\033[31m!! %s\033[0m\n' "$*"; exit 1; }

[ "$(id -u)" = 0 ] || die "run as root (sudo)"

# ---------------------------------------------------------------- 1. the app
say "1. locate the app"
APPPID=$(pgrep -f 'node .*/opt/mindgym-academy' | head -1)
[ -n "$APPPID" ] || APPPID=$(pm2 pid "$APP" 2>/dev/null | head -1)
[ -n "${APPPID:-}" ] || die "can't find the running app process"
PORT=$(tr '\0' '\n' < "/proc/$APPPID/environ" 2>/dev/null | sed -n 's/^PORT=//p' | head -1)
PORT=${PORT:-8080}
echo "pid $APPPID, port $PORT"
curl -sf -o /dev/null --max-time 5 "http://127.0.0.1:$PORT/api/events" \
  || die "app not answering on http://127.0.0.1:$PORT/api/events — fix the app first (pm2 logs $APP)"
echo "app healthy on :$PORT"

# ---------------------------------------------------------------- 2. diagnostics (for the record)
say "2. current nginx state"
nginx -T 2>/dev/null | grep -nE '^\s*(server_name|listen|ssl_certificate|proxy_pass|root)\b' | grep -v '#' || true
echo "--- existing certs ---"
ls -1 /etc/letsencrypt/live/ 2>/dev/null || echo "(none)"

# ---------------------------------------------------------------- 3. TLS cert
say "3. TLS certificate"
CERTDIR=""
for d in "/etc/letsencrypt/live/$DOMAIN" $(find /etc/letsencrypt/live -maxdepth 1 -type d -iname '*ellangala*' 2>/dev/null); do
  [ -f "$d/fullchain.pem" ] && { CERTDIR="$d"; break; }
done
if [ -n "$CERTDIR" ]; then
  echo "using existing cert: $CERTDIR"
else
  echo "no cert found — requesting one via certbot (HTTP-01, needs :80 reachable, DNS already points here)"
  command -v certbot >/dev/null || die "certbot not installed: apt-get install -y certbot python3-certbot-nginx"
  # temporary plain-HTTP vhost so the ACME challenge resolves
  TMP=/etc/nginx/sites-available/$DOMAIN
  cat > "$TMP" <<EOF
server {
    listen 80; listen [::]:80;
    server_name $DOMAIN $ALT;
    root /var/www/html;
    location / { proxy_pass http://127.0.0.1:$PORT; proxy_set_header Host \$host; proxy_set_header X-Forwarded-Proto \$scheme; proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; proxy_http_version 1.1; }
}
EOF
  ln -sf "$TMP" /etc/nginx/sites-enabled/$DOMAIN
  nginx -t || die "nginx -t failed on the temp vhost"
  systemctl reload nginx
  certbot certonly --nginx --non-interactive --agree-tos -m "info@$DOMAIN" -d "$DOMAIN" -d "$ALT" \
    || certbot certonly --nginx --non-interactive --agree-tos -m "info@$DOMAIN" -d "$DOMAIN" \
    || die "certbot failed — check that $DOMAIN resolves to this server and :80 is open"
  CERTDIR="/etc/letsencrypt/live/$DOMAIN"
fi
[ -f "$CERTDIR/fullchain.pem" ] || die "still no cert at $CERTDIR"

# ---------------------------------------------------------------- 4. final vhost
say "4. write the reverse-proxy vhost"
VHOST=/etc/nginx/sites-available/$DOMAIN
BK="/root/${DOMAIN}.vhost.bak.$(date +%s)"
[ -f "$VHOST" ] && cp -a "$VHOST" "$BK" && echo "backup: $BK"

# server_name — keep www only if the cert actually covers it
NAMES="$DOMAIN"
grep -q "DNS:$ALT" <(openssl x509 -noout -text -in "$CERTDIR/fullchain.pem" 2>/dev/null) && NAMES="$DOMAIN $ALT"
echo "server_name: $NAMES"

cat > "$VHOST" <<EOF
server {
    listen 80; listen [::]:80;
    server_name $NAMES;
    return 301 https://\$host\$request_uri;
}
server {
    listen 443 ssl; listen [::]:443 ssl;
    http2 on;
    server_name $NAMES;

    ssl_certificate     $CERTDIR/fullchain.pem;
    ssl_certificate_key $CERTDIR/privkey.pem;

    client_max_body_size 12M;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade           \$http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_read_timeout 120s;
    }
}
EOF
ln -sf "$VHOST" /etc/nginx/sites-enabled/$DOMAIN

if nginx -t; then
  systemctl reload nginx
  echo "nginx reloaded"
else
  echo "nginx -t FAILED — rolling back"
  if [ -f "$BK" ]; then cp -a "$BK" "$VHOST"; else rm -f "$VHOST" "/etc/nginx/sites-enabled/$DOMAIN"; fi
  nginx -t && systemctl reload nginx
  die "rolled back, no change made"
fi

# ---------------------------------------------------------------- 5. verify
say "5. verify"
sleep 2
curl -s -o /dev/null -w "https://$DOMAIN/            -> %{http_code}\n" "https://$DOMAIN/"
printf "https://$DOMAIN/api/events   -> "; curl -s "https://$DOMAIN/api/events" | head -c 160; echo
printf "https://$DOMAIN/verify-certificate -> "; curl -s -o /dev/null -w "%{http_code}\n" "https://$DOMAIN/verify-certificate"
echo
echo "If /api/events shows JSON, the app is live. Backup of the old vhost: ${BK:-<none, vhost was new>}"
