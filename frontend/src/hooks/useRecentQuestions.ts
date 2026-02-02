import { useQuery } from '@tanstack/react-query';
import { client, CONTRACT_ADDRESS } from '@/lib/genlayer';
import type { QuestionResult } from '@/lib/types';
import { normalizeGenLayerData } from '@/lib/utils';

export function useRecentQuestions(count: number = 10) {
    return useQuery({
        queryKey: ['recentQuestions', count],
        queryFn: async () => {
            try {
                const result = await client.readContract({
                    address: CONTRACT_ADDRESS as any,
                    functionName: 'get_recent_questions',
                    args: [count],
                } as any);
                console.log('useRecentQuestions: result', result);

                // Use robust normalization
                const normalized = normalizeGenLayerData(result);
                console.log('useRecentQuestions: normalized', normalized);

                return normalized as QuestionResult;
            } catch (error) {
                console.error('useRecentQuestions: error', error);
                throw error;
            }
        },
        refetchInterval: 5000, // Sync every 5 seconds
    });
}
