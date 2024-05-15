# Tape Signup Contract

| Network           | Address                                      |
| ----------------- | -------------------------------------------- |
| `Polygon Mainnet` | `0xD0f6d9676d36F5f4AF5765fCb78c388B51577327` |
| `Polygon Amoy`    | `0xe6869F02F97229E95116A9647b1b005140c80A49` |

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
npx hardhat run scripts/deploy.ts --network polygonAmoy 
npx hardhat verify 0xe6869F02F97229E95116A9647b1b005140c80A49 --network polygonAmoy
hh verify 0xe6869F02F97229E95116A9647b1b005140c80A49 --network polygonAmoy
```
