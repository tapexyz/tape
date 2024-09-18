import pgp from "pg-promise";

const initOptions: pgp.IInitOptions = {
  error: (err, e) => {
    console.error("[indexer-db] Error:", err?.message || err);
    if (e.query) {
      console.log("[indexer-db] Error Query:", e.query);
      if (e.params) {
        console.log("[indexer-db] Error Parameters:", e.params);
      }
    }
  }
};

const indexerDb = pgp(initOptions)({
  connectionString: process.env.INDEXER_DATABASE_URL,
  port: 6432,
  max: 20
});

export { indexerDb };
