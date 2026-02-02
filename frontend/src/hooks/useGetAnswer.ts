import { useQuery } from '@tanstack/react-query';
import { client, CONTRACT_ADDRESS } from '@/lib/genlayer';
import type { QuestionResult } from '@/lib/types';
import { normalizeGenLayerData } from '@/lib/utils';

export function useGetAnswer(questionId: number | null) {
    return useQuery({
        queryKey: ['answer', questionId],
        queryFn: async () => {
            if (questionId === null) return null;

            try {
                const result = await client.readContract({
                    address: CONTRACT_ADDRESS as any,
                    functionName: 'get_answer',
                    args: [questionId],
                } as any);
                console.log('useGetAnswer: result', result);

                // Use robust normalization
                const normalized = normalizeGenLayerData(result);
                console.log('useGetAnswer: normalized', normalized);

                return normalized as QuestionResult;
            } catch (error) {
                console.error('useGetAnswer: error', error);
                throw error;
            }
        },
        enabled: questionId !== null && questionId > 0,
    });
}
