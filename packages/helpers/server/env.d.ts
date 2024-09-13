declare namespace NodeJS {
  interface ProcessEnv {
    TAPE_DATABASE_URL: string;
    INDEXER_DATABASE_URL: string;
  }
}
