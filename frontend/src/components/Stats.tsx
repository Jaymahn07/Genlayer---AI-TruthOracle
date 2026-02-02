import { useTotalQuestions } from '@/hooks/useTotalQuestions';
import { CONTRACT_ADDRESS } from '@/lib/genlayer';

export function Stats() {
    const { data } = useTotalQuestions();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold text-white">
                    {data?.total ?? 0}
                </div>
                <div className="text-sm text-white/80 mt-1">Total Questions</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Contract Address</div>
                <code className="text-xs text-white break-all">
                    {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
                </code>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Network</div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">GenLayer Studionet</span>
                </div>
            </div>
        </div>
    );
}
