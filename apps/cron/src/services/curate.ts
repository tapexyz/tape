import {
  ALLOWED_APP_IDS,
  LENSTUBE_BYTES_APP_ID,
  REDIS_KEYS,
  TAPE_APP_ID,
} from "@tape.xyz/constants";
import { REDIS_EXPIRY, indexerDb, rSet, tapeDb } from "@tape.xyz/server";

type MainFocus = "VIDEO" | "SHORT_VIDEO";

const curatePublications = async (mainFocus: MainFocus) => {
  try {
    const limit = 50;
    let pageNumber = 1;
    let bufferedItems: string[] = [];

    const profiles = await tapeDb.profile.findMany({
      select: { profileId: true },
      where: { isCurated: true },
    });
    const profileIds = profiles.map(({ profileId }) => profileId);
    console.log(`[curate] Found ${profileIds.length} curated profiles`);

    const batches = [];
    const batchSize = 50;
    for (let i = 0; i < profileIds.length; i += batchSize) {
      batches.push(profileIds.slice(i, i + batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex] as string[];

      console.log(
        `[curate] Processing page ${pageNumber}, batch ${batchIndex + 1} with ${batch.length} profiles`,
      );

      let page = 1;
      let hasNextPage = true;
      const alreadyQueried = new Set<string>();

      while (hasNextPage) {
        const offset = (page - 1) * limit;
        const apps = [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS];
        const skipPubIds = Array.from(alreadyQueried);

        const results: { publication_id: string }[] = await indexerDb.query(
          `
          WITH ranked_publications AS (
            SELECT 
              pv.profile_id,
              pv.publication_id,
              pv.timestamp,
              ROW_NUMBER() OVER (PARTITION BY pv.profile_id ORDER BY RANDOM()) AS rn
            FROM
              public.publication_view pv
            WHERE
              pv.profile_id IN ($2:csv)
              AND pv.is_hidden = FALSE
              AND pv.parent_publication_id IS NULL
              AND pv.app IN ($1:csv)
              ${skipPubIds.length ? "AND pv.publication_id NOT IN ($3:csv)" : ""}
          )
          SELECT
            rp.publication_id
          FROM
            ranked_publications rp
          JOIN
            publication.metadata pm ON rp.publication_id = pm.publication_id
          WHERE
            rp.rn <= $5
            AND pm.main_content_focus = $4
          ORDER BY rp.rn
          LIMIT $5 OFFSET $6;
        `,
          [apps, batch, skipPubIds, mainFocus, limit, offset],
        );

        const pubIds = results.map(({ publication_id }) => publication_id);
        console.log(`[curate] Found ${pubIds.length} publications`);
        for (const pubId of pubIds) {
          alreadyQueried.add(pubId);
        }

        if (results.length) {
          bufferedItems.push(...pubIds);

          while (bufferedItems.length >= limit) {
            const itemsToCache = bufferedItems.slice(0, limit);
            const cacheKey = `${REDIS_KEYS.CURATED_PUBLICATIONS}:${mainFocus}:${pageNumber}`;
            console.log(
              `[curate] Caching ${itemsToCache.length} publications for page ${pageNumber}`,
            );
            await rSet(cacheKey, JSON.stringify(pubIds), REDIS_EXPIRY.HALF_DAY);

            bufferedItems = bufferedItems.slice(limit);
            pageNumber++;
          }
        }

        if (results.length < limit) {
          hasNextPage = false;
        } else {
          page++;
        }
      }
    }

    if (bufferedItems.length > 0) {
      // Cache the remaining items as a new page
      const cacheKey = `${REDIS_KEYS.CURATED_PUBLICATIONS}:${mainFocus}:${pageNumber}`;
      console.log(
        `[curate] Caching remaining ${bufferedItems.length} publications for page ${pageNumber}`,
      );
      await rSet(
        cacheKey,
        JSON.stringify(bufferedItems),
        REDIS_EXPIRY.HALF_DAY,
      );
    }

    console.log(`[curate] [${mainFocus}] Done curating publications 🎉`);
  } catch (error) {
    console.error(
      `[curate] [${mainFocus}] Error curating publications:`,
      error,
    );
  }
};

export { curatePublications };
