// Adaptive Cumulative DVH — offline cache. Bump VERSION when files change.
const VERSION = "acd-v1.5";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-180.png", "icons/icon-32.png", "icons/maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    // network first for the page so updates arrive, cache fallback offline
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); return res; })));
  }
});
