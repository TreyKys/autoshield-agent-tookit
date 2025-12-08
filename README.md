# HUNT: The Autonomous Smart Contract Immunologist

## Overview
**HUNT** is a decentralized AI agent that acts as an autonomous immunologist for the blockchain. Built on the **NullShot Agent Framework** and the **Model Context Protocol (MCP)**, HUNT proactively scans mempools and smart contracts for vulnerabilities. Instead of just alerting a human (who might be sleeping), HUNT autonomously negotiates a "cure" with the protocol’s governance, deploys a verified patch from its "Library of Cures," and secures the asset on-chain before an attacker can exploit it.

### Tagline
*The Autonomous Smart Contract Immunologist.*

---

## Objectives & Alignment

### A. Raising Awareness of NullShot Agent & MCP
HUNT demonstrates the power of the **Model Context Protocol (MCP)** by moving beyond simple text generation. We utilize MCP to bridge the gap between the Large Language Model (LLM) and on-chain state.
- **MCP Implementation:** A custom MCP server exposes Hedera blockchain tools (`scan_contract`, `estimate_gas`, `submit_proposal`) as executable functions to the NullShot Agent.
- **Framework Utility:** HUNT proves that the NullShot Framework can orchestrate complex, multi-step workflows—from code analysis (reading) to transaction execution (writing)—without human hand-holding.

### B. Innovation in Decentralized AI & Web3 Workflows
Most current AI agents are passive observers. HUNT is an **active participant** in the economy.
- **The "Library of Cures":** Unlike other AI dev tools that hallucinate (and often break) code, HUNT relies on a deterministic library of pre-verified, audited patches (e.g., standard ReentrancyGuards). The AI identifies the problem, but the solution is cryptographically verified and safe.
- **Autonomous Negotiation:** HUNT innovates on the workflow by treating security as a market. It doesn't just patch; it negotiates a bounty for its services on-chain, creating a sustainable economic model for decentralized security.

### C. Engaging Blockchain Ecosystems (Hedera)
We chose **Hedera** specifically to solve the "Race Condition" problem in autonomous security.
- **Fair Ordering:** On other chains, if an agent tries to patch a vulnerability, a hacker can front-run the transaction. Hedera’s Hashgraph consensus ensures Fair Ordering, meaning if HUNT submits the patch first, it is processed first.
- **Low-Latency Defense:** Hedera’s speed allows HUNT to operate in the brief window between a vulnerability being deployed and it being discovered by attackers.

---

## Architecture

Our current prototype operates on a 4-stage loop:

1.  **The Hunter (Diagnosis):** The NullShot agent scans bytecode using Regex and AST parsing to identify specific vulnerability signatures (e.g. Unprotected UUPS Upgrades).
2.  **The Broker (Negotiation):** The agent calculates a fix price + gas fees and proposes a fix to the target protocol (User).
3.  **The Surgeon (Execution):** Upon approval (Payment), the agent retrieves the correct patch from the Library of Cures and executes the batch of upgrades via the Hedera network using its own secure wallet.
4.  **The Brain (Learning):** Successful patches and operations are recorded immutably to the Hedera Consensus Service (HCS), updating the agent's context for future scans.

---

## Setup & Installation

### Prerequisites
- Node.js v22+
- pnpm
- A Hedera Testnet Account (ECDSA preferred)
- ThirdWeb Client ID

### Environment Variables
Create a `.env.local` file in `packages/playground/`:

```bash
# ThirdWeb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID="your_client_id"
THIRDWEB_SECRET_KEY="your_secret_key" # Required for server-side Agent execution
THIRDWEB_PRIVATE_KEY="your_agent_private_key" # The Agent's Wallet (Must have HBAR)

# Hedera Configuration
NEXT_PUBLIC_TREASURY_ACCOUNT_ID="0.0.xxxxx" # Where user payments are sent
NEXT_PUBLIC_HCS_TOPIC_ID="0.0.xxxxx" # Topic for Agent Logs
HEDERA_ACCOUNT_ID="0.0.xxxxx" # For HCS Logging (if using SDK directly)
HEDERA_PRIVATE_KEY="302..." # For HCS Logging
```

### Running the Application

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Start the Playground:**
    ```bash
    pnpm dev
    ```
    Access the app at `http://localhost:3000`.

### Development Notes
- The `Surgeon` executes upgrades via a server-side API Route (`/api/agent/fix`) to simulate a secure, autonomous agent environment.
- The `Hunter` queries the Hedera Mirror Node directly to find contracts deployed by the connected user.
- **Deployment:** The project is configured for Netlify deployment. Ensure all env vars are set in the Netlify dashboard.

---

## Future Roadmap

-   **The HUNT Training Module (Simulation):** A "Sandbox Dojo" for AI agents to run thousands of simulations on a private Hedera shadow fork before touching mainnet.
-   **The Open "Library of Cures":** Decentralizing the library so developers can submit new cures and earn royalties.
-   **Cross-Chain Expansion:** Using Chainlink CCIP to monitor and patch contracts on other EVM chains from a single Hedera control center.

---

*HUNT is not just a tool; it is Active Defense Infrastructure. We are moving from "Code is Law" to "Code is Immune."*
