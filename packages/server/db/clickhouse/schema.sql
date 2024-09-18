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

-- Trails
CREATE TABLE trails (
  action LowCardinality(String),
  action_item_id LowCardinality(String),
  acted DateTime DEFAULT now(),
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(acted)
ORDER BY acted
SETTINGS index_granularity = 8192;

-- Total Trails by Action Item ID
CREATE MATERIALIZED VIEW total_trails_by_action_item_id_mv
ENGINE = SummingMergeTree()
ORDER BY action_item_id
AS
SELECT
    action_item_id,
    count() AS item_count
FROM trails
GROUP BY action_item_id;
