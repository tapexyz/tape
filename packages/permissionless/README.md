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
npx hardhat verify 0xCdeA6d8372E3a8837A6714E0828aFE37bB054040 --network polygon
hh verify 0xCdeA6d8372E3a8837A6714E0828aFE37bB054040 --network polygon
```

```
npx hardhat run scripts/deploy.ts --network polygonMumbai 
npx hardhat verify 0xe80e50dB1E8105d530f0c11Efe1f76767e812AFc --network polygonMumbai
hh verify 0xe80e50dB1E8105d530f0c11Efe1f76767e812AFc --network polygonMumbai
```
