    set -e
    
    # Set variables
    FRONTEND_DOMAIN="vora.thehps.in"
    BACKEND_DOMAIN="api.vora.thehps.in"
    SERVER_PATH="/root/vora"
    BACKEND_PORT="8002"
    FRONTEND_PORT="3002"
    
    cd ${SERVER_PATH}
    
    # Install nginx, certbot, and postgresql if not already installed
    if ! command -v nginx &> /dev/null; then
        echo "📦 Installing nginx..."
        apt-get update
        apt-get install -y nginx
    fi
    
    if ! command -v certbot &> /dev/null; then
        echo "📦 Installing certbot..."
        apt-get install -y certbot python3-certbot-nginx
    fi

    if ! command -v psql &> /dev/null; then
        echo "📦 Installing PostgreSQL..."
        apt-get update
        apt-get install -y postgresql postgresql-contrib libpq-dev
        systemctl start postgresql
        systemctl enable postgresql
    fi

    # Create Database and User
    echo "🗄️ Setting up PostgreSQL database..."
    sudo -u postgres psql << 'PSQL_EOF'
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vora') THEN
        CREATE ROLE vora WITH LOGIN PASSWORD 'vora123';
    ELSE
        ALTER ROLE vora WITH PASSWORD 'vora123';
    END IF;
END
$$;
SELECT 'CREATE DATABASE voradb' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'voradb')\gexec
GRANT ALL PRIVILEGES ON DATABASE voradb TO vora;
\c voradb
GRANT ALL ON SCHEMA public TO vora;
PSQL_EOF
    
    # Create nginx configuration for frontend
    echo "📝 Creating nginx configuration for frontend..."
    cat > /etc/nginx/sites-available/vora-frontend << 'NGINX_EOF'
server {
    listen 80;
    server_name vora.thehps.in;

    location /.well-known/acme-challenge/ {
        allow all;
        root /var/www/html;
    }

    location / {
        return 301 https://$server_name:3002$request_uri;
    }
}

server {
    listen 3002 ssl;
    http2 on;
    server_name vora.thehps.in;

    ssl_certificate /etc/letsencrypt/live/vora.thehps.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vora.thehps.in/privkey.pem;

    root /root/vora/dist;
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
    
    # Create nginx configuration for backend
    echo "📝 Creating nginx configuration for backend..."
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
    
    # Enable nginx sites
    ln -sf /etc/nginx/sites-available/vora-frontend /etc/nginx/sites-enabled/
    ln -sf /etc/nginx/sites-available/vora-backend /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Setup SSL with certbot
    echo "🔒 Setting up SSL certificates..."
    # (Note: This assumes DNS is already pointed to the server)
    if [ ! -d "/etc/letsencrypt/live/${FRONTEND_DOMAIN}" ] || [ ! -d "/etc/letsencrypt/live/${BACKEND_DOMAIN}" ]; then
        echo "🌐 Acquiring initial SSL certificates..."
        mkdir -p /var/www/html
        chmod -R 755 /var/www/html
        certbot certonly --webroot -w /var/www/html -d ${FRONTEND_DOMAIN} -d ${BACKEND_DOMAIN} --non-interactive --agree-tos --email admin@thehps.in || true
    fi

    # (Settings are now managed directly in settings.py)
    echo "✅ Django settings verified."

    # Setup Python environment
    echo "📦 Setting up Python virtual environment..."
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    cd backend
    pip install -r requirements.txt
    pip install gunicorn
    
    python manage.py migrate
    python manage.py collectstatic --noinput
    
    # Update systemd services
    echo "📝 Updating systemd services..."
    # If the systemd definition isn't on the server from before, make sure one exists or ignore failure
    if [ -f "../systemd/vora-backend.service" ]; then
        cp ../systemd/vora-backend.service /etc/systemd/system/vora-backend.service
        systemctl daemon-reload
        systemctl restart vora-backend
        systemctl enable vora-backend
    else
        echo "⚠️ systemd/vora-backend.service not found, skipping."
    fi
    
    # Final Nginx reload
    echo "🔄 Testing and reloading nginx..."
    # If nginx -t fails, it's likely due to missing certs in the configuration we just wrote.
    # We attempt to run certbot again to fix it.
    if ! nginx -t; then
        echo "⚠️ Nginx test failed. Attempting to acquire certificates before final reload..."
        # We temporarily disable the sites that are causing the failure to let Certbot run
        mv /etc/nginx/sites-enabled/vora-frontend /etc/nginx/sites-enabled/vora-frontend.bak || true
        mv /etc/nginx/sites-enabled/vora-backend /etc/nginx/sites-enabled/vora-backend.bak || true
        systemctl reload nginx || true
        
        certbot certonly --webroot -w /var/www/html -d ${FRONTEND_DOMAIN} -d ${BACKEND_DOMAIN} --non-interactive --agree-tos --email admin@thehps.in || true
        
        mv /etc/nginx/sites-enabled/vora-frontend.bak /etc/nginx/sites-enabled/vora-frontend || true
        mv /etc/nginx/sites-enabled/vora-backend.bak /etc/nginx/sites-enabled/vora-backend || true
    fi
    
    if nginx -t; then
        systemctl restart nginx
        echo "✅ Nginx restarted successfully!"
    else
        echo "❌ Nginx configuration still failing. Please check DNS and Certbot logs."
    fi
    
    echo "Server deployment complete!"
