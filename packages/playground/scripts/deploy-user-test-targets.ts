import { createThirdwebClient, getContract, prepareContractCall, defineChain } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { deployContract } from "thirdweb/deploys";
import { VulnerableBoxArtifact } from '../src/components/hunt/contracts/VulnerableBox';
import { PausableBoxArtifact } from '../src/components/hunt/contracts/PausableBox';

const secretKey = process.env.THIRDWEB_SECRET_KEY;
const clientId = process.env.THIRDWEB_CLIENT_ID;
const privateKey = process.env.USER_PRIVATE_KEY; // We'll pass this in

if (!privateKey || !clientId) {
    console.error("Missing configuration");
    process.exit(1);
}

const client = createThirdwebClient({
    clientId,
    secretKey
});

const account = privateKeyToAccount({
    client,
    privateKey: privateKey as `0x${string}`,
});

const chain = defineChain({
    id: 296,
    name: "Hedera Testnet",
    nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
    rpc: "https://testnet.hashio.io/api",
    testnet: true,
});

async function main() {
    console.log(`🚀 Deploying contracts with account: ${account.address}`);

    // 1. Deploy PausableBox (Non-upgradeable)
    console.log("Deploying PausableBox (Target 1)...");
    const pausableAddress = await deployContract({
        client,
        chain,
        account,
        bytecode: PausableBoxArtifact.bytecode as `0x${string}`,
        abi: PausableBoxArtifact.abi,
    });
    console.log(`✅ PausableBox deployed at: ${pausableAddress}`);

    // 2. Deploy VulnerableBox 1
    console.log("Deploying VulnerableBox 1 (Target 2)...");
    const v1Address = await deployContract({
        client,
        chain,
        account,
        bytecode: VulnerableBoxArtifact.bytecode as `0x${string}`,
        abi: VulnerableBoxArtifact.abi,
    });
    console.log(`✅ VulnerableBox 1 deployed at: ${v1Address}`);

    // 3. Deploy VulnerableBox 2
    console.log("Deploying VulnerableBox 2 (Target 3)...");
    const v2Address = await deployContract({
        client,
        chain,
        account,
        bytecode: VulnerableBoxArtifact.bytecode as `0x${string}`,
        abi: VulnerableBoxArtifact.abi,
    });
    console.log(`✅ VulnerableBox 2 deployed at: ${v2Address}`);

    console.log("\nDeployment Summary:");
    console.log(`- PausableBox: ${pausableAddress}`);
    console.log(`- VulnerableBox 1: ${v1Address}`);
    console.log(`- VulnerableBox 2: ${v2Address}`);
}

main().catch(console.error);
