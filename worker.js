// Simple static file server for Cloudflare Workers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // Parse the URL
    const url = new URL(request.url);
    
    // Default to index.html for root path
    let path = url.pathname === '/' ? '/index.html' : url.pathname;
    
    // Remove leading slash for file path
    let filePath = path.startsWith('/') ? path.substring(1) : path;
    
    // If the path doesn't have an extension, assume it's a SPA route and serve index.html
    if (!filePath.includes('.')) {
      filePath = 'index.html';
    }
    
    // Get the file content from the KV namespace
    let file = await ASSETS.get(filePath);
    
    // If file not found, try with .html extension for SPA routes
    if (!file && !filePath.endsWith('.html')) {
      filePath = filePath + '.html';
      file = await ASSETS.get(filePath);
    }
    
    // If still not found, serve 404
    if (!file) {
      return new Response('File not found', { status: 404 });
    }
    
    // Determine content type
    const contentType = getContentType(filePath);
    
    // Return the file with appropriate headers
    return new Response(file, {
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=14400' // 4 hours cache
      }
    });
    
  } catch (error) {
    // Return error response
    return new Response(`Error: ${error.message}`, { status: 500 });
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
