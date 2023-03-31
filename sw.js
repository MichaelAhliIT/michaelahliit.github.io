var APP_PREFIX = 'PWA'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_01'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
  '/',                     // If you have separate JS/CSS files,
  '/index.html',            // add path to those files here
  '/about.html',            // add path to those files here
  '/css/about.css',            // add path to those files here
  '/css/app.css',            // add path to those files here
  '/js/app.js',            // add path to those files here
]

// Respond with cached resources
// Install the service worker and cache the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Serve files from the cache first, then update the cache from the network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Serve the cached file
          return response;
        }

        // If the file is not in the cache, fetch it from the network and cache it
        return fetch(event.request)
          .then(response => {
            // Cache the fetched file
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, response.clone()));
            // Return the fetched file
            return response;
          });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
  );
});