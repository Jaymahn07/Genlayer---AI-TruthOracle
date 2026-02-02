import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Stats } from './components/Stats';
import WalletConnect from './components/WalletConnect';
import { AskQuestion } from './components/AskQuestion';
import { GetAnswer } from './components/GetAnswer';
import { RecentQuestions } from './components/RecentQuestions';
import { verifyContract, CONTRACT_ADDRESS } from './lib/genlayer';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    useEffect(() => {
        // Verify contract existence on mount
        verifyContract(CONTRACT_ADDRESS);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <Toaster position="top-right" richColors />

                {/* Header */}
                <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-primary/20 border border-primary/30">
                                    <img
                                        src="/logo.jpg"
                                        alt="AI Truth Oracle Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        AI Truth Oracle
                                    </h1>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Powered by GenLayer Testnet
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-300">Live</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    {/* Stats */}
                    <Stats />

                    {/* Wallet Connection */}
                    <div className="mb-6">
                        <WalletConnect />
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <AskQuestion />
                        <GetAnswer />
                    </div>

                    {/* Recent Questions */}
                    <RecentQuestions />
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm mt-12">
                    <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
                        <p>
                            Built by Jay using{' '}
                            <a
                                href="https://genlayer.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                GenLayer
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </QueryClientProvider>
    );
}

export default App;
