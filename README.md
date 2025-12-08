# HUNT: The Autonomous Smart Contract Immunologist

<div align="center">
  <h3>Active Defense Infrastructure for the Self-Healing Web3</h3>
  <p><i>Submission for the Hedera Hackathon</i></p>
</div>

## 🎯 HUNT Tagline
**The Autonomous Smart Contract Immunologist.**

## 📖 Project Description
HUNT is a decentralized AI agent that acts as an autonomous immunologist for the blockchain. Built on the **NullShot Agent Framework** and the **Model Context Protocol (MCP)**, HUNT proactively scans mempools and smart contracts for vulnerabilities. Instead of just alerting a human (who might be sleeping), HUNT autonomously negotiates a "cure" with the protocol’s governance, deploys a verified patch from its "Library of Cures," and secures the asset on-chain before an attacker can exploit it.

### 🏛️ Alignment with NullShot Objectives
This project directly addresses the judging criteria to maximize impact:

#### Objective A: Raising Awareness of NullShot Agent & MCP
HUNT demonstrates the power of the **Model Context Protocol (MCP)** by moving beyond simple text generation. We utilize MCP to bridge the gap between the Large Language Model (LLM) and on-chain state.
- **MCP Implementation**: We built a custom MCP server that exposes Hedera blockchain tools (`scan_contract`, `estimate_gas`, `submit_proposal`) as executable functions to the NullShot Agent.
- **Framework Utility**: HUNT proves that the NullShot Framework can orchestrate complex, multi-step workflows—from code analysis (reading) to transaction execution (writing)—without human hand-holding.

#### Objective B: Innovation in Decentralized AI & Web3 Workflows
Most current AI agents are passive observers. HUNT is an **active participant** in the economy.
- **The "Library of Cures"**: Unlike other AI dev tools that hallucinate (and often break) code, HUNT relies on a deterministic library of pre-verified, audited patches (e.g., standard ReentrancyGuards). The AI identifies the problem, but the solution is cryptographically verified and safe.
- **Autonomous Negotiation**: HUNT innovates on the workflow by treating security as a market. It doesn't just patch; it negotiates a bounty for its services on-chain, creating a sustainable economic model for decentralized security.

#### Objective C: Engaging Blockchain Ecosystems (Hedera)
We chose **Hedera** specifically to solve the "Race Condition" problem in autonomous security.
- **Fair Ordering**: On other chains, if an agent tries to patch a vulnerability, a hacker can front-run the transaction. Hedera’s Hashgraph consensus ensures **Fair Ordering**, meaning if HUNT submits the patch first, it is processed first.
- **Low-Latency Defense**: Hedera’s speed allows HUNT to operate in the brief window between a vulnerability being deployed and it being discovered by attackers.

---

## 🏗️ Architecture & Groundwork
Our current prototype operates on a 4-stage loop:

1. **The Hunter (Diagnosis)**: The NullShot agent scans bytecode using Regex and AST parsing to identify specific vulnerability signatures.
2. **The Broker (Negotiation)**: The agent proposes a fix to the target protocol, requesting a fee (in HBAR or USDC).
3. **The Surgeon (Execution)**: Upon approval, the agent retrieves the correct patch from our **Library of Cures** and executes a **ContractUpdate** or proxy upgrade via the Hedera network.
   - *Innovation*: Uses an **Atomic Batch Executor** to bundle payment and multiple upgrades into a single transaction.
4. **The Brain (Learning)**: Successful patches are recorded to **HCS (Hedera Consensus Service)**, updating the agent's context for future scans.

---

## 🚀 Installation & Setup Guide

### Prerequisites
- Node.js v22+
- pnpm

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/nullshot/hunt.git
   cd hunt
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure Environment:
   Create a `.env.local` file in `packages/playground`:
   ```env
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID="your_thirdweb_client_id"
   NEXT_PUBLIC_HEDERA_ACCOUNT_ID="your_testnet_account_id"
   NEXT_PUBLIC_HEDERA_PRIVATE_KEY="your_testnet_private_key"
   ```

### Running the App
1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open `http://localhost:3000` (or the port specified in terminal).
3. Connect your Wallet (Hedera Testnet via Metamask/Thirdweb).
4. Click "Initialize Hunt" to start the autonomous loop.

---

## 🔮 Future Developments & Roadmap
We are building HUNT to be the future standard of smart contract security.

### The HUNT Training Module (Simulation)
We are developing a "Sandbox Dojo" for AI agents. Before a HUNT agent is allowed to touch mainnet assets, it must graduate from this training module.
- **Mechanism**: Agents run thousands of simulations on a private Hedera shadow fork, attempting to patch deliberate vulnerabilities.
- **Goal**: This ensures 99.9% reliability and drastically reduces the risk of an agent accidentally locking a protocol during a rescue mission.

### The Open "Library of Cures"
We plan to decentralize the library itself. Innovative developers can submit new "Cures" (patches) for emerging threats.
- **Incentive**: If HUNT uses a developer's specific Cure to save a protocol, that developer earns a micro-royalty from the bounty. This crowdsources security expertise globally.

### Cross-Chain Expansion
While Hedera is our home base due to its security features, future versions of HUNT will utilize **Chainlink CCIP** to monitor and patch contracts on other EVM chains (Ethereum, Polygon) from a single, secure Hedera control center.

---

## 🏁 Conclusion
HUNT is not just a tool; it is **Active Defense Infrastructure**. By combining the NullShot Framework's agentic capabilities with Hedera's speed and security, we have laid the groundwork for a self-healing Web3 ecosystem.

**We are moving from "Code is Law" to "Code is Immune."**
