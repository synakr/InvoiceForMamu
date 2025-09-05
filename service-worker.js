const CACHE_NAME = 'invoice-app-cache-v1';
const urlsToCache = [
  './invoice-page2.html',
  './styles2.css',
  './script2.js',
  './manifest.json',
  './upi-id.jpg',
  './upi-id.jpg',
  './upi-id.jpg',
  // Add icons if available
//   './icon-192.png',
//   './icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});
