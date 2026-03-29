





























































// scripts/monitor-positions.ts
import { PerpsSDK } from '../sdk/perps-sdk';

async function monitor() {
  const sdk = new PerpsSDK(...); // same init as above

  const address = await sdk.signer.getAddress();
  const markets = [0, 1, 2]; // BTC, ETH, SOL etc.

  for (const market of markets) {
    const pos = await sdk.getPosition(market, address);
    const funding = await sdk.getFundingRate(market);

    console.log(`Market ${market}: Size = ${pos.size}, Funding Rate = ${funding}%`);
  }
}

monitor();
