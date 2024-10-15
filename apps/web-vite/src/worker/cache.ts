const CACHE_NAME = "tape-cache-storage";
const ASSET_CACHE_URLS = [/\/assets\/.*/, /\/fonts\/.*/];

const getFileGroup = (url: string): string | null => {
  const regex =
    /\/assets\/(?<baseName>[a-zA-Z0-9_\-]+)\.hash-[A-Za-z0-9]+\.(?<ext>[a-zA-Z0-9]+)$/;
  const match = url.match(regex);
  return match?.groups ? `${match.groups.baseName}.${match.groups.ext}` : null;
};

const deleteOldGroupFiles = async (request: Request, cache: Cache) => {
  const fileGroup = getFileGroup(request.url);
  if (!fileGroup) return;

  const cachedRequests = await cache.keys();
  const oldVersions = cachedRequests.filter((cachedRequest) => {
    const cachedFileGroup = getFileGroup(cachedRequest.url);
    return cachedFileGroup === fileGroup && cachedRequest.url !== request.url;
  });
  return Promise.all(oldVersions.map((oldRequest) => cache.delete(oldRequest)));
};

export const cacheNewAssets = (event: FetchEvent) => {
  const requestURL = new URL(event.request.url);

  const shouldCache = ASSET_CACHE_URLS.some((pattern) =>
    pattern.test(requestURL.pathname)
  );

  if (shouldCache) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(async (networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cache = await caches.open(CACHE_NAME);
              await deleteOldGroupFiles(event.request, cache);
              await cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }

            return networkResponse;
          })
          .catch(() => {
            return new Response("[⚙️] Network error occurred", {
              status: 503,
              statusText: "Service Unavailable"
            });
          });
      })
    );
  }
};

export const deleteOldCaches = () =>
  caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    );
  });
