# Coolify Deployment Configuration

## MIME Type Configuration

To fix the JavaScript module MIME type issue, you need to configure nginx in Coolify's dashboard:

### Steps:

1. **Go to your Coolify dashboard**
2. **Navigate to your admin application**
3. **Go to Settings → Nginx Configuration** (or similar)
4. **Add the following configuration:**

```nginx
location ~* \.(js|mjs)$ {
    add_header Content-Type application/javascript;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location ~* \.css$ {
    add_header Content-Type text/css;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location ~* \.json$ {
    add_header Content-Type application/json;
}

location ~* \.wasm$ {
    add_header Content-Type application/wasm;
}
```

### Alternative: Static Site Settings

1. **Ensure "Is it a static site?" is enabled** in Coolify
2. **Set "Public Directory" to `dist`**
3. **Set "Build Command" to `npm run build`**

This should allow Coolify to serve the static files with correct MIME types.

