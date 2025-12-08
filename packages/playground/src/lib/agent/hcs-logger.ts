import { Client, TopicMessageSubmitTransaction } from "@hashgraph/sdk";

const OPERATOR_ID = process.env.HEDERA_ACCOUNT_ID;
const OPERATOR_KEY = process.env.HEDERA_PRIVATE_KEY; // Using standard Hedera env var names if available, or fallback
// Note: ThirdWeb uses 'THIRDWEB_PRIVATE_KEY' (EVM). Hedera SDK uses DER/ED25519 usually.
// If the user only provided EVM keys, we might need to derive or use the same key if it's ECDSA.
// Assuming HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are provided for HCS as per memory.

const HCS_TOPIC_ID = process.env.NEXT_PUBLIC_HCS_TOPIC_ID || "0.0.5369661"; // Fallback to a topic if not set, but better to enforce.

// We need a Hedera Client.
// If HEDERA_ACCOUNT_ID/KEY are not set, we can't write to HCS natively easily without a Mirror Node submit API (which is limited/not standard).
// However, the memory said "The project requires THIRDWEB_... and HEDERA_ACCOUNT_ID".
// It implies we should have Hedera creds.

function getHederaClient() {
    if (!OPERATOR_ID || !OPERATOR_KEY) {
        console.warn("⚠️ HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY not set. HCS Logging disabled.");
        return null;
    }
    const client = Client.forTestnet();
    client.setOperator(OPERATOR_ID, OPERATOR_KEY);
    return client;
}

export interface AgentLog {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    stage: 'Hunter' | 'Broker' | 'Surgeon' | 'Brain';
    action: string;
    details?: any;
}

export async function logToHCS(log: Omit<AgentLog, 'timestamp'>) {
    const client = getHederaClient();
    if (!client) return;

    const message: AgentLog = {
        timestamp: new Date().toISOString(),
        ...log
    };

    try {
        const transaction = new TopicMessageSubmitTransaction()
            .setTopicId(HCS_TOPIC_ID)
            .setMessage(JSON.stringify(message));

        await transaction.execute(client);
        // console.log(`📝 Logged to HCS Topic ${HCS_TOPIC_ID}: ${log.action}`);
    } catch (error) {
        console.error("❌ Failed to log to HCS:", error);
    }
}
