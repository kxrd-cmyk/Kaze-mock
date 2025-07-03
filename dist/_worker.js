// Cloudflare Pages Function - handles all requests
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Serve static files directly
  if (url.pathname.includes('.')) {
    return context.next();
  }
  
  // For all other routes, serve index.html
  return context.env.ASSETS.fetch("/index.html");
}
