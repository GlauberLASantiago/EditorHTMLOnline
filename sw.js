const CACHE_NAME = 'glauweb-editor-v3'; 
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Nunito:wght@400;600;700;800;900&display=swap'
];

self.addEventListener('install', (e) => {
    self.skipWaiting(); // Permite que a nova versão mate a velha imediatamente
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// Remove ativamente os "cofres" antigos (v1, v2) para forçar o navegador a usar o novo CACHE_NAME
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim(); // Toma o controle das abas abertas na hora
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
