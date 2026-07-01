cat > /etc/nginx/sites-available/vora-frontend << 'NGINX_EOF'
server {
    listen 80;
    server_name vora.thehps.in;

    location /.well-known/acme-challenge/ {
        allow all;
        root /var/www/html;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl;
    http2 on;
    server_name vora.thehps.in;

    ssl_certificate /etc/letsencrypt/live/vora.thehps.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vora.thehps.in/privkey.pem;

    root /var/www/vora-frontend;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

cat > /etc/nginx/sites-available/vora-backend << 'NGINX_EOF'
server {
    listen 80;
    server_name api.vora.thehps.in;

    location /.well-known/acme-challenge/ {
        allow all;
        root /var/www/html;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl;
    http2 on;
    server_name api.vora.thehps.in;

    ssl_certificate /etc/letsencrypt/live/vora.thehps.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vora.thehps.in/privkey.pem;

    client_max_body_size 100M;

    # Nginx needs permission to serve media/static. /root is usually blocked.
    # Better to alias them to somewhere readable, or just ensure /root is readable block-wise by Nginx.
    # But for now, we leave the backend config unchanged.

    location / {
        proxy_pass http://127.0.0.1:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /root/vora/backend/staticfiles/;
    }
    
    location /media/ {
        alias /root/vora/backend/media/;
    }
}
NGINX_EOF

ln -sf /etc/nginx/sites-available/vora-frontend /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/vora-backend /etc/nginx/sites-enabled/
systemctl reload nginx
