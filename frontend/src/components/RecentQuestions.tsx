import { useState } from 'react';
import { useRecentQuestions } from '@/hooks/useRecentQuestions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function RecentQuestions() {
    const [count, setCount] = useState(10);
    const { data, isLoading, isFetching, refetch } = useRecentQuestions(count);

    return (
        <Card>
            <CardHeader>
                <CardTitle>📋 Recent Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg text-sm text-gray-300">
                    📖 Read-only operation. No gas required.
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Number of questions:
                            </label>
                            <Input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                                min="1"
                                max="50"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={() => refetch()} disabled={isFetching}>
                                {isFetching ? <span className="animate-spin inline-block">⏳</span> : '🔄 Refresh'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {isLoading && (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-4 bg-gray-700/50 rounded-lg animate-pulse">
                                        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data && data.success && data.questions && data.questions.length > 0 ? (
                            data.questions.map((q) => (
                                <div
                                    key={q.question_id}
                                    className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-primary hover:bg-gray-700/70 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-sm font-semibold text-primary">
                                            ID {q.question_id}
                                        </span>
                                        <Badge variant={q.answer as any}>
                                            {q.answer.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-white text-sm">{q.question}</p>
                                </div>
                            ))
                        ) : (
                            !isLoading && (
                                <div className="p-8 text-center text-gray-400">
                                    No questions found
                                </div>
                            )
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
