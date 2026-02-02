export interface Question {
    question_id: number;
    question: string;
    answer: 'yes' | 'no' | 'unknown';
    answered: boolean;
}

export interface QuestionResult {
    success: boolean;
    question_id?: number;
    question?: string;
    answer?: 'yes' | 'no' | 'unknown';
    answered?: boolean;
    total?: number;
    questions?: Question[];
}

export interface WalletAccount {
    address: string;
}

export interface WalletState {
    account: WalletAccount | null;
    isConnected: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}
