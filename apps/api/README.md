# Dev

```sh
npx wrangler d1 execute tape-prod-d1 --local --file=./schema.sql
npx wrangler d1 execute tape-prod-d1 --local --command="SELECT * FROM Verified"
```

# Prod

```sh
npx wrangler d1 execute tape-prod-d1 --file=./schema.sql
npx wrangler d1 execute tape-prod-d1 --command="SELECT * FROM Verified"
```
