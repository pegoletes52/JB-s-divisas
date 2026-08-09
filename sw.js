const CACHE = 'jbdivisas-v1';
const SHELL = [
  './JBsDivisas.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Las tasas de cambio (API externa) siempre van a la red: nunca las cacheamos aquí,
  // la propia app ya guarda su último dato válido en localStorage.
  if (url.origin !== self.location.origin) return;

  // Archivos propios de la app: cache-first, con la red como respaldo.
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
