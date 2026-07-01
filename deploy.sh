#!/bin/bash
set -e

# ── Configuration ─────────────────────────────────────────────────────────────
SERVER_USER="root"
SERVER_HOST="145.223.18.5"
SERVER_PATH="/root/vora"
FRONTEND_DOMAIN="vora.thehps.in"
BACKEND_DOMAIN="api.vora.thehps.in"

# SSH options: keepalive every 30s, tolerate up to 20 missed beats (~10 min)
# This prevents "Broken pipe" / "Connection reset" on long-running imports.
SSH_OPTS="-o ServerAliveInterval=30 -o ServerAliveCountMax=20 -o ConnectTimeout=30"

# ── Flags (parse arguments) ───────────────────────────────────────────────────
IMPORT_PRODUCTS=false
IMPORT_UPDATE_EXISTING=false
IMPORT_SKIP_IMAGES=false
IMPORT_DRY_RUN=false
IMPORT_CATEGORY_FILTER=""
DEPLOY_ONLY=false
IMPORT_ONLY=false

for arg in "$@"; do
    case $arg in
        --import-products)       IMPORT_PRODUCTS=true ;;
        --update-existing)       IMPORT_UPDATE_EXISTING=true ;;
        --skip-images)           IMPORT_SKIP_IMAGES=true ;;
        --dry-run)               IMPORT_DRY_RUN=true ;;
        --import-only)           IMPORT_ONLY=true; IMPORT_PRODUCTS=true ;;
        --deploy-only)           DEPLOY_ONLY=true ;;
        --category=*)            IMPORT_CATEGORY_FILTER="${arg#*=}" ;;
        --help|-h)
            echo ""
            echo "Usage: ./deploy.sh [OPTIONS]"
            echo ""
            echo "Deployment options:"
            echo "  (no flags)           Full deploy: build frontend + sync + server setup"
            echo "  --deploy-only        Deploy only (skip product import)"
            echo ""
            echo "Product import options (can be combined with deployment):"
            echo "  --import-products    After deploying, import products from BC updated.xlsx"
            echo "  --import-only        Skip deployment; run product import only"
            echo "  --update-existing    Update products that already exist in the DB"
            echo "  --skip-images        Skip downloading images from Google Drive"
            echo "  --dry-run            Parse Excel without saving to DB (validation only)"
            echo "  --category=NAME      Only import products matching this category"
            echo ""
            echo "Examples:"
            echo "  ./deploy.sh                           # Full deploy"
            echo "  ./deploy.sh --import-products         # Deploy + import all products"
            echo "  ./deploy.sh --import-only             # Import products only (no deploy)"
            echo "  ./deploy.sh --import-only --dry-run   # Validate Excel data only"
            echo "  ./deploy.sh --import-products --update-existing --skip-images"
            echo ""
            exit 0 ;;
    esac
done

echo "Starting deployment to ${SERVER_HOST}..."

# ── Skip full deploy if --import-only ─────────────────────────────────────────
if [ "$IMPORT_ONLY" = true ]; then
    echo "Import-only mode: skipping build and server setup."
else

# Step 1: Build Vite frontend locally
echo "Building Vite frontend..."

# Create/update .env.production with API URL
cat > .env.production << EOF
VITE_API_URL=https://${BACKEND_DOMAIN}/api
EOF

npm install
npm run build

# Step 2: Sync files to server
echo "📤 Syncing files to server..."
# Ensure systemd directory exists locally
mkdir -p systemd

rsync -avz --progress \
    systemd/vora-backend.service \
    --exclude 'venv/' \
    --exclude '__pycache__/' \
    --exclude '*.pyc' \
    --exclude 'node_modules/' \
    --exclude 'dist/' \
    --exclude 'media/' \
    --exclude 'staticfiles/' \
    --exclude 'logs/' \
    --exclude '*.log' \
    --exclude '.git/' \
    --exclude '.DS_Store' \
    --exclude 'data/*.xlsx' \
    ./ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# Sync the build folder separately to the correct location
echo "📤 Syncing frontend build..."
rsync -avz --progress dist/ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/dist/

# Step 3: Setup nginx, SSL, and deploy on server
echo "📦 Setting up nginx, SSL, and deploying on server..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
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
    cp ../systemd/vora-backend.service /etc/systemd/system/vora-backend.service
    
    systemctl daemon-reload
    systemctl restart vora-backend
    systemctl enable vora-backend
    
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
ENDSSH

echo "Deployment successful!"
echo "Frontend: https://${FRONTEND_DOMAIN}"
echo "API: https://${BACKEND_DOMAIN}"

fi  # end of --import-only skip block

