// frontend/hooks/usePerps.ts
import { useState } from 'react';
import { ethers } from 'ethers';

export function usePerps() {
  const [loading, setLoading] = useState(false);

  const openLong = async (size: string, leverage: number) => {
    setLoading(true);
    // Connect wallet with ethers + your SDK
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // ... integrate your PerpsSDK here
    setLoading(false);
  };

  return { openLong, loading };
}
