import {
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from "@tape.xyz/constants";
import { indexerDb, tapeDb } from "@tape.xyz/server";

const appIds = [TAPE_APP_ID, LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
  .map((app) => `'${app}'`)
  .join(",");

const earningStats = async (startTimestamp: string) => {
  const today = new Date();
  let startDate = new Date(startTimestamp);
  let hasMore = true;

  const earningByCurrency: { [key: string]: number } = {};
  while (hasMore) {
    try {
      let endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1); // add a day

      if (endDate >= today) {
        endDate = new Date();
        hasMore = false;
        return {
          earnings: earningByCurrency,
          timestamp: endDate.toISOString()
        };
      }

      const start = startDate.toISOString().replace("T", " ").replace("Z", "");
      const end = endDate.toISOString().replace("T", " ").replace("Z", "");
      console.log(`[computing earning stats] ~ start: ${start}, end: ${end}`);
      const results = await indexerDb.query(
        `
        SELECT
            oam.currency,
            SUM(CAST(oam.amount AS NUMERIC)) AS total_amount
        FROM (
            SELECT
                oaar.publication_id
            FROM
                publication.open_action_module_acted_record AS oaar
            JOIN
                public.publication_view AS pv ON oaar.publication_id = pv.publication_id
            WHERE
                pv.app IN (${appIds})
                AND oaar.block_timestamp >= '${start}'
                AND oaar.block_timestamp < '${end}'
        ) AS limited_oaar
        JOIN
            publication.open_action_module AS oam ON limited_oaar.publication_id = oam.publication_id
        GROUP BY
            oam.currency;
    `
      );

      for (const row of results) {
        const currency = row.currency;
        if (
          currency &&
          currency !== "0x0000000000000000000000000000000000000000"
        ) {
          const totalAmount = Number.parseFloat(row.total_amount);
          if (!earningByCurrency[currency]) {
            earningByCurrency[currency] = 0;
          }
          earningByCurrency[currency] += totalAmount;
        }
      }

      startDate = endDate;
    } catch (error) {
      console.error("[error computing earning stats]", error);
      return {
        earnings: earningByCurrency,
        timestamp: startDate.toISOString()
      };
    }
  }

  return { earnings: earningByCurrency, timestamp: startDate.toISOString() };
};

const mergeEarnings = (
  oldEarnings: { [key: string]: number } = {},
  newEarnings: { [key: string]: number } = {}
) => {
  for (const [currency, amount] of Object.entries(newEarnings)) {
    if (!oldEarnings[currency]) {
      oldEarnings[currency] = 0;
    }
    oldEarnings[currency] += amount;
  }
  return oldEarnings;
};

const computePlatformStats = async () => {
  try {
    const startTime = performance.now();
    const results = await indexerDb.multi(
      `
        SELECT
            count(*) AS total_profiles
        FROM
            public.profile_view;

        SELECT
            SUM(total) AS total_acts
        FROM
            app_stats.publication_open_action
        WHERE
            app IN (${appIds});

        SELECT
            SUM(CASE WHEN pv.publication_type = 'POST' THEN 1 ELSE 0 END) AS total_posts,
            SUM(CASE WHEN pv.publication_type = 'COMMENT' THEN 1 ELSE 0 END) AS total_comments,
            SUM(CASE WHEN pv.publication_type = 'MIRROR' THEN 1 ELSE 0 END) AS total_mirrors
        FROM
            public.publication_view AS pv
        WHERE
            pv.app IN (${appIds});
    `
    );
    const endTime = performance.now();
    console.log(`[stats] execution time: ${endTime - startTime} ms`);

    const flatData = Object.assign({}, ...results.flat());

    const prevStats = await tapeDb.platformStats.findFirst();
    const { earnings, timestamp } = await earningStats(
      prevStats?.blockTimestamp || "2022-05-17T16:12:16"
    );
    console.log("[computed stats]", earnings, timestamp);

    const upsertData = {
      profiles: flatData.total_profiles,
      acts: flatData.total_acts,
      posts: flatData.total_posts,
      comments: flatData.total_comments,
      mirrors: flatData.total_mirrors,
      creatorEarnings: mergeEarnings(
        prevStats?.creatorEarnings as { [key: string]: number },
        earnings
      ),
      blockTimestamp: timestamp
    };

    await tapeDb.platformStats.upsert({
      where: { id: prevStats?.id ?? "057d8da3-0910-4ba4-95f2-1e30e7792763" },
      update: {
        ...upsertData
      },
      create: {
        ...upsertData
      }
    });
    return console.log("[stats] Successfully computed platform stats");
  } catch (error) {
    console.error("[stats] Error computing platform stats → ", error);
  }
};

export { computePlatformStats };
