import { createClient } from 'genlayer-js';
import { localnet, studionet } from 'genlayer-js/chains';


// Configuration based on environment
const chainEnv = import.meta.env.VITE_CHAIN;
const chain = chainEnv === 'studionet' ? studionet : localnet;
const endpoint = import.meta.env.VITE_GENLAYER_RPC_URL;

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;

// Create the client
export const client = createClient({
    chain,
    // Only add endpoint for local development
    ...(endpoint && { endpoint }),
    // Using an object for account forces the SDK to use RPC for eth_call
    account: { address: '0x0000000000000000000000000000000000000000' } as any
});

// Initialize consensus (required for local setup)
let initialized = false;
export async function initializeClient() {
    if (!initialized) {
        console.log(`🔄 Initializing GenLayer Consensus (${chainEnv || 'studionet'})...`);
        await client.initializeConsensusSmartContract();
        initialized = true;
        console.log('✅ GenLayer Consensus Initialized');
    }
}

// Low-level RPC Bridge for compatibility
const originalRequest = (client as any).request.bind(client);
(client as any).request = async (args: any) => {
    const { method, params } = args;

    // Ensure client is initialized before first request
    if (method === 'eth_call' || method === 'eth_sendTransaction') {
        await initializeClient();
    }

    // Fix: Some environments fail if 'from' is the zero address.
    if (method === 'eth_call' && params[0] && params[0].from === '0x0000000000000000000000000000000000000000') {
        delete params[0].from;
    }

    try {
        const result = await originalRequest(args);

        // Intercept hex responses and decode for legacy/simulator compatibility
        if (method === 'eth_call' && typeof result === 'string' && result.startsWith('0x')) {
            const hex = result.slice(2);
            if (hex.length === 64) {
                const val = BigInt(result);
                const data = params[0]?.data || '';

                if (data.includes('6765745f746f74616c5f7175657374696f6e73')) {
                    return { success: true, total: Number(val) };
                }
                if (data.includes('6765745f726563656e745f7175657374696f6e73')) {
                    return { success: true, questions: [], count: Number(val) };
                }
                if (data.includes('6765745f616e73776572')) {
                    return { success: val > 0n };
                }
                return Number(val);
            }
        }
        // Final normalization: Convert Map to plain object for hook compatibility
        if (result instanceof Map) {
            return Object.fromEntries(result);
        }

        return result;
    } catch (error: any) {
        console.error(`🌐 [BRIDGE] RPC Error (${method}):`, error.message);
        throw error;
    }
};

// Wallet client helper
export const getWalletClient = () => {
    return createClient({
        chain,
        ...(endpoint && { endpoint })
    });
};

// Verify contract existence on mount
export async function verifyContract(address: string) {
    if (!address) return;
    try {
        console.log(`🔍 Verifying contract at ${address}...`);
        await initializeClient();
        const result = await client.request({
            method: 'eth_call',
            params: [{ to: address as `0x${string}`, data: '0x' }, 'latest']
        });
        console.log('✅ Contract responding');
        return result;
    } catch (error: any) {
        console.warn('⚠️ Contract verification notice:', error.message);
        return null;
    }
}
