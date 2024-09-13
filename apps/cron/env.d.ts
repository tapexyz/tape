declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_URL: string;
    TAPE_DATABASE_URL: string;
    INDEXER_DATABASE_URL: string;
    CLICKHOUSE_URL: string;
    CLICKHOUSE_PASSWORD: string;
    S3_ACCESS_KEY_ID: string;
    S3_SECRET_ACCESS_KEY: string;
    S3_BUCKET_URL: string;
    EVER_ACCESS_KEY: string;
    EVER_ACCESS_SECRET: string;
  }
}
