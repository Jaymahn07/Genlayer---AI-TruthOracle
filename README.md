# AI Truth Oracle 🔮

> A decentralized oracle that answers yes/no questions about real-world events using AI consensus on GenLayer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GenLayer](https://img.shields.io/badge/Built%20on-GenLayer-blue)](https://genlayer.com)


## 🌟 Overview

The **AI Truth Oracle** is a smart contract that can verify real-world facts without trusting any single party. It uses multiple AI validators that independently search the web, analyze information, and reach consensus on the truth.

### What Makes This Special?

- **🌐 No API Keys Required**: Validators search the web directly
- **🤖 AI-Powered Consensus**: Multiple AI nodes verify each answer
- **🔒 Decentralized**: No single point of failure
- **📊 Transparent**: All questions and answers stored on-chain
- **🐍 Python-Based**: Written in familiar Python syntax
- **⚡ Fast**: Get answers in seconds

## 📸 Demo

```python
# Ask a question
oracle.ask_question("Did it rain in Lagos today?")

# Response:
{
  "success": true,
  "question_id": 1,
  "answer": "yes"
}
```

## 🎯 Use Cases

- **Insurance Claims**: "Did a hurricane hit Miami on this date?"
- **Sports Betting**: "Did Manchester United win their last match?"
- **Market Events**: "Did Bitcoin hit $100k this month?"
- **Supply Chain**: "Did the shipment arrive at the port today?"
- **Reputation**: "Is Elon Musk still CEO of Tesla?"
- **Weather Verification**: "Did it snow in New York yesterday?"

## 🚀 Quick Start

### Prerequisites

- Docker (v26+)
- Node.js (v18+)
- 30 minutes

### Installation

1. **Install GenLayer CLI**
   ```bash
   npm install -g genlayer
   ```

2. **Initialize GenLayer**
   ```bash
   genlayer init
   ```
   - Choose your LLM provider (Llama3 for local/free, OpenAI for best results)
   - Wait for 5 validator nodes to spin up

3. **Start GenLayer Studio**
   ```bash
   genlayer studio
   ```
   Your browser will open to `http://localhost:8080`

4. **Deploy the Contract**
   - Create a new contract in Studio
   - Copy the code from `AITruthOracle.py`
   - Click "Deploy"

### Your First Question

```python
# In GenLayer Studio, call the write method:
ask_question("Did Bitcoin hit $100k this month?")

# Get the answer:
get_answer(1)  # Returns the question and answer
```

## 📖 Documentation

**Full Tutorial**: [Read the complete tutorial](https://medium.com/@joshuapereira2018/building-an-ai-truth-oracle-on-genlayer-a-complete-tutorial-899a5eb8b131?postPublishedType=initial) for step-by-step instructions, code explanations, and advanced features.

**Key Topics Covered**:
- How AI consensus works
- Understanding non-deterministic smart contracts
- Equivalence principles explained
- Testing and troubleshooting
- Advanced features and extensions

## 🏗️ Architecture

```
User Question
     ↓
Intelligent Contract
     ↓
5 Validator Nodes (parallel execution)
     ├─→ Node 1: Search web → Analyze with AI → Proposal
     ├─→ Node 2: Search web → Analyze with AI → Proposal
     ├─→ Node 3: Search web → Analyze with AI → Proposal
     ├─→ Node 4: Search web → Analyze with AI → Proposal
     └─→ Node 5: Search web → Analyze with AI → Proposal
     ↓
Consensus Engine (AI compares proposals)
     ↓
Majority Agreement?
     ├─→ YES: Answer finalized on-chain ✅
     └─→ NO: Transaction fails, retry ❌
```

## 🔧 Contract API

### Write Methods (Modify State)

#### `ask_question(question: str)`
Ask a yes/no question to the oracle.

**Parameters**:
- `question` (string): The yes/no question to ask

**Returns**:
```json
{
  "success": true,
  "question_id": 1,
  "answer": "yes" | "no" | "unknown"
}
```

**Example**:
```python
ask_question("Is Elon Musk still CEO of Tesla?")
```

---

### View Methods (Read State)

#### `get_answer(question_id: int)`
Retrieve a specific question and its answer.

**Parameters**:
- `question_id` (int): The ID of the question

**Returns**:
```json
{
  "success": true,
  "question": "Did it rain in Lagos today?",
  "answered": true,
  "answer": "yes"
}
```

#### `get_total_questions()`
Get the total number of questions asked.

**Returns**:
```json
{
  "success": true,
  "total": 42
}
```

#### `get_recent_questions(count: int)`
Get the most recent N questions and answers.

**Parameters**:
- `count` (int): Number of recent questions to retrieve

**Returns**:
```json
{
  "success": true,
  "count": 3,
  "questions": [
    {
      "question_id": 3,
      "question": "Is Bitcoin over $100k?",
      "answered": true,
      "answer": "no"
    },
    ...
  ]
}
```

## 💡 Example Questions

### ✅ Good Questions (Factual, Verifiable)
- "Did it rain in Lagos on January 27, 2026?"
- "Did Bitcoin close above $50,000 yesterday?"
- "Is Satya Nadella the CEO of Microsoft?"
- "Did the Lakers win their game on January 26, 2026?"
- "Was there an earthquake in California today?"

### ❌ Bad Questions (Ambiguous, Speculative)
- "Is the weather nice?" (subjective)
- "Will Bitcoin go up tomorrow?" (speculative)
- "What happened today?" (too broad)
- "Did they win?" (missing context)
- "Is AI good?" (philosophical, no factual answer)

## 🎨 Advanced Features

### Add Confidence Scoring

Track answer certainty:

```python
confidence_scores: TreeMap[u256, int]

# In ask_question, extract confidence from AI response
confidence = parsed.get("confidence", 50)
self.confidence_scores[qid] = confidence
```

### Add Source Attribution

Store which sources validators used:

```python
sources: TreeMap[u256, str]

# Update prompt to request sources
"sources": ["https://source1.com", "https://source2.com"]

# Store sources
self.sources[qid] = json.dumps(source_list)
```

### Implement Caching

Prevent duplicate questions within a time window:

```python
question_hashes: TreeMap[str, u256]

# Check if recently asked
if question in self.question_hashes:
    last_qid = self.question_hashes[question]
    # Return cached answer if recent
```

### Add Categories

Organize questions by topic:

```python
categories: TreeMap[u256, str]

def ask_question(self, question: str, category: str = "general"):
    # Store category: "weather", "finance", "sports", etc.
    self.categories[qid] = category
```

## 🛠️ Development

### Project Structure

```
ai-truth-oracle/
├── AITruthOracle.py          # Main contract
├── README.md                  # This file
├── ai-truth-oracle-tutorial.md  # Full tutorial
├── tests/
│   └── test_oracle.py        # Test suite
└── examples/
    ├── weather_oracle.py     # Weather-specific oracle
    ├── price_oracle.py       # Crypto price oracle
    └── sports_oracle.py      # Sports results oracle
```

### Testing Locally

```bash
# Start GenLayer
genlayer studio

# In Studio:
# 1. Deploy contract
# 2. Call write methods with test questions
# 3. Verify answers with view methods
# 4. Check logs for consensus process
```

### Running Tests

```python
# Test basic functionality
ask_question("Did it rain in Lagos today?")
assert get_answer(1)["answered"] == True

# Test invalid inputs
ask_question("")  # Should handle gracefully

# Test history
ask_question("Question 1")
ask_question("Question 2")
assert get_total_questions()["total"] == 2
```

## 📊 Consensus Mechanism

The oracle uses **`gl.eq_principle.prompt_comparative()`** for consensus:

1. **Each validator executes independently**:
   - Searches the web
   - Analyzes with AI
   - Generates answer

2. **Validators compare results**:
   - Don't need identical responses
   - AI evaluates semantic equivalence
   - "yes" and "affirmative" both match

3. **Consensus decision**:
   - Majority agreement → Success ✅
   - Split decision → Fail and retry ❌

**Example**:
```
Validator 1: "yes" (found it on Reuters)
Validator 2: "yes" (confirmed by BBC)
Validator 3: "yes" (verified on official site)
Validator 4: "yes" (AP News reports)
Validator 5: "yes" (data shows affirmative)

Result: 5/5 consensus → "yes" finalized on-chain
```

## 🔒 Security Considerations

### Attack Resistance
- **Sybil Attack**: Requires controlling majority of validators (expensive)
- **False Data**: Multiple validators cross-verify from different sources
- **Manipulation**: Consensus fails if validators disagree

### Best Practices
- ✅ Use multiple validator nodes (5+ recommended)
- ✅ Validate user inputs
- ✅ Handle JSON parsing errors gracefully
- ✅ Set appropriate gas limits
- ✅ Sanitize questions before AI processing

### Limitations
- Can't answer speculative questions (future predictions)
- Accuracy depends on available web sources
- New/breaking events may lack consensus initially
- Some topics may have conflicting sources

## 🌍 Deployment

### Local Testnet (Development)
```bash
# Already running with `genlayer studio`
# Free, fast, 5 local validators
```

### GenLayer Testnet (Public Testing)
```bash
genlayer deploy --network testnet --contract AITruthOracle.py

# Get test tokens from faucet
# Shared testnet with other developers
```

### GenLayer Mainnet (Production)
```bash
genlayer deploy --network mainnet --contract AITruthOracle.py

# Requires mainnet tokens
# Real validators, real value
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas for Contribution
- Additional example oracles (weather, sports, finance)
- Improved prompt engineering for better consensus
- Frontend web interface
- Test suite expansion
- Documentation improvements
- Performance optimizations

## 🐛 Troubleshooting

### "Consensus Not Reached"
- **Solution**: Make question more specific and factual
- **Example**: "Did it rain?" → "Did it rain in Lagos on Jan 27, 2026?"

### "Invalid JSON Response"
- **Solution**: Strengthen prompt formatting requirements
- Add explicit JSON structure examples

### "Web Access Failed"
- **Solution**: Check internet connection, restart GenLayer
- Try different LLM provider (OpenAI has better web access)

### All Answers Return "unknown"
- **Solution**: Ask more specific, verifiable questions
- Ensure LLM provider has web access enabled

**Full troubleshooting guide**: See [tutorial documentation](./ai-truth-oracle-tutorial.md#troubleshooting)

## 📚 Resources

- **[GenLayer Documentation](https://docs.genlayer.com/)** - Official docs
- **[Intelligent Contracts Guide](https://docs.genlayer.com/contracts)** - Contract development
- **[Equivalence Principles](https://docs.genlayer.com/consensus)** - Consensus mechanisms
- **[GenLayer Discord](https://discord.gg/genlayer)** - Community support
- **[Full Tutorial](./ai-truth-oracle-tutorial.md)** - Complete walkthrough

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [GenLayer](https://genlayer.com) - The blockchain for Intelligent Contracts
- Inspired by the need for decentralized, trustless oracles
- Thanks to the GenLayer community for feedback and support

## 📧 Contact

- **Questions?** Join [GenLayer Discord](https://discord.gg/genlayer)
- **Issues?** Open a [GitHub Issue](https://github.com/yourusername/ai-truth-oracle/issues)
- **Ideas?** Start a [Discussion](https://github.com/yourusername/ai-truth-oracle/discussions)

---

**Built with ❤️ using GenLayer Intelligent Contracts**

⭐ Star this repo if you found it helpful!

## 🚀 What's Next?

Try building these variations:
- **Weather Oracle**: Specialized weather queries
- **Price Oracle**: Track crypto/stock prices
- **Sports Oracle**: Verify game scores
- **Prediction Market**: Build a market using this oracle
- **DAO Governance**: Vote based on real-world facts

**Happy Building!** 🎉
