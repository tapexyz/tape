import { LensEndpoint } from "./endpoints";

export const TAPE_APP_NAME = "Tape";
export const TAPE_APP_DESCRIPTION = "Talk, Amplify, Post, Explore";
export const TAPE_USER_AGENT =
  "Tape/1.0 (compatible; TapeMedia/1.0; +https://tape.xyz)";

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT ?? "mainnet";
export const IS_MAINNET = LENS_ENV === "mainnet";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_PRODUCTION = !IS_DEVELOPMENT;

export const STATIC_ASSETS = "https://static.tape.xyz";
export const TAPE_WEBSITE_URL = IS_MAINNET
  ? "https://tape.xyz"
  : "https://testnet.tape.xyz";
export const FALLBACK_THUMBNAIL_URL = `${STATIC_ASSETS}/images/fallback-thumbnail.webp`;
export const FALLBACK_COVER_URL = `${STATIC_ASSETS}/images/fallback-cover.svg`;
export const OG_IMAGE = `${STATIC_ASSETS}/brand/og.png`;
export const IMAGEKIT_URL = "https://ik.imagekit.io/lenstubeik";

// infinite scroll
export const INFINITE_SCROLL_ROOT_MARGIN = "800px";

export const IMAGE_TRANSFORMATIONS = {
  AVATAR: "tr:w-60,h-60",
  AVATAR_LG: "tr:w-300,h-300",
  THUMBNAIL: "tr:w-720,h-404",
  THUMBNAIL_V: "tr:w-404,h-720",
  SQUARE: "tr:w-200,h-200"
};

// lens
export const MAINNET_API_URL = LensEndpoint.Mainnet;
export const TESTNET_API_URL = LensEndpoint.Testnet;
export const STAGING_API_URL = LensEndpoint.Staging;
export const LENS_API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL;

// api urls
export const TAPE_EMBED_URL = IS_MAINNET
  ? "https://embed.tape.xyz"
  : "https://embed-testnet.tape.xyz";
export const TAPE_API_URL = IS_MAINNET
  ? "https://api.tape.xyz"
  : "http://localhost:3000";

// tape addresses
export const TAPE_SIGNUP_PROXY_ADDRESS = IS_MAINNET
  ? "0xD0f6d9676d36F5f4AF5765fCb78c388B51577327"
  : "0xe6869F02F97229E95116A9647b1b005140c80A49";

// lens addresses
export const LENS_PERMISSIONLESS_CREATOR_ADDRESS = IS_MAINNET
  ? "0x0b5e6100243f793e480DE6088dE6bA70aA9f3872"
  : "0xCb4FB63c3f13CB83cCD6F10E9e5F29eC250329Cc";
export const LENSHUB_PROXY_ADDRESS = IS_MAINNET
  ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
  : "0xC1E77eE73403B8a7478884915aA599932A677870";
export const WMATIC_TOKEN_ADDRESS = IS_MAINNET
  ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
  : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const TESTNET_ALLOWED_TOKENS = [
  {
    address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    decimals: 18,
    name: "Wrapped Matic",
    symbol: "WMATIC"
  },
  {
    address: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
    decimals: 18,
    name: "DAI Stablecoin",
    symbol: "DAI"
  },
  {
    address: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23",
    decimals: 18,
    name: "USD Coin",
    symbol: "USDC"
  }
];

// lens
export const LENS_TESTNET_RPCS = ["https://rpc.testnet.lens.dev"];

// polygon
export const POLYGON_RPC_URLS = IS_MAINNET
  ? [
      "https://rpc.ankr.com/polygon",
      "https://polygon.llamarpc.com",
      "https://polygon-bor-rpc.publicnode.com"
    ]
  : [
      "https://rpc.ankr.com/polygon_amoy",
      "https://rpc-amoy.polygon.technology",
      "https://polygon-amoy-bor-rpc.publicnode.com"
    ];
export const POLYGONSCAN_URL = IS_MAINNET
  ? "https://polygonscan.com"
  : "https://amoy.polygonscan.com";
export const ETHERSCAN_URL = IS_MAINNET
  ? "https://etherscan.io"
  : "https://goerli.etherscan.io";
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80002;

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 10000 : 0; // in MB
export const IPFS_GATEWAY_URL = "https://gw.ipfs-lens.dev/ipfs";
export const EVER_ENDPOINT = "https://endpoint.4everland.co";
export const EVER_REGION = "4EVERLAND";
export const EVER_BUCKET_NAME = "tape-2024";

// walletconnect
export const WC_PROJECT_ID = "bf790b6b57570b99567abd1677b7415d";
export const EXPLORER_RECOMMENDED_WALLET_IDS = [
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask
  "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18", // zerion
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // rainbow
  "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a", // uniswap
  "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927" // ledger live
];

// livepeer
export const LIVEPEER_STUDIO_API_KEY = IS_PRODUCTION
  ? "ade26a09-c774-4898-a269-883551f1c5df"
  : "";

