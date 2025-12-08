// Helper to interact with Hedera Mirror Node
// This runs on the client side

const MIRROR_NODE_API = "https://testnet.mirrornode.hedera.com/api/v1";

export interface ContractInfo {
    contract_id: string;
    evm_address: string;
    created_timestamp: string;
    file_id: string | null;
    memo: string;
}

// Fetch contracts created by an account by looking at transactions
export async function fetchContractsByAccount(accountIdOrEvm: string): Promise<ContractInfo[]> {
    try {
        console.log(`[MirrorNode] Fetching contracts created by ${accountIdOrEvm}`);

        // 1. Get transactions of all types for the account (filtering by type via query param is flaky on some nodes)
        // We fetch the latest 100 transactions to find recent deployments
        const res = await fetch(`${MIRROR_NODE_API}/transactions?account.id=${accountIdOrEvm}&limit=100&order=desc`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data: any = await res.json();

        const transactions = data.transactions || [];
        const contracts: ContractInfo[] = [];
        const seenIds = new Set<string>();

        // 2. Extract Contract IDs from receipts
        for (const tx of transactions) {
            // Check for both native HAPI ContractCreate and EthereumTransaction (which might be a contract deployment)
            if (tx.name === 'CONTRACTCREATEINSTANCE' || tx.name === 'CONTRACTCREATE' || (tx.name === 'ETHEREUMTRANSACTION' && !tx.function_parameters)) {
                // For EthereumTransaction, if it's a deployment, 'call_function_parameters' might be empty or specific?
                // Actually, the mirror node usually sets 'entity_id' to the created contract ID if one was created.
                if (tx.entity_id && !seenIds.has(tx.entity_id)) {
                    // It's a contract creation or interaction.
                    // Verify if it's actually a contract by fetching details.
                    try {
                        const contractDetails = await fetchContractDetails(tx.entity_id);
                        if (contractDetails && contractDetails.evm_address) {
                            contracts.push(contractDetails);
                            seenIds.add(tx.entity_id);
                        }
                    } catch (err) {
                        // Ignore if not a valid contract
                    }
                }
            }
        }

        return contracts;

    } catch (e) {
        console.error("Mirror Node Error:", e);
        return [];
    }
}

async function fetchContractDetails(contractId: string): Promise<ContractInfo | null> {
    try {
        const res = await fetch(`${MIRROR_NODE_API}/contracts/${contractId}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

export async function fetchContractBytecode(contractIdOrAddress: string): Promise<string | null> {
    try {
        const res = await fetch(`${MIRROR_NODE_API}/contracts/${contractIdOrAddress}/bytecode`);
        if (!res.ok) return null; // 404 if no bytecode or not found
        const data: any = await res.json();
        return data.bytecode || null;
    } catch (e) {
        console.error("Bytecode Fetch Error:", e);
        return null;
    }
}
