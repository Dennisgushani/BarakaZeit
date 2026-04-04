const cacheName = 'gebet-app-v1';
const assets = ['./', './index.html', './manifest.json', './icon.png'];

// Speichert dein Design im Handy-Speicher
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Lädt dein Design aus dem Speicher, wenn kein Internet da ist
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

