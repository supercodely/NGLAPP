const CACHE_NAME = "ntm-cache-v9";
const CORE_ASSETS = ["./", "./index.html", "./app.js", "./main.js", "./manifest.json"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then((res) => { const c = res.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, c)); return res; }).catch(() => caches.match(event.request))
  );
});
