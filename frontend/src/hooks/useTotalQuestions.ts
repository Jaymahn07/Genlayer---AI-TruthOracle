import { useQuery } from '@tanstack/react-query';
import { client, CONTRACT_ADDRESS } from '@/lib/genlayer';
import type { QuestionResult } from '@/lib/types';
import { normalizeGenLayerData } from '@/lib/utils';

export function useTotalQuestions() {
    return useQuery({
        queryKey: ['totalQuestions'],
        queryFn: async () => {
            console.log('useTotalQuestions: Fetching total questions from:', CONTRACT_ADDRESS);
            try {
                const result = await client.readContract({
                    address: CONTRACT_ADDRESS as any,
                    functionName: 'get_total_questions',
                    args: [],
                } as any);
                console.log('useTotalQuestions: result', result);

                // Use robust normalization
                const normalized = normalizeGenLayerData(result);
                console.log('useTotalQuestions: normalized', normalized);

                // If result was just a number/bigint, normalizeGenLayerData returns a number
                if (typeof normalized === 'number') {
                    return { success: true, total: normalized };
                }

                return normalized as QuestionResult;
            } catch (error) {
                console.error('useTotalQuestions: error', error);
                throw error;
            }
        },
        refetchInterval: 5000, // Refetch every 5 seconds
    });
}
