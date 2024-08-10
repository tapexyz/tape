# tsdb

1.

```bash
pnpm tsdb:migrate
```

2.

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
SELECT create_hypertable('"Event"', 'created', migrate_data => true);
SELECT add_retention_policy('"Event"', INTERVAL '1 year');
```
