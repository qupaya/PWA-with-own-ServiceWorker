declare const self: ServiceWorkerGlobalScope;
export {};

(function() {
  "use strict";
  const CACHE_NAME = "some-fake-service-worker-%version%";
  const ALL_CACHES = [CACHE_NAME];
  const files = [
    "index.html",
    "main.js",
    "polyfills.js",
    "runtime.js",
    "icon.svg",
    "icon512.png",
    "icon192.png",
    "styles.css",
    "manifest.json"];
  self.addEventListener("install", (event: ExtendableEvent) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return cache.addAll(files);
        }));
  });

  self.addEventListener("activate", (event: ExtendableEvent) => {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.filter(cacheName => {
              return (cacheName.startsWith("some-fake-service-worker")
                  || cacheName.startsWith("ngsw:"))
                && !ALL_CACHES.includes(cacheName);
            }).map(cacheName => caches.delete(cacheName)));
        }));
  });

  self.addEventListener("fetch", (event: FetchEvent) => {
    const requestUrl = new URL(event.request.url);

    if (requestUrl.origin !== location.origin || "/" !== requestUrl.pathname || files.includes(requestUrl.pathname)) {
      event.respondWith(
        caches.match(event.request)
          .then(response => response || fetch(event.request)));
    } else {
      event.respondWith(
        caches.match("index.html")
          .then(response => response || fetch("index.html")));
    }
  });
}());
