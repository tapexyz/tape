import { WORKER_RATES_URL, WORKER_STATS_URL } from "@tape.xyz/constants";

type Rate = {
  currency: string;
  fiatsymbol: string;
  price: string;
};

type CreatorEarnings = {
  [key: string]: string;
};

type Stats = {
  acts: number;
  posts: number;
  comments: number;
  mirrors: number;
  creatorEarnings: CreatorEarnings;
};

const tokensWithSixDecimals = [
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
];

const toUsd = (creatorEarnings: CreatorEarnings, rates: Rate[]): number => {
  let totalUsd = 0;

  for (const [currency, earnings] of Object.entries(creatorEarnings)) {
    const rate = rates.find((r) => r.currency === currency);
    if (rate) {
      const decimals = tokensWithSixDecimals.includes(currency) ? 6 : 18;
      const usdValue =
        (Number.parseInt(earnings) / 10 ** decimals) *
        Number.parseFloat(rate.price);
      totalUsd += usdValue;
    }
  }

  return totalUsd;
};

export const getPlatformtats = async () => {
  try {
    const ratesResponse = await fetch(WORKER_RATES_URL);
    const response = await fetch(WORKER_STATS_URL);
    const rates = (await ratesResponse.json()).rates as Rate[];
    const data = (await response.json()).stats as Stats;
    const usdEarnings = toUsd(data.creatorEarnings, rates);

    return {
      ...data,
      creatorEarnings: usdEarnings
    };
  } catch {
    return {
      acts: 0,
      posts: 0,
      comments: 0,
      mirrors: 0,
      creatorEarnings: 0
    };
  }
};
