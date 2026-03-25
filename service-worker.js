const CACHE_NAME = 'family-app-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 1. 安裝階段：將核心檔案快取起來
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. 啟動階段：清除舊版本的快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. 攔截請求：優先讀取快取，若無則透過網路抓取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果有快取就回傳快取，否則發送網路請求
        return response || fetch(event.request);
      })
  );
});
