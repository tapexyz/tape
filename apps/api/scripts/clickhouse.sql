-- Events
CREATE TABLE events (
  id UUID DEFAULT generateUUIDv4(),
  name String,
  actor Nullable(String),
  properties Nullable(String),
  url Nullable(String),
  city Nullable(String),
  country LowCardinality(String),
  region Nullable(String),
  referrer Nullable(String),
  platform String,
  browser Nullable(String),
  browser_version Nullable(String),
  os Nullable(String),
  utm_source Nullable(String),
  utm_medium Nullable(String),
  utm_campaign Nullable(String),
  utm_term Nullable(String),
  utm_content Nullable(String),
  fingerprint Nullable(String),
  created DateTime DEFAULT now()
) ENGINE = MergeTree
ORDER BY created;
