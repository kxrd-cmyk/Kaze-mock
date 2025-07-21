// Simple static file server for Cloudflare Workers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  try {
    const request = event.request;
    const url = new URL(request.url);
    
    // Default to index.html for root path
    let path = url.pathname === '/' ? '/index.html' : url.pathname;
    
    // If the path doesn't have an extension, assume it's a SPA route and serve index.html
    if (!path.includes('.')) {
      path = '/index.html';
    }
    
    // Remove leading slash for KV lookup
    const key = path.startsWith('/') ? path.substring(1) : path;
    
    // Try to get the file from the KV namespace
    let response = await __STATIC_CONTENT.get(key, { type: 'arrayBuffer' });
    
    // If not found, try with .html extension for SPA routes
    if (!response && !path.endsWith('.html')) {
      const htmlKey = `${key}.html`;
      response = await __STATIC_CONTENT.get(htmlKey, { type: 'arrayBuffer' });
      if (response) {
        path = htmlKey;
      }
    }
    
    // If still not found, serve the 404 page
    if (!response) {
      const notFoundResponse = await __STATIC_CONTENT.get('404.html', { type: 'arrayBuffer' });
      if (notFoundResponse) {
        return new Response(notFoundResponse, {
          status: 404,
          headers: {
            'content-type': 'text/html;charset=UTF-8',
            'cache-control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
      return new Response('Page not found', { 
        status: 404, 
        headers: { 
          'content-type': 'text/plain',
          'cache-control': 'no-cache, no-store, must-revalidate'
        } 
      });
    }

    // Determine content type based on file extension
    const contentType = getContentType(path);
    
    // Set cache control headers
    const cacheControl = path.endsWith('.html') 
      ? 'public, max-age=3600'  // 1 hour for HTML
      : 'public, max-age=14400'; // 4 hours for other assets
    
    // Return the response with appropriate headers
    return new Response(response, {
      headers: {
        'content-type': contentType,
        'cache-control': cacheControl
      }
    });
    
  } catch (error) {
    // Return error response
    return new Response(`Error: ${error.message}`, { 
      status: 500, 
      headers: { 
        'content-type': 'text/plain',
        'cache-control': 'no-cache, no-store, must-revalidate'
      } 
    });
  }
}

// Helper function to get content type based on file extension
function getContentType(path) {
  const extension = path.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html;charset=UTF-8',
    'css': 'text/css;charset=UTF-8',
    'js': 'application/javascript;charset=UTF-8',
    'json': 'application/json;charset=UTF-8',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'webp': 'image/webp',
    'webm': 'video/webm',
    'mp4': 'video/mp4',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject',
    'txt': 'text/plain;charset=UTF-8',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'mpeg': 'video/mpeg',
    'webmanifest': 'application/manifest+json',
    'wasm': 'application/wasm'
  };
  
  return types[extension] || 'application/octet-stream';
}
