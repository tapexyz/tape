import { ALLOWED_APP_IDS, REDIS_KEYS, TAPE_APP_ID } from "@tape.xyz/constants";
import { REDIS_EXPIRY, indexerDb, rSet, tapeDb } from "@tape.xyz/server";

const curatedPublications = async () => {
  try {
    let page = 1;
    const limit = 50;

    const profiles = await tapeDb.profile.findMany({
      select: { profileId: true },
      where: { isCurated: true },
    });
    const profileIds = profiles.map(({ profileId }) => profileId);
    console.log(`[curate] Found ${profileIds.length} curated profiles`);

    const batchSize = 100;
    const batches = [];
    for (let i = 0; i < profileIds.length; i += batchSize) {
      batches.push(profileIds.slice(i, i + batchSize));
    }
    for (const batch of batches) {
      console.log(
        `[curate] Processing batch with ${batch.length} profile IDs...`,
      );
      let hasNextPage = true;
      const alreadyQueried = new Set<string>();

      while (hasNextPage) {
        const offset = (page - 1) * limit;
        const cacheKey = `${REDIS_KEYS.CURATED_PUBLICATIONS}:${page}`;
        const appIds = [ALLOWED_APP_IDS, TAPE_APP_ID];
        const skipPubIds = alreadyQueried.size
          ? Array.from(alreadyQueried)
          : [""];

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
              AND pv.publication_id NOT IN ($3:csv)
          )
          SELECT
            nh.tld,
            nh.local_name,
            rp.profile_id,
            rp.publication_id,
            pr.content_uri,
            pm.main_content_focus
          FROM
            ranked_publications rp
          JOIN
            publication.record pr ON rp.publication_id = pr.publication_id
          JOIN
            publication.metadata pm ON rp.publication_id = pm.publication_id
          JOIN
            namespace.handle_link nhl ON rp.profile_id = nhl.token_id
          JOIN
            namespace.handle nh ON nhl.handle_id = nh.handle_id
          WHERE
            rp.rn <= $4
          ORDER BY rp.rn
          LIMIT $4 OFFSET $5;
        `,
          [appIds, profileIds, skipPubIds, limit, offset],
        );

        for (const { publication_id } of results) {
          alreadyQueried.add(publication_id);
        }

        if (results.length) {
          await rSet(cacheKey, JSON.stringify(results), REDIS_EXPIRY.HALF_DAY);
        }

        if (results.length < limit) {
          hasNextPage = false;
        } else {
          page++;
        }
      }
    }
    console.log("[curate] Done curating publications");
  } catch (error) {
    console.error("[curate] Error curating publications:", error);
  }
};

export { curatedPublications };