# ── Product import from Excel ─────────────────────────────────────────────────
if [ "$IMPORT_PRODUCTS" = true ]; then
    echo ""
    echo "=========================================="
    echo " PRODUCT IMPORT FROM EXCEL"
    echo "=========================================="

    EXCEL_LOCAL="./data/BC updated.xlsx"
    # Use a no-space filename on the server to avoid SSH quoting issues
    EXCEL_REMOTE="${SERVER_PATH}/data/BC_updated.xlsx"

    if [ ! -f "$EXCEL_LOCAL" ]; then
        echo "ERROR: Excel file not found at $EXCEL_LOCAL"
        exit 1
    fi

    # Step 1: Sync migration + management command to server
    echo "Syncing management command and migration to server..."
    scp $SSH_OPTS \
        "./backend/api/management/commands/import_products_excel.py" \
        "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/backend/api/management/commands/import_products_excel.py"
    scp $SSH_OPTS \
        "./backend/api/migrations/0010_productimage.py" \
        "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/backend/api/migrations/0010_productimage.py"
    # Sync updated models.py and serializers.py
    scp $SSH_OPTS \
        "./backend/api/models.py" \
        "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/backend/api/models.py"
    scp $SSH_OPTS \
        "./backend/api/serializers.py" \
        "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/backend/api/serializers.py"

    # Step 2: Upload Excel file to server (underscore name avoids space quoting issues)
    echo "Uploading Excel file to server..."
    ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}/data"
    scp $SSH_OPTS "$EXCEL_LOCAL" "${SERVER_USER}@${SERVER_HOST}:${EXCEL_REMOTE}"
    echo "Excel file uploaded."

    # Step 3: Build optional flags
    IMPORT_FLAGS=""
    [ "$IMPORT_UPDATE_EXISTING" = true ] && IMPORT_FLAGS="$IMPORT_FLAGS --update-existing"
    [ "$IMPORT_SKIP_IMAGES"     = true ] && IMPORT_FLAGS="$IMPORT_FLAGS --skip-images"
    [ "$IMPORT_DRY_RUN"         = true ] && IMPORT_FLAGS="$IMPORT_FLAGS --dry-run"
    [ -n "$IMPORT_CATEGORY_FILTER" ]    && IMPORT_FLAGS="$IMPORT_FLAGS --category-filter '$IMPORT_CATEGORY_FILTER'"

    # Step 4: Write a self-contained script to /tmp on the server.
    # The script runs under nohup so it survives any SSH disconnection.
    # Logs stream to /tmp/bc_import.log — we tail it back here.
    echo "Running import_products_excel on server..."
    [ -n "$IMPORT_FLAGS" ] && echo "  Flags: $IMPORT_FLAGS"
    echo ""

    # Write the import script
    ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} "cat > /tmp/bc_import.sh && chmod +x /tmp/bc_import.sh" << SCRIPT_EOF
#!/bin/bash
set -e
LOG=/tmp/bc_import.log
exec >> "\$LOG" 2>&1
echo "=== Import started at \$(date) ==="
cd ${SERVER_PATH}
source venv/bin/activate
cd backend
echo "--- Running migrations ---"
python manage.py migrate --noinput
echo "--- Verifying dependencies ---"
pip install gdown openpyxl -q
echo "--- Starting product import ---"
python manage.py import_products_excel \
    --excel-path "${EXCEL_REMOTE}" \
    ${IMPORT_FLAGS}
echo ""
echo "=== Import finished at \$(date) ==="
touch /tmp/bc_import.done
SCRIPT_EOF

    # Clean up any previous run sentinels
    ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} "rm -f /tmp/bc_import.done /tmp/bc_import.log"

    # Launch the script via nohup so it keeps running even if SSH drops
    ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} \
        "nohup bash /tmp/bc_import.sh > /tmp/bc_import.log 2>&1 &"

    echo "Import running on server (nohup). Streaming log — Ctrl+C is safe, import continues on server."
    echo "──────────────────────────────────────────────────────────"

    # Stream log from server until the done-sentinel appears
    # Re-connects with keepalive if connection temporarily drops
    while true; do
        ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} \
            "tail -f /tmp/bc_import.log --pid=\$(pgrep -f import_products_excel | head -1)" \
            2>/dev/null && break || true

        # Check if import finished (sentinel file present)
        if ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} \
               "test -f /tmp/bc_import.done" 2>/dev/null; then
            # Print any remaining log lines
            ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} "cat /tmp/bc_import.log" 2>/dev/null || true
            break
        fi
        echo "(Connection dropped — reconnecting in 5s...)"
        sleep 5
    done

    # Cleanup temp files on server
    ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} \
        "rm -f /tmp/bc_import.sh /tmp/bc_import.done" 2>/dev/null || true

    echo ""
    if [ "$IMPORT_DRY_RUN" = true ]; then
        echo "Dry run complete. No products were saved."
    else
        echo "Products imported successfully!"
        echo "View at: https://${BACKEND_DOMAIN}/api/products/"
        echo "Admin:   https://${BACKEND_DOMAIN}/admin/api/product/"
    fi
fi
