import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, CONTRACT_ADDRESS, getWalletClient } from '@/lib/genlayer';
import { useWalletStore } from '@/store/wallet';
import { toast } from 'sonner';

export function useAskQuestion() {
    const queryClient = useQueryClient();
    const account = useWalletStore((state) => state.account);

    return useMutation({
        mutationFn: async (question: string) => {
            console.log('AskQuestion: mutation started');
            console.log('Account:', account);
            console.log('Contract Address:', CONTRACT_ADDRESS);

            if (!account || !account.address) {
                throw new Error('Wallet not connected or address missing');
            }

            // 1. Send transaction through Wallet Client (MetaMask)
            const walletClient = getWalletClient();
            console.log('Calling walletClient.writeContract...');
            const txHash = await walletClient.writeContract({
                account: { address: account.address as `0x${string}` },
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'ask_question',
                args: [question],
                value: 0n,
                // Gas Limit Fix: Force 1,000,000 to satisfy MetaMask's >21000 requirement
                gas: 1_000_000n,
            } as any);
            console.log('Transaction hash received:', txHash);

            // 2. Poll for status through RPC Client (forced RPC)
            console.log('Waiting for transaction confirmation (polling GenLayer RPC)...');

            let retries = 100; // Increased retries to keep same total timeout
            let delay = 2000; // 2 seconds each
            let receipt: any = null;

            while (retries > 0) {
                try {
                    // 2a. Check transaction object
                    const tx = await client.getTransaction({ hash: txHash as any });

                    // 2b. Check receipt object
                    const receiptObj = await (client as any).getTransactionReceipt({ hash: txHash as any }).catch(() => null);

                    // Prioritize receipt status as it's more reliable for confirmation
                    const status = (receiptObj?.status || tx?.status)?.toString().toLowerCase();
                    console.log(`Step ${41 - retries}: Status Check`, {
                        txStatus: tx?.status,
                        receiptStatus: receiptObj?.status,
                        normalized: status
                    });

                    // Update receipt variable for the return statement
                    receipt = receiptObj || tx;

                    // Caldera/Standard RPCs use "success", "0x1", or 1. 
                    // GenLayer specific ones use "ACCEPTED" or "FINALIZED".
                    if (status === 'success' || status === 'accepted' || status === 'finalized' || status === '0x1' || status === '1') {
                        console.log('Transaction confirmed! Proceeding...');
                        break;
                    }

                    if (status === 'canceled' || status === '0x0' || status === '0') {
                        throw new Error('Transaction failed or was canceled.');
                    }
                } catch (e) {
                    console.warn('Error fetching status, retrying...', e);
                }

                await new Promise((resolve) => setTimeout(resolve, delay));
                retries--;
            }

            // Normalize final status for checking
            const finalStatus = receipt?.status?.toString().toLowerCase();
            const isConfirmed = ['success', 'accepted', 'finalized', '0x1', '1'].includes(finalStatus);

            if (!receipt || !isConfirmed) {
                throw new Error(`Transaction confirmation timed out. Last status: ${receipt?.status || 'UNKNOWN'}.`);
            }

            return {
                txHash,
                result: receipt.result || receipt.returnData,
            };
        },
        onSuccess: (data) => {
            toast.success('Question submitted successfully!', {
                description: `Transaction: ${data.txHash.slice(0, 10)}...`,
            });
            queryClient.invalidateQueries({ queryKey: ['totalQuestions'] });
            queryClient.invalidateQueries({ queryKey: ['recentQuestions'] });
        },
        onError: (error: Error) => {
            toast.error('Failed to submit question', {
                description: error.message,
            });
        },
    });
}
