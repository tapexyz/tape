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
      console.log("[SW] ✅ Events sent to API");
    } catch (error) {
      console.error("[SW] Error sending events:", error);
      // Re-add events to the queue in case of failure
      eventQueue = eventsToSend.concat(eventQueue);
    }
  }
};

self.addEventListener("message", (event: MessageEvent) => {
  if (event.data && event.data.type === "ADD_EVENT") {
    eventQueue.push(event.data.payload);

    // Send batched events at intervals
    setTimeout(() => {
      sendBatchedEvents();
    }, 5000);
  }
});
