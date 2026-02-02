import { useState } from 'react';
import { useGetAnswer } from '@/hooks/useGetAnswer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function GetAnswer() {
    const [questionId, setQuestionId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState('');
    const { data, isLoading, isFetching, refetch } = useGetAnswer(questionId);

    const handleFetch = () => {
        const id = parseInt(inputValue);
        if (!isNaN(id) && id > 0) {
            setQuestionId(id);
            refetch();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>🔍 Get Answer</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg text-sm text-gray-300">
                    📖 Read-only operation. No gas required.
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Question ID:
                        </label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter question ID"
                                min="1"
                            />
                            <Button onClick={handleFetch} disabled={isFetching}>
                                {isFetching ? <span className="animate-spin inline-block">⏳</span> : 'Fetch'}
                            </Button>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="p-4 bg-gray-700/50 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                        </div>
                    )}

                    {data && data.success && (
                        <div className="p-4 bg-gray-700/50 rounded-lg space-y-3">
                            <div>
                                <span className="text-sm text-gray-400">Question:</span>
                                <p className="text-white mt-1">{data.question}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-400">Status:</span>
                                <p className="mt-1">
                                    {data.answered ? (
                                        <span className="text-green-400">✅ Answered</span>
                                    ) : (
                                        <span className="text-yellow-400">⏳ Pending</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-400">Answer:</span>
                                <div className="mt-1">
                                    <Badge variant={data.answer as any}>
                                        {data.answer?.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    {data && !data.success && (
                        <div className="p-4 bg-red-900/20 border border-red-600 rounded-lg text-sm text-red-400">
                            ❌ Question not found
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
