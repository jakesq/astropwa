self.importScripts('info/planet-info.js');

//Files to cache
var cacheName = 'astroinsights';
var appCacheFiles = [
    './',
    'info/planet-info.js',
    'index.html',
    'app.js',
    'favicon.ico',
    'style.css',
    'media/images/NASA_logo.png',
    'media/images/space_header.png',
    'materialResources/material-design-light/material.min.js.map',
    'materialResources/material-design-light/material.min.css'
];

var ssystemImages = [];
for (var i = 0; i < planets.length; i++) {
    ssystemImages.push('media/ssystem/' + planets[i].tag + '.png');
}
var cache = appCacheFiles.concat(ssystemImages);

self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(cache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function(response) {
                return caches.open(cacheName).then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheName.indexOf(key) == -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});