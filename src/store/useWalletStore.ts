import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWalletData, WalletData } from '../api/client';
import { isValidArcAddress } from '../utils/validation';

export type WalletType = 'Pinned' | 'MyWallets' | 'Watchlist';
export type PrimaryMetric = 'MarketCap' | 'Price' | 'FDV' | 'Liquidity';
export type TokenVisibility = 'All' | 'Valuable' | 'Hidden' | 'Spam';

export interface SavedWallet {
  address: string;
  label: string;
  type: WalletType;
  order: number;
  data: WalletData | null;
  lastUpdated: number | null; // timestamp
}

interface WalletState {
  wallets: SavedWallet[];
  primaryMetric: PrimaryMetric;
  tokenVisibility: TokenVisibility;
  isRefreshing: boolean;
  
  // Actions
  addWallet: (address: string, label: string, type: WalletType) => Promise<void>;
  removeWallet: (address: string) => void;
  setPrimaryMetric: (metric: PrimaryMetric) => void;
  setTokenVisibility: (visibility: TokenVisibility) => void;
  refreshAllWallets: () => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallets: [],
      primaryMetric: 'MarketCap',
      tokenVisibility: 'Valuable',
      isRefreshing: false,

      addWallet: async (address, label, type) => {
        // Strict ARC address validation
        if (!isValidArcAddress(address)) {
          throw new Error('Invalid ARC wallet address');
        }

        // Check if already exists
        const existing = get().wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
        if (existing) throw new Error('Wallet already added');

        // Add optimistically without data
        const newWallet: SavedWallet = {
          address,
          label,
          type,
          order: get().wallets.length,
          data: null,
          lastUpdated: null,
        };

        set((state) => ({ wallets: [...state.wallets, newWallet] }));

        // Fetch initial data
        try {
          const data = await fetchWalletData(address);
          set((state) => ({
            wallets: state.wallets.map(w => 
              w.address === address 
                ? { ...w, data, lastUpdated: Date.now() }
                : w
            )
          }));
        } catch (error) {
          // Keep the wallet but it will have no data, user can refresh later
          console.error('Failed to fetch initial wallet data', error);
          throw new Error('Failed to fetch wallet data');
        }
      },

      removeWallet: (address) => {
        set((state) => ({
          wallets: state.wallets.filter(w => w.address !== address)
        }));
      },

      setPrimaryMetric: (metric) => set({ primaryMetric: metric }),
      setTokenVisibility: (visibility) => set({ tokenVisibility: visibility }),

      refreshAllWallets: async () => {
        set({ isRefreshing: true });
        const { wallets } = get();
        
        try {
          // Batch fetch all wallets
          const promises = wallets.map(w => fetchWalletData(w.address));
          const results = await Promise.allSettled(promises);
          
          set((state) => {
            const updatedWallets = [...state.wallets];
            results.forEach((result, index) => {
              if (result.status === 'fulfilled') {
                updatedWallets[index].data = result.value;
                updatedWallets[index].lastUpdated = Date.now();
              }
            });
            return { wallets: updatedWallets, isRefreshing: false };
          });
        } catch (error) {
          console.error("Refresh failed", error);
          set({ isRefreshing: false });
        }
      },
    }),
    {
      name: 'kore-wallet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