// api urls
export const WORKER_RATES_URL = `${TAPE_API_URL}/rates`;
export const WORKER_STATS_URL = `${TAPE_API_URL}/stats`;
export const WORKER_TRAILS_URL = `${TAPE_API_URL}/trails`;
export const WORKER_IRYS_METADATA_UPLOAD_URL = `${TAPE_API_URL}/metadata`;
export const WORKER_LOGTAIL_INGEST_URL = `${TAPE_API_URL}/tail`;
export const WORKER_STS_TOKEN_URL = `${TAPE_API_URL}/sts`;
export const WORKER_DID_URL = `${TAPE_API_URL}/did`;
export const WORKER_TOWER_URL = `${TAPE_API_URL}/tower`;
export const WORKER_OEMBED_URL = `${TAPE_API_URL}/oembed`;
export const WORKER_VERIFIED_URL = `${TAPE_API_URL}/verified`;
export const WORKER_CURATED_PROFILES_URL = `${TAPE_API_URL}/curated/profiles`;
export const WORKER_TOGGLES_URL = `${TAPE_API_URL}/toggles`;
export const WORKER_AVATAR_URL = `${TAPE_API_URL}/avatar`;
export const WORKER_ALLOWED_TOKENS_URL = `${TAPE_API_URL}/allowed-tokens`;

// redis
export const REDIS_KEYS = {
  TOWER: "tower",
  TRAILS: "trails",
  FIAT_RATES: "fiat-rates",
  PLATFORM_STATS: "platform-stats",
  ALLOWED_TOKENS: "allowed-tokens",
  PROFILE_TOGGLES: "profile-toggles",
  CURATED_PROFILES: "curated-profiles",
  VERIFIED_PROFILES: "verified-profiles",
  CURATED_PUBLICATIONS: "curated-publications"
};

// irys
export const IRYS_GATEWAY_URL = "https://gateway.irys.xyz";
export const IRYS_CONNECT_MESSAGE = "Estimating video upload cost...";
export const REQUESTING_SIGNATURE_MESSAGE = "Requesting signature...";
export const MOONPAY_URL = IS_MAINNET
  ? "https://buy.moonpay.com"
  : "https://buy-sandbox.moonpay.com";

// error messages
export const ERROR_MESSAGE = "Oops, something went wrong!";
export const SIGN_IN_REQUIRED = "Login to continue";

// App Ids
export const TAPE_APP_ID = "tape";
export const LENSTUBE_APP_ID = "lenstube";
export const LENSTUBE_BYTES_APP_ID = "lenstube-bytes";
export const ALLOWED_APP_IDS = [
  LENSTUBE_APP_ID
  // 'lenster',
  // 'orb',
  // 'hey',
  // 'buttrfly',
  // 'lensplay',
  // 'diversehq'
];

// official
export const TAPE_X_HANDLE = "tapexyz";
export const TAPE_GITHUB_HANDLE = "tapexyz";
export const TAPE_LOGO = `${STATIC_ASSETS}/brand/logo.svg`;
export const TAPE_STATUS_PAGE = "https://status.tape.xyz";
export const TAPE_FEEDBACK_URL = "https://feedback.tape.xyz";

// admin
export const ADMIN_IDS = IS_MAINNET ? ["0x2d"] : [];
export const TAPE_ADMIN_ADDRESS = "0xB89560D7b33ea8d787EaaEfbcE1268f8991Db9E1";

// lens
export const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/webm",
  "video/quicktime",
  "video/mov"
];
export const ALLOWED_AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav"
];
export const ALLOWED_UPLOAD_MIME_TYPES = [
  ...ALLOWED_VIDEO_MIME_TYPES,
  ...ALLOWED_AUDIO_MIME_TYPES
];

export const LENS_NAMESPACE_PREFIX = IS_MAINNET ? "lens/" : "test/";
export const LEGACY_LENS_HANDLE_SUFFIX = IS_MAINNET ? ".lens" : ".test";

// other apps
export const HEY_WEBSITE_URL = IS_MAINNET
  ? "https://hey.xyz"
  : "https://testnet.hey.xyz";

// banners
export const SHOW_GITCOIN_BANNER = false;
export const GITCOIN_LIVE_ROUND = 23;

// cache control
export const CACHE_CONTROL = {
  FOR_ONE_YEAR: "public, max-age=31536000, s-maxage=31536000",
  FOR_ONE_MONTH: "public, max-age=2592000, s-maxage=2592000",
  FOR_ONE_WEEK: "public, max-age=604800, s-maxage=604800",
  FOR_ONE_DAY: "public, max-age=86400, s-maxage=86400",
  FOR_ONE_HOUR: "public, max-age=3600, s-maxage=3600",
  FOR_FIFTEEN_MINUTE: "public, max-age=900, s-maxage=900",
  FOR_FIVE_MINUTE: "public, max-age=300, s-maxage=300"
};
