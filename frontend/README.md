# AI Truth Oracle - Frontend

A production-ready TypeScript/React frontend for the GenLayer Truth Oracle dApp.

## 🚀 Features

- ✅ **Wallet Management**: Connect existing wallet or create new one
- ✅ **Ask Questions**: Submit questions to the AI oracle (write operation)
- ✅ **Get Answers**: Fetch specific question answers (read operation)
- ✅ **Recent Questions**: View list of recent questions
- ✅ **Real-time Stats**: Total questions counter with auto-refresh
- ✅ **Modern UI**: Responsive design with Tailwind CSS and glassmorphism
- ✅ **Toast Notifications**: User-friendly feedback for all actions
- ✅ **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **GenLayer JS SDK** - Blockchain interactions
- **TanStack Query** - Async state management
- **Zustand** - Wallet state management
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI primitives
- **Sonner** - Toast notifications

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

The `.env` file is already configured with:

```env
VITE_CONTRACT_ADDRESS=0xbF18087649c2bF72312E751790f4d2f73e7F2882
VITE_GENLAYER_RPC_URL=https://testnet-rpc.genlayer.com/api
```

## 🏃 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📱 Usage

### 1. Connect Wallet

**Option A: Connect Existing Wallet**
- Click "🔗 Connect Wallet"
- Enter your private key (from GenLayer Studio)
- Click "Connect"

**Option B: Create New Wallet**
- Click "➕ Create New Wallet"
- Save the displayed private key
- Get testnet tokens from [GenLayer Faucet](https://faucet.genlayer.com/)

### 2. Ask a Question

- Enter your question in the textarea
- Click "Ask Question"
- Wait for transaction confirmation
- View the answer and transaction hash

### 3. Get Specific Answer

- Enter a question ID
- Click "Fetch"
- View the question and answer

### 4. View Recent Questions

- Set the number of questions to fetch
- Click "🔄 Refresh"
- Scroll through the list

## 🎨 UI Components

All components are built with:
- **Responsive design** - Works on mobile, tablet, and desktop
- **Loading states** - Skeleton loaders and spinners
- **Error handling** - User-friendly error messages
- **Accessibility** - Proper ARIA labels and keyboard navigation

## 🔐 Security

- Private keys are stored in browser localStorage
- Never sent to any server
- Only used for signing transactions locally
- Clear warnings about saving private keys

## 📚 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI primitives
│   │   ├── WalletConnect.tsx
│   │   ├── AskQuestion.tsx
│   │   ├── GetAnswer.tsx
│   │   ├── RecentQuestions.tsx
│   │   └── Stats.tsx
│   ├── hooks/              # React Query hooks
│   │   ├── useAskQuestion.ts
│   │   ├── useGetAnswer.ts
│   │   ├── useTotalQuestions.ts
│   │   └── useRecentQuestions.ts
│   ├── lib/                # Utilities and config
│   │   ├── genlayer.ts    # GenLayer client
│   │   ├── types.ts       # TypeScript types
│   │   └── utils.ts       # Helper functions
│   ├── store/              # State management
│   │   └── wallet.ts      # Zustand wallet store
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🐛 Troubleshooting

**Problem: Wallet not connecting**
- Ensure private key starts with `0x`
- Check that you're using a valid GenLayer private key

**Problem: Transaction fails**
- Ensure you have testnet tokens
- Check wallet is connected
- Verify network is GenLayer Testnet

**Problem: Build errors**
- Delete `node_modules` and run `npm install` again
- Ensure Node.js version is 18 or higher

## 🔗 Links

- [GenLayer Docs](https://docs.genlayer.com/)
- [GenLayer Studio](https://studio.genlayer.com/)
- [GenLayer Faucet](https://faucet.genlayer.com/)
- [GenLayer JS SDK](https://github.com/genlayerlabs/genlayer-js)

## 📄 License

MIT
