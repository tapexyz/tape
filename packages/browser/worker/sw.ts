declare let self: ServiceWorkerGlobalScope;

const INTERVAL = 5000; // 5 seconds
const EVENTS_BATCH_URL = "https://api.tape.xyz/tower/batch";

let eventQueue: Record<string, unknown>[] = [];

const sendBatchedEvents = async () => {
  if (eventQueue.length > 0) {
    const eventsToSend = [...eventQueue];
    eventQueue = []; // Clear the queue

    try {
      await fetch(EVENTS_BATCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: eventsToSend })
      });
    } catch (error) {
      console.error("[SW] Error sending events:", error);
      // Re-add events to the queue in case of failure
      eventQueue = eventsToSend.concat(eventQueue);
    }
  }
};

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "ADD_EVENT") {
    eventQueue.push(event.data.payload);
  }
});

// Activate the new service worker immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Take control of all clients (open tabs, etc.) immediately
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

// Set up an interval once to send events every 5 seconds
setInterval(() => {
  sendBatchedEvents();
}, INTERVAL);
