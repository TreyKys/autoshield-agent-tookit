import { NextRequest, NextResponse } from 'next/server';
import { getAgentClient, getAgentAccount, HEDERA_TESTNET } from '@/lib/agent/agent-wallet';
import { logToHCS } from '@/lib/agent/hcs-logger';
import { deployContract } from "thirdweb/deploys";
import { getContract, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { SafeBoxArtifact } from '@/components/hunt/contracts/SafeBox';
import { VulnerableBoxArtifact } from '@/components/hunt/contracts/VulnerableBox';
import { PausableBoxArtifact } from '@/components/hunt/contracts/PausableBox';

export const maxDuration = 300; // Allow 5 minutes for batch operations

// Cache the deployed SafeBox implementation address per session/runtime
let cachedSafeImplementation: string | null = null;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { targets, paymentTxId } = body as { targets: any[], paymentTxId: string };

        if (!targets || !Array.isArray(targets) || targets.length === 0) {
            return NextResponse.json({ error: "No targets provided" }, { status: 400 });
        }

        console.log(`[Agent] Received batch fix request for ${targets.length} targets. Payment: ${paymentTxId}`);
        await logToHCS({
            level: 'info',
            stage: 'Surgeon',
            action: 'BATCH_INITIATED',
            details: { count: targets.length, paymentTxId }
        });

        // Initialize Agent
        const client = getAgentClient();
        const account = getAgentAccount();

        const results = [];

        // 1. Ensure Safe Implementation is deployed (once)
        let safeImpl = cachedSafeImplementation;
        if (!safeImpl) {
            console.log(`[Agent] Deploying SafeBox implementation...`);
            await logToHCS({ level: 'info', stage: 'Surgeon', action: 'DEPLOY_SAFE_IMPL_START' });

            try {
                safeImpl = await deployContract({
                    client,
                    chain: HEDERA_TESTNET,
                    account,
                    bytecode: SafeBoxArtifact.bytecode as `0x${string}`,
                    abi: SafeBoxArtifact.abi,
                });
                cachedSafeImplementation = safeImpl;
                console.log(`[Agent] SafeBox deployed at: ${safeImpl}`);
                await logToHCS({ level: 'success', stage: 'Surgeon', action: 'DEPLOY_SAFE_IMPL_SUCCESS', details: { address: safeImpl } });
            } catch (deployError: any) {
                console.error("Failed to deploy SafeBox:", deployError);
                await logToHCS({ level: 'error', stage: 'Surgeon', action: 'DEPLOY_SAFE_IMPL_FAILED', details: { error: deployError.message } });
                return NextResponse.json({ error: "Failed to deploy cure implementation" }, { status: 500 });
            }
        }

        // 2. Iterate and Fix
        for (const target of targets) {
            const { address, action, name } = target;

            console.log(`[Agent] Processing ${name} (${address}) - Action: ${action}`);

            try {
                if (action === 'upgrade') {
                    const targetContract = getContract({
                        client,
                        chain: HEDERA_TESTNET,
                        address: address,
                        abi: VulnerableBoxArtifact.abi
                    });

                    const tx = prepareContractCall({
                        contract: targetContract,
                        method: "upgradeTo",
                        params: [safeImpl]
                    });

                    const submittedTx = await sendTransaction({ transaction: tx, account });

                    results.push({
                        address,
                        status: 'success',
                        action: 'upgrade',
                        txHash: submittedTx.transactionHash
                    });

                    await logToHCS({
                        level: 'success',
                        stage: 'Surgeon',
                        action: 'TARGET_UPGRADED',
                        details: { target: address, txHash: submittedTx.transactionHash }
                    });

                } else if (action === 'pause') {
                    const targetContract = getContract({
                        client,
                        chain: HEDERA_TESTNET,
                        address: address,
                        abi: PausableBoxArtifact.abi
                    });

                    const tx = prepareContractCall({
                        contract: targetContract,
                        method: "pause",
                        params: []
                    });

                    const submittedTx = await sendTransaction({ transaction: tx, account });

                    results.push({
                        address,
                        status: 'success',
                        action: 'pause',
                        txHash: submittedTx.transactionHash
                    });

                    await logToHCS({
                        level: 'success',
                        stage: 'Surgeon',
                        action: 'TARGET_PAUSED',
                        details: { target: address, txHash: submittedTx.transactionHash }
                    });
                }
            } catch (err: any) {
                console.error(`[Agent] Failed to fix ${address}:`, err);
                results.push({
                    address,
                    status: 'failed',
                    error: err.message
                });
                await logToHCS({
                    level: 'error',
                    stage: 'Surgeon',
                    action: 'FIX_FAILED',
                    details: { target: address, error: err.message }
                });
            }
        }

        await logToHCS({ level: 'success', stage: 'Brain', action: 'BATCH_COMPLETE', details: { successCount: results.filter(r => r.status === 'success').length } });

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        console.error("[Agent] Internal Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
