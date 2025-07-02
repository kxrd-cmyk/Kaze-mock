// Handle incoming requests
export default {
  async fetch(request, env) {
    // Get the request URL
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    
    // For all other requests, serve the static files
    return handleStaticRequest(request, env);
  },
};

// Handle API requests
async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  
  // Example API endpoint
  if (url.pathname === '/api/hello') {
    return new Response(
      JSON.stringify({ message: 'Hello from Kaze Mock API!' }),
      { 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Add more API endpoints as needed
  
  // Return 404 for unknown API routes
  return new Response('Not Found', { status: 404 });
}

// Serve static files
async function handleStaticRequest(request, env) {
  // In development, we'll serve files directly from the file system
  // In production, this would be replaced with your actual static file serving logic
  const url = new URL(request.url);
  let path = url.pathname === '/' ? '/index.html' : url.pathname;
  
  // Try to fetch the file from the file system
  try {
    const file = await env.ASSETS.fetch(new URL(path, request.url));
    return new Response(file.body, {
      headers: {
        'Content-Type': getContentType(path)
      }
    });
  } catch (e) {
    // If file not found, return 404
    return new Response('Not Found', { status: 404 });
  }
}

// Helper function to get content type based on file extension
function getContentType(path) {
  const extension = path.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject'
  };
  
  return types[extension] || 'application/octet-stream';
}
