# Tape Signup Contract

| Network           | Address                                      |
| ----------------- | -------------------------------------------- |
| `Polygon Mainnet` | `0xD0f6d9676d36F5f4AF5765fCb78c388B51577327` |
| `Polygon Mumbai`  | `0xb9F635c498CdC2dBf95B3A916b007fD16c5506ED` |

Try running some of the following tasks:

### Compile
```
npx hardhat compile
```

### Deploy
```
npx hardhat run scripts/deploy.ts --network polygon 
npx hardhat verify 0xD0f6d9676d36F5f4AF5765fCb78c388B51577327 --network polygon
hh verify 0xD0f6d9676d36F5f4AF5765fCb78c388B51577327 --network polygon
```

```
npx hardhat run scripts/deploy.ts --network polygonMumbai 
npx hardhat verify 0xb9F635c498CdC2dBf95B3A916b007fD16c5506ED --network polygonMumbai
hh verify 0xb9F635c498CdC2dBf95B3A916b007fD16c5506ED --network polygonMumbai
```
