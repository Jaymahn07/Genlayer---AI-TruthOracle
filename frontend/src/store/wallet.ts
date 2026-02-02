import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WalletState } from '@/lib/types';
import { toast } from 'sonner';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const useWalletStore = create<WalletState>()(
    persist(
        (set) => ({
            account: null,
            isConnected: false,

            connectWallet: async () => {
                if (!window.ethereum) {
                    toast.error('MetaMask not found', {
                        description: 'Please install MetaMask or another browser wallet.',
                    });
                    return;
                }

                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts',
                    });

                    if (accounts && accounts.length > 0) {
                        set({
                            account: {
                                address: accounts[0],
                            },
                            isConnected: true,
                        });
                        toast.success('Wallet connected!');
                    }
                } catch (error: any) {
                    console.error('Failed to connect wallet:', error);
                    toast.error('Connection failed', {
                        description: error.message,
                    });
                    throw error;
                }
            },

            disconnectWallet: () => {
                set({ account: null, isConnected: false });
                toast.info('Wallet disconnected');
            },
        }),
        {
            name: 'wallet-storage',
            partialize: (state) => ({ account: state.account, isConnected: state.isConnected }),
        }
    )
);
