import axios from 'axios';
import { z } from 'zod';

// We put the API key directly in the app to eliminate the backend as requested.
const INDEIX_API_KEY = 'ix_live_f0caa9fb05bd438880e1010f8a790cc9_efafdf411bea43c045475f8cd95d09fd813b385f1486e25e';
const BASE_URL = 'https://api.indeix.com/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${INDEIX_API_KEY}`,
    'Accept': 'application/json'
  }
});

// Zod schemas for runtime validation
export const TokenSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  price: z.number().nullable(),
  market_cap: z.number().nullable(),
  volume_24h: z.number().nullable(),
  change_24h: z.number().nullable(),
  logo_url: z.string().nullable(),
  balance: z.number(),
  value_usd: z.number().nullable(),
  is_spam: z.boolean(),
});

export type Token = z.infer<typeof TokenSchema>;

export const WalletResponseSchema = z.object({
  address: z.string(),
  total_value_usd: z.number(),
  tokens: z.array(TokenSchema),
});

export type WalletData = z.infer<typeof WalletResponseSchema>;

// Mock Data Generator for wallet holdings
// Since Indeix API is for token prices (not wallet portfolio balances),
// we mock the wallet balances and merge them with live prices from Indeix.
const MOCK_WALLET_HOLDINGS = [
  { id: "0x912CE59144191C1204E64559FE8253a0e49E6548", name: "Arbitrum", symbol: "ARB", balance: 1500.5, logo_url: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" },
  { id: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", name: "USD Coin", symbol: "USDC", balance: 450.0, logo_url: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" }
];

export const fetchWalletData = async (address: string): Promise<WalletData> => {
  try {
    const holdings = MOCK_WALLET_HOLDINGS;
    
    // Fetch live data from Indeix for each token concurrently
    const tokens = await Promise.all(holdings.map(async (holding) => {
      let liveData = null;
      try {
        const response = await apiClient.get(`/tokens/${holding.id}`, {
          params: { include: 'price,liquidity,risk' }
        });
        liveData = response.data;
      } catch (error) {
        console.log(`Fallback for ${holding.id} (Indeix returned 404 or error)`);
      }
      
      const price = liveData?.price?.usd || 0;
      const change_24h = liveData?.price?.change_24h || 0;
      const is_spam = liveData?.risk?.honeypot || false;
      const liquidity = liveData?.liquidity?.usd || null;
      
      return {
        id: holding.id,
        name: holding.name,
        symbol: liveData?.symbol || holding.symbol,
        price: price || null,
        market_cap: liquidity,
        volume_24h: null,
        change_24h: change_24h,
        logo_url: holding.logo_url,
        balance: holding.balance,
        value_usd: price ? holding.balance * price : 0,
        is_spam: is_spam,
      };
    }));

    const total_value_usd = tokens.filter(t => !t.is_spam).reduce((acc, t) => acc + (t.value_usd || 0), 0);
    
    const responseData = {
      address,
      total_value_usd,
      tokens
    };

    return WalletResponseSchema.parse(responseData);
  } catch (error) {
    console.error(`Error processing wallet ${address}:`, error);
    throw error;
  }
};
