const cacheName = 'gebet-app-v4';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. Installation: Speichert die Grunddateien (HTML, Icon)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. Aktivierung: Löscht alten Cache, falls vorhanden
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// 3. Strategie: Erst Internet versuchen (für aktuelle Zeiten), 
// wenn offline, dann nimm die Kopie aus dem Cache.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(fetchRes => {
        return caches.open(cacheName).then(cache => {
          // Macht eine Kopie der Gebetszeiten für den Offline-Modus
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      })
      .catch(() => {
        // Wenn kein Internet: Schau im Cache nach
        return caches.match(event.request);
      })
  );
});
