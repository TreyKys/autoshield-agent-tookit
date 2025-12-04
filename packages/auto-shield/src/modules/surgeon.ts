// Act 3: The Surgeon (Execution) 👨‍⚕️
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction, waitForReceipt, defineChain } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { deployContract } from "thirdweb/deploys";
import { VulnerableBoxArtifact } from "../contracts/VulnerableBox.js";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const PRIVATE_KEY = process.env.THIRDWEB_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error("Missing THIRDWEB_PRIVATE_KEY in .env");
}
if (!CLIENT_ID) {
  throw new Error("Missing THIRDWEB_CLIENT_ID in .env");
}

// Hedera Testnet Chain ID: 296
const HEDERA_TESTNET = defineChain(296);

export class Surgeon {
  private client;
  private account;

  constructor() {
    this.client = createThirdwebClient({
      clientId: CLIENT_ID as string,
      secretKey: SECRET_KEY
    });
    this.account = privateKeyToAccount({
      client: this.client,
      privateKey: PRIVATE_KEY as `0x${string}`,
    });
  }

  async deployTarget(): Promise<string> {
    console.log("\n🏗️  Act 0: Deploying Vulnerable Target Contract...");

    const contractAddress = await deployContract({
      client: this.client,
      chain: HEDERA_TESTNET,
      account: this.account,
      bytecode: VulnerableBoxArtifact.bytecode as `0x${string}`,
      abi: VulnerableBoxArtifact.abi,
    });

    console.log(`✅ Vulnerable Target Deployed at: ${contractAddress}`);
    return contractAddress;
  }

  async performSurgery(targetAddress: string, cureCode: string): Promise<string> {
    console.log("\n👨‍⚕️ Act 3: The Surgeon is scrubbing in...");
    console.log(`👨‍⚕️ Target: ${targetAddress}`);
    console.log(`👨‍⚕️ Cure Selected: ReentrancyGuard Injection`);

    // Mock "Safe Implementation" address
    const newImplementation = "0x" + "1".repeat(40);

    const contract = getContract({
      client: this.client,
      chain: HEDERA_TESTNET,
      address: targetAddress,
      abi: VulnerableBoxArtifact.abi
    });

    console.log("👨‍⚕️ Injecting cure via 'upgradeTo'...");

    const transaction = prepareContractCall({
      contract,
      method: "upgradeTo",
      params: [newImplementation]
    });

    try {
      const result = await sendTransaction({
        transaction,
        account: this.account
      });

      console.log(`👨‍⚕️ Surgery Successful! Transaction Hash: ${result.transactionHash}`);

      // Optional: Wait for receipt to confirm
      // await waitForReceipt({
      //   client: this.client,
      //   chain: HEDERA_TESTNET,
      //   transactionHash: result.transactionHash
      // });

      return result.transactionHash;
    } catch (error) {
      console.error("❌ Surgery Failed:", error);
      throw error;
    }
  }
}
