import { Agent } from '@nullshot/agent';
import { z } from 'zod';
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";
import targets from '../targets.json';

// Initialize Thirdweb Client (Environment variables from Cloudflare context)
// Note: In a Worker/Agent environment, process.env might not work directly if not using Node compatibility.
// We'll access env vars passed to the agent or assume global process.env if polyfilled.

const HEDERA_TESTNET = defineChain(296);

export const agent = new Agent({
  name: "Auto-Shield Agent",
  description: "Autonomous agent for scanning and patching vulnerable contracts on Hedera Testnet.",
  instructions: "You are an autonomous security agent. Your goal is to scan the network for vulnerable contracts and upgrade them to safe implementations. When asked to secure the network, use the 'scan_network' tool to find targets, and then 'upgrade_proxy' to patch them.",
});

// Tool: Scan Network
agent.tool({
  name: "tool_scan_network",
  description: "Scans the known network targets for vulnerabilities.",
  parameters: z.object({}),
  execute: async () => {
    console.log("🔍 Scanning network targets...");
    // Filter for vulnerable targets from the JSON file
    const vulnerable = targets.filter(t => t.status === "Vulnerable");
    return JSON.stringify(vulnerable);
  }
});

// Tool: Upgrade Proxy
agent.tool({
  name: "tool_upgrade_proxy",
  description: "Upgrades a proxy contract to a new implementation.",
  parameters: z.object({
    proxyId: z.string().describe("The ID or Address of the proxy contract to upgrade"),
    newImplementationAddress: z.string().describe("The address of the new, safe implementation contract")
  }),
  execute: async ({ proxyId, newImplementationAddress }, { env }) => {
    console.log(`👨‍⚕️ Upgrading Proxy ${proxyId} to ${newImplementationAddress}...`);

    // In a real agent, we need the private key.
    // For this hackathon demo, we'll assume it's in the env vars passed to the execute context.
    const privateKey = (env as any).THIRDWEB_PRIVATE_KEY;
    const clientId = (env as any).THIRDWEB_CLIENT_ID;

    if (!privateKey || !clientId) {
      throw new Error("Missing Thirdweb credentials in environment.");
    }

    const client = createThirdwebClient({ clientId });
    const account = privateKeyToAccount({ client, privateKey });

    // 1. Get Contract
    const contract = getContract({
      client,
      chain: HEDERA_TESTNET,
      address: proxyId,
    });

    // 2. Prepare Transaction (upgradeTo)
    // Assuming UUPS or Transparent Proxy standard
    const transaction = prepareContractCall({
      contract,
      method: "function upgradeTo(address newImplementation)",
      params: [newImplementationAddress],
    });

    // 3. Send Transaction
    const result = await sendTransaction({
      transaction,
      account,
    });

    return `Success! Upgrade executed. Transaction Hash: ${result.transactionHash}`;
  }
});

export default agent;
