#!/usr/bin/with-contenv bashio

# Configure nginx
cat > /etc/nginx/http.d/default.conf << EOF
server {
    listen 8080;
    server_name _;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

# Start nginx
bashio::log.info "Starting Test Addon..."
exec nginx -g "daemon off;"