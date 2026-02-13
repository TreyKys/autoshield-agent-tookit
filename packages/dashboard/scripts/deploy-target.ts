// Script to deploy a Target Contract (VulnerableBox) for the Dashboard Demo
import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { deployContract } from "thirdweb/deploys";
import { defineChain } from "thirdweb/chains";
import { VulnerableBoxArtifact } from "../src/contracts/VulnerableBox"; // Importing the artifact
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Load environment variables from the root or local .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../auto-shield/.env') });

const PRIVATE_KEY = process.env.THIRDWEB_PRIVATE_KEY;
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;

if (!PRIVATE_KEY) {
    console.error("Error: THIRDWEB_PRIVATE_KEY not found in environment.");
    process.exit(1);
}

// Hedera Testnet Chain ID: 296
const HEDERA_TESTNET = defineChain(296);

async function main() {
    console.log("🚀 Deploying Vulnerable Target Contract to Hedera Testnet...");

    const client = createThirdwebClient({
        clientId: CLIENT_ID || "demo", // Fallback for safety, but should use env
        secretKey: SECRET_KEY,
    });

    const account = privateKeyToAccount({
        client,
        privateKey: PRIVATE_KEY,
    });

    try {
        const contractAddress = await deployContract({
            client,
            chain: HEDERA_TESTNET,
            account,
            bytecode: VulnerableBoxArtifact.bytecode,
            abi: VulnerableBoxArtifact.abi,
        });

        console.log(`\n✅ Target Contract Deployed Successfully!`);
        console.log(`Address: ${contractAddress}`);
        console.log(`\n👉 Copy this address and put it in your Dashboard .env as VITE_TARGET_ADDRESS`);
        console.log(`\nExample:`);
        console.log(`VITE_TARGET_ADDRESS=${contractAddress}`);

    } catch (error) {
        console.error("❌ Deployment Failed:", error);
        process.exit(1);
    }
}

main();
