let eventQueue: Record<string, unknown>[] = [];
const INTERVAL = 5000; // 5 seconds
const EVENTS_BATCH_URL = "https://api.tape.xyz/tower/batch";

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
      console.error("[⚙︎] Error sending events:", error);
      eventQueue = eventsToSend.concat(eventQueue);
    }
  }
};

export const pushEventToQueue = (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === "add-event-to-queue") {
    eventQueue.push(event.data.payload);
  }
};

// Set up an interval once to send events every 5 seconds
setInterval(() => {
  sendBatchedEvents();
}, INTERVAL);
