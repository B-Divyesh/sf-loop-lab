const CACHE = 'loop-lab-__BUILD_ID__'
const CORE = ['/', '/demo', '/privacy', '/terms', '/offline.html', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/loop-lab-hero.webp', '__BUILD_ASSETS__']

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== location.origin) return
  event.respondWith(caches.match(url.pathname).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone()
      caches.open(CACHE).then(cache => cache.put(url.pathname, copy))
    }
    return response
  }).catch(() => event.request.mode === 'navigate' ? caches.match('/offline.html') : Response.error())))
})
