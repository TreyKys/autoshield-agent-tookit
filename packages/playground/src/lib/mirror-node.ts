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

        // 1. Get transactions of type CONTRACTCREATE
        const res = await fetch(`${MIRROR_NODE_API}/transactions?account.id=${accountIdOrEvm}&transactiontype=CONTRACTCREATE&limit=20&order=desc`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();

        const transactions = data.transactions || [];
        const contracts: ContractInfo[] = [];

        // 2. Extract Contract IDs from receipts
        for (const tx of transactions) {
            // The entity_id in the transaction record is usually the created contract?
            // Or we check the 'transfers' or specific receipt fields?
            // Mirror Node transaction object has 'entity_id' which is the main entity involved.
            // For ContractCreate, it should be the new contract ID.
            if (tx.entity_id) {
                // Fetch contract details to get EVM address
                const contractDetails = await fetchContractDetails(tx.entity_id);
                if (contractDetails) {
                    contracts.push(contractDetails);
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
        const data = await res.json();
        return data.bytecode || null;
    } catch (e) {
        console.error("Bytecode Fetch Error:", e);
        return null;
    }
}
