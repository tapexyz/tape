import { cacheNewAssets, deleteOldCaches } from "./cache";
import { pushEventToQueue } from "./events";

declare let self: ServiceWorkerGlobalScope;

// Activate the new service worker immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Take control of all clients (open tabs, etc.) immediately
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(deleteOldCaches().then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  cacheNewAssets(event);
});

self.addEventListener("message", (event) => {
  pushEventToQueue(event);
});
