import { clickhouseClient } from "@tape.xyz/server";

const wakeClickHouse = async () => {
  try {
    let attempt = 0;
    const maxAttempts = 10;
    const delay = 2000; // 2 seconds delay between attempts

    while (attempt < maxAttempts) {
      const result = await clickhouseClient.ping();
      if (result.success) {
        console.log("[wake] ClickHouse database is awake!");
        return;
      }
      console.log(
        `[wake] Attempt ${attempt + 1} failed, retrying in ${delay / 1000} seconds...`,
      );
      // Wait for a short period of time before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
    console.error(
      "[wake] Failed to wake up ClickHouse database after multiple attempts.",
    );
  } catch (error) {
    console.error("[wake] Error waking up ClickHouse database:", error);
  }
};

export { wakeClickHouse };
