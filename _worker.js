// This is a simple Cloudflare Worker that handles SPA routing
// It serves index.html for all routes that don't have a file extension

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // If the request is for a file with an extension, let it pass through
  if (url.pathname.includes('.')) {
    return fetch(request);
  }
  
  // Otherwise, serve index.html for SPA routing
  return fetch(new URL('/index.html', request.url));
}
