const cacheName = 'gebet-app-v3';
const assets = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Wenn im Cache, nimm es. Wenn nicht, hol es aus dem Internet und speichere eine Kopie!
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(cacheName).then(cache => {
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    })
  );
});
