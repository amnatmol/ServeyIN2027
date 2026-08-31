const CACHE_NAME = 'pwa-cache-v2'; // <--- เปลี่ยนชื่อเวอร์ชัน Cache ตรงนี้
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png'
];

// ขั้นตอน Install
self.addEventListener('install', event => {
  self.skipWaiting(); // บังคับให้ Service Worker ตัวใหม่ทำงานทันที
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ขั้นตอน Activate: เคลียร์ Cache เก่าทิ้งเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ขั้นตอน Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
