// sdk/perps-sdk.ts
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

export class PerpsSDK {
  private provider: ethers.providers.JsonRpcProvider;
  private signer: ethers.Signer;
  private contractAddress: string;
  private abi: any;

  constructor(rpcUrl: string, privateKey: string, contractAddress: string, abi: any) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.contractAddress = contractAddress;
    this.abi = abi;
  }

  async openPosition(
    marketIndex: number,
    sizeDelta: string, // e.g., "1000" for 1000 USD size
    isLong: boolean,
    leverage: number
  ) {
    const contract = new ethers.Contract(this.contractAddress, this.abi, this.signer);
    
    const tx = await contract.openPosition(
      marketIndex,
      isLong,
      parseUnits(sizeDelta, 18),
      leverage * 100 // many protocols use basis points
    );
    
    console.log('Transaction sent:', tx.hash);
    await tx.wait();
    console.log('Position opened successfully!');
    return tx;
  }

  async closePosition(marketIndex: number) {
    const contract = new ethers.Contract(this.contractAddress, this.abi, this.signer);
    const tx = await contract.closePosition(marketIndex);
    await tx.wait();
    console.log('Position closed');
  }

  async getPosition(marketIndex: number, trader: string) {
    const contract = new ethers.Contract(this.contractAddress, this.abi, this.provider);
    return await contract.getPosition(marketIndex, trader);
  }

  async getFundingRate(marketIndex: number) {
    const contract = new ethers.Contract(this.contractAddress, this.abi, this.provider);
    const rate = await contract.fundingRate(marketIndex);
    return formatUnits(rate, 18);
  }
}

// Example usage
// const sdk = new PerpsSDK('https://rpc.example.com', '0xYOUR_PRIVATE_KEY', '0xCONTRACT_ADDRESS', ABI);
// sdk.openPosition(0, '5000', true, 10); // Long 5k USD with 10x leverage
