// Cloudflare Pages Function - handles all requests
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.includes('.')) {
      return fetch(request);
    }
    return fetch(new URL('/index.html', request.url));
  }
};