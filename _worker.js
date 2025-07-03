// This file is intentionally left empty
// The actual worker code is in dist/_worker.js
// This is just a placeholder to satisfy Cloudflare Pages
export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      if (url.pathname.includes('.')) {
        return fetch(request);
      }
      return fetch(new URL('/index.html', request.url));
    }
  };