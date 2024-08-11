-- Events
CREATE TABLE events (
  id UUID DEFAULT generateUUIDv4(),
  name String,
  actor LowCardinality(Nullable(String)),
  properties Nullable(String),
  url LowCardinality(Nullable(String)),
  city LowCardinality(Nullable(String)),
  country LowCardinality(String),
  region LowCardinality(Nullable(String)),
  referrer LowCardinality(Nullable(String)),
  platform LowCardinality(String),
  browser LowCardinality(Nullable(String)),
  browser_version LowCardinality(Nullable(String)),
  os LowCardinality(Nullable(String)),
  utm_source LowCardinality(Nullable(String)),
  utm_medium LowCardinality(Nullable(String)),
  utm_campaign LowCardinality(Nullable(String)),
  utm_term LowCardinality(Nullable(String)),
  utm_content LowCardinality(Nullable(String)),
  fingerprint LowCardinality(Nullable(String)),
  created DateTime DEFAULT now()
) ENGINE = MergeTree
PARTITION BY toYYYYMM(created)
ORDER BY created
TTL created + INTERVAL 1 YEAR
SETTINGS index_granularity = 8192;
