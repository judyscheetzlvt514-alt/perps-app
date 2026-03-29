

// scripts/trade-bot.ts
import { PerpsSDK } from '../sdk/perps-sdk';
import axios from 'axios';

async function main() {
  const sdk = new PerpsSDK(
    process.env.RPC_URL!,
    process.env.PRIVATE_KEY!,
    process.env.PERPS_CONTRACT!,
    require('../abis/Perps.json')
  );

  const marketIndex = 0; // e.g., BTC-USD
  const threshold = 0.02; // 2% price move

  setInterval(async () => {
    try {
      // Fetch current price (example: from Binance or on-chain oracle)
      const { data } = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      const price = parseFloat(data.price);

      const position = await sdk.getPosition(marketIndex, await sdk.signer.getAddress());

      if (!position.size && price > 60000) {
        await sdk.openPosition(marketIndex, '1000', true, 5); // Long if price > 60k
        console.log('Opened long position');
      } else if (position.size > 0 && price < 58000) {
        await sdk.closePosition(marketIndex);
        console.log('Closed position');
      }
    } catch (error) {
      console.error('Error in trading bot:', error);
    }
  }, 10000); // Check every 10 seconds
}

main().catch(console.error);
