// IRON LOG - Service Worker
const CACHE_NAME = 'iron-log-v3';

// 설치
self.addEventListener('install', e => {
  self.skipWaiting();
});

// 활성화: 오래된 캐시 전부 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 요청 처리: 항상 네트워크 우선 → 실패 시 캐시
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).then(response => {
      if (response && response.status === 200 && response.type !== 'opaque') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => {
      return caches.match(e.request);
    })
  );
});
