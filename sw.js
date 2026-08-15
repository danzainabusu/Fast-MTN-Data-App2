// ============================================
// FAST MTN DATA
// PROGRESSIVE WEB APP SERVICE WORKER
// ============================================

const CACHE_NAME = "fast-mtn-v2";

// ============================================
// INSTALL
// ============================================

self.addEventListener("install", (event) => {
  console.log("Fast MTN Service Worker installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./logo.png",
      ]);
    }),
  );

  self.skipWaiting();
});

// ============================================
// ACTIVATE
// ============================================

self.addEventListener("activate", (event) => {
  console.log("Fast MTN Service Worker activated");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log("Deleting old cache:", cacheName);

              return caches.delete(cacheName);
            }),
        );
      }),
  );

  self.clients.claim();
});

// ============================================
// FETCH
// ============================================

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // We only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Don't interfere with external websites
  if (url.origin !== self.location.origin) {
    return;
  }

  // ==========================================
  // HTML PAGES
  // NETWORK FIRST
  // ==========================================

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            return caches.match("./index.html");
          });
        }),
    );

    return;
  }

  // ==========================================
  // CSS / JS / IMAGES / FONTS
  // CACHE FIRST
  // ==========================================

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Don't cache bad responses
          if (
            !response ||
            response.status !== 200 ||
            response.type === "opaque"
          ) {
            return response;
          }

          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          return new Response("Fast MTN resource unavailable.");
        });
    }),
  );
});
