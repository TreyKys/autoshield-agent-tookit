import { createThirdwebClient, defineChain } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";

// Ensure environment variables are set
const CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || process.env.THIRDWEB_CLIENT_ID;
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const PRIVATE_KEY = process.env.THIRDWEB_PRIVATE_KEY;
const TREASURY_ACCOUNT = process.env.NEXT_PUBLIC_TREASURY_ACCOUNT_ID;

if (!CLIENT_ID) {
    console.warn("⚠️ NEXT_PUBLIC_THIRDWEB_CLIENT_ID or THIRDWEB_CLIENT_ID is not set.");
}

// Hedera Testnet Chain ID: 296
export const HEDERA_TESTNET = defineChain({
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpc: "https://testnet.hashio.io/api",
  testnet: true,
});

export function getAgentClient() {
    if (!SECRET_KEY) {
        throw new Error("THIRDWEB_SECRET_KEY is required for server-side agent operations.");
    }
    return createThirdwebClient({
        clientId: CLIENT_ID!,
        secretKey: SECRET_KEY,
    });
}

export function getAgentAccount() {
    const client = getAgentClient();
    if (!PRIVATE_KEY) {
        throw new Error("THIRDWEB_PRIVATE_KEY is required for agent transactions.");
    }
    return privateKeyToAccount({
        client,
        privateKey: PRIVATE_KEY as `0x${string}`,
    });
}

export function getTreasuryAccount() {
    return TREASURY_ACCOUNT;
}
