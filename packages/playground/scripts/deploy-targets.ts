
import { Client, AccountId, PrivateKey, ContractCreateFlow, ContractFunctionParameters } from "@hashgraph/sdk";
import * as fs from 'fs';
import * as path from 'path';

// Define paths for output
const PLAYGROUND_TARGETS_PATH = path.resolve(__dirname, '../src/data/targets.json');
const AGENT_TARGETS_PATH = path.resolve(__dirname, '../../nullshot-agent/src/data/targets.json');

// Configuration
const ACCOUNT_ID = "0.0.6928410";
const PRIVATE_KEY = "0xcb7a3a82a8457f28bac3142ba94a7aac30dc68e23cb76f3e103be391b3850d62";

// Very simple contract bytecode (Storage contract) to serve as a placeholder for all vulnerabilities
// In a real scenario, we would compile distinct contracts.
// For the demo, the 'address' and 'metadata' matter more than the actual bytecode behavior.
const PLACEHOLDER_BYTECODE = "608060405234801561001057600080fd5b5060bf8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636057361d1460375780636d4ce63c146051575b600080fd5b604f60048036036020811015604b57600080fd5b8101908080359060200190929190505050606b565b005b605960048036036060811015606557600080fd5b506070565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea26469706673582212204c3510e4708785633634024c0f3295982e0523a675073e51f50a8d6e9389201964736f6c63430008070033";

// Map names to mock vulnerability types
const CONTRACTS = [
    { name: "Bank_Reentrancy", type: "Reentrancy", file: "Bank_Reentrancy.sol" },
    { name: "Token_Overflow", type: "Integer Overflow", file: "Token_Overflow.sol" },
    { name: "Admin_Access", type: "Access Control", file: "Admin_Access.sol" },
    { name: "Logic_Unchecked", type: "Unchecked Call", file: "Logic_Unchecked.sol" },
    { name: "Data_Visibility", type: "Private Data Exposure", file: "Data_Visibility.sol" }
];

async function deploy() {
    console.log(`Starting deployment to Hedera Testnet...`);
    console.log(`Operator: ${ACCOUNT_ID}`);

    if (!PRIVATE_KEY) {
        throw new Error("Private Key missing");
    }

    const client = Client.forTestnet();

    // Attempt to parse the key correctly. The error suggested INVALID_SIGNATURE.
    // The key starts with 0x, suggesting ECDSA.
    let operatorKey: PrivateKey;
    try {
        if (PRIVATE_KEY.startsWith("0x")) {
            operatorKey = PrivateKey.fromStringECDSA(PRIVATE_KEY);
        } else {
            operatorKey = PrivateKey.fromString(PRIVATE_KEY);
        }
    } catch (e) {
        console.log("Standard parsing failed, trying DER...");
        operatorKey = PrivateKey.fromStringDer(PRIVATE_KEY);
    }

    client.setOperator(AccountId.fromString(ACCOUNT_ID), operatorKey);

    const results = [];

    for (const contract of CONTRACTS) {
        console.log(`Deploying ${contract.name}...`);

        try {
            // Deploy using ContractCreateFlow which handles file upload + contract create
            // Since we are using short bytecode, this is fine.
            const transaction = new ContractCreateFlow()
                .setBytecode(PLACEHOLDER_BYTECODE)
                .setGas(100_000);

            const txResponse = await transaction.execute(client);
            const receipt = await txResponse.getReceipt(client);
            const contractId = receipt.contractId;
            const solidityAddress = contractId?.toSolidityAddress();

            console.log(` - Deployed ${contract.name} at ${contractId} (EVM: 0x${solidityAddress})`);

            results.push({
                name: contract.name,
                contractId: contractId?.toString(),
                address: `0x${solidityAddress}`,
                vulnerability: contract.type,
                filename: contract.file
            });

        } catch (error) {
            console.error(`Failed to deploy ${contract.name}:`, error);
        }
    }

    // Output JSON
    const output = {
        timestamp: new Date().toISOString(),
        network: "Hedera Testnet",
        contracts: results
    };

    const jsonContent = JSON.stringify(output, null, 2);

    // Ensure directories exist
    fs.mkdirSync(path.dirname(PLAYGROUND_TARGETS_PATH), { recursive: true });
    fs.mkdirSync(path.dirname(AGENT_TARGETS_PATH), { recursive: true });

    // Write files
    fs.writeFileSync(PLAYGROUND_TARGETS_PATH, jsonContent);
    console.log(`Wrote targets to ${PLAYGROUND_TARGETS_PATH}`);

    fs.writeFileSync(AGENT_TARGETS_PATH, jsonContent);
    console.log(`Wrote targets to ${AGENT_TARGETS_PATH}`);

    process.exit(0);
}

deploy().catch((err) => {
    console.error(err);
    process.exit(1);
});
