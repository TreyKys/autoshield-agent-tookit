import {
    Client,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    TopicId
} from "@hashgraph/sdk";

// Constants
const OPERATOR_ID = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || "0.0.4578964"; // Default or Env
const OPERATOR_KEY = process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY || ""; // Must be provided in env for real write
// Note: For a frontend-only demo without backend signing, we might need the User to sign.
// However, the prompt implies "Agent" logging.
// If we are strictly client-side, we can use the connected Thirdweb wallet if we can bridge it to HCS.
// But @hashgraph/sdk requires a Private Key to sign transactions if we use 'Client.forTestnet()'.
// Since this is a "Playground" and the user mentioned "Agent", we will assume the environment has keys OR
// we will simulate the logging if keys are missing to prevent crashes.

export class HCSLogger {
    private client: Client | null = null;
    private topicId: string | null = null;

    constructor() {
        try {
             // Attempt to initialize client from env
            if (OPERATOR_ID && OPERATOR_KEY) {
                this.client = Client.forTestnet();
                this.client.setOperator(OPERATOR_ID, OPERATOR_KEY);
            }
        } catch (e) {
            console.warn("HCSLogger: Failed to initialize Hedera Client", e);
        }
    }

    async createTopic(): Promise<string | null> {
        if (!this.client) return null;
        try {
            const tx = new TopicCreateTransaction();
            const response = await tx.execute(this.client);
            const receipt = await response.getReceipt(this.client);
            this.topicId = receipt.topicId?.toString() || null;
            console.log("HCSLogger: Created Topic", this.topicId);
            return this.topicId;
        } catch (e) {
            console.error("HCSLogger: Failed to create topic", e);
            return null;
        }
    }

    async log(message: string, topicId?: string): Promise<boolean> {
        const targetTopic = topicId || this.topicId;
        if (!this.client || !targetTopic) {
            console.log("[HCS Log (Mock)]:", message);
            return false;
        }

        try {
            const tx = new TopicMessageSubmitTransaction()
                .setTopicId(targetTopic)
                .setMessage(message);

            await tx.execute(this.client);
            console.log(`[HCS Log (${targetTopic})]:`, message);
            return true;
        } catch (e) {
            console.error("HCSLogger: Failed to submit message", e);
            return false;
        }
    }
}

export const hcsLogger = new HCSLogger();
