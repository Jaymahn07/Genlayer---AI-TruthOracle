import React from 'react';
import { useWalletStore } from '@/store/wallet';
import {
    ExitIcon,
    CopyIcon,
    CheckIcon,
    UpdateIcon,
    Component1Icon
} from '@radix-ui/react-icons';
import { toast } from 'sonner';

export default function WalletConnect() {
    const { account, isConnected, connectWallet, disconnectWallet } = useWalletStore();
    const [copied, setCopied] = React.useState<string | null>(null);
    const [isConnecting, setIsConnecting] = React.useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await connectWallet();
        } catch (error) {
            // Error handled in store
        } finally {
            setIsConnecting(false);
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(null), 2000);
    };

    if (!isConnected || !account) {
        return (
            <div className="card-glass p-6 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Component1Icon className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
                <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                    Connect your browser wallet (like MetaMask) to interact with the AI Truth Oracle.
                </p>
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {isConnecting ? (
                        <UpdateIcon className="animate-spin" />
                    ) : (
                        <Component1Icon />
                    )}
                    {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </button>
            </div>
        );
    }

    return (
        <div className="card-glass p-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Wallet Connected
                </h2>
                <button
                    onClick={disconnectWallet}
                    className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                    <ExitIcon /> Disconnect
                </button>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        Wallet Address
                    </label>
                    <div className="flex items-center justify-between gap-4">
                        <code className="text-sm text-emerald-400 font-mono break-all">
                            {account.address}
                        </code>
                        <button
                            onClick={() => copyToClipboard(account.address, 'address')}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                            title="Copy address"
                        >
                            {copied === 'address' ? (
                                <CheckIcon className="text-emerald-500" />
                            ) : (
                                <CopyIcon className="text-slate-400" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 bg-slate-800/30 p-3 rounded-lg">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Connected to GenLayer Testnet</span>
            </div>
        </div>
    );
}
