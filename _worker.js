// Handle all requests
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Serve static files directly
  if (url.pathname.includes('.')) {
    return fetch(request);
  }
  
  // For all other routes, serve index.html
  return fetch(new URL('/index.html', request.url));
}