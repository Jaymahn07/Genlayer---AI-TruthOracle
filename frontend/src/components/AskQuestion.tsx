import { useState } from 'react';
import { useAskQuestion } from '@/hooks/useAskQuestion';
import { useWalletStore } from '@/store/wallet';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function AskQuestion() {
    const [question, setQuestion] = useState('');
    const { mutate: askQuestion, isPending, data } = useAskQuestion();
    const isConnected = useWalletStore((state) => state.isConnected);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        askQuestion(question, {
            onSuccess: () => {
                setQuestion('');
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>❓ Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg text-sm text-gray-300">
                    💰 This requires gas. Connect your wallet first.
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Question:
                        </label>
                        <Textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., Is the Earth round?"
                            rows={4}
                            disabled={!isConnected || isPending}
                        />
                        <div className="mt-1 text-xs text-gray-400">
                            {question.length} characters
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!isConnected || !question.trim() || isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Submitting...
                            </>
                        ) : (
                            'Ask Question'
                        )}
                    </Button>
                </form>

                {data && data.result && (
                    <div className="mt-4 p-4 bg-green-900/20 border border-green-600 rounded-lg">
                        <div className="text-sm font-semibold text-green-400 mb-2">
                            ✅ Question Submitted!
                        </div>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-400">Question ID:</span>{' '}
                                <span className="font-mono">{data.result.question_id}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Answer:</span>{' '}
                                <Badge variant={data.result.answer as any}>
                                    {data.result.answer?.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                                TX: {data.txHash.slice(0, 10)}...{data.txHash.slice(-8)}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
