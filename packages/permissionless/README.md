# Tape Signup Contract

| Network           | Address                                      |
| ----------------- | -------------------------------------------- |
| `Polygon Mainnet` | `0x68357D5F02a3913132577c7aC0847feade9a05aC` |
| `Polygon Mumbai`  | `0x21970AD5c43e90184A62674fAC54f4Bed030Fb74` |

Try running some of the following tasks:

### Compile
```
npx hardhat compile
```

### Deploy
```
npx hardhat run scripts/deploy.ts --network polygon 
npx hardhat verify 0x68357D5F02a3913132577c7aC0847feade9a05aC --network polygon
hh verify 0x68357D5F02a3913132577c7aC0847feade9a05aC --network polygon
```

```
npx hardhat run scripts/deploy.ts --network polygonMumbai 
npx hardhat verify 0x21970AD5c43e90184A62674fAC54f4Bed030Fb74 --network polygonMumbai 
```