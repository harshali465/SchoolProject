/* Cache names */
const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",
  "/static/js/main.js",
  "/static/css/main.css",
  "/offline.html", // Offline fallback page
];

// Install Event - Cache necessary assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching assets");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate immediately after installation
});

// Fetch Event - Serve assets from cache and handle offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Serve from cache or perform network request
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match("/offline.html"))
      );
    })
  );
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Keep only the current cache
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Service Worker: Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim(); // Gain control over all clients
});
