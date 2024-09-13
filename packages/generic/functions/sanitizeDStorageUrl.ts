import { IPFS_GATEWAY_URL, IRYS_GATEWAY_URL } from "@tape.xyz/constants";

export const sanitizeDStorageUrl = (url: string) => {
  const ipfsGateway = `${IPFS_GATEWAY_URL}/`;
  const irysGateway = `${IRYS_GATEWAY_URL}/`;
  if (!url) {
    return url;
  }

  return url
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${ipfsGateway}/${url}`)
    .replace("https://ipfs.io/ipfs/", ipfsGateway)
    .replace("https://ipfs.infura.io/ipfs/", ipfsGateway)
    .replace("https://gateway.pinata.cloud/ipfs/", ipfsGateway)
    .replace("https://gw.ipfs-lens.dev/ipfs/", ipfsGateway)
    .replace("ipfs://ipfs/", ipfsGateway)
    .replace("ar://", irysGateway)
    .replace("ipfs://", ipfsGateway);
};
