// Bytecode Scanner Utility

// Signatures for detection
// We use a simplified signature detection for the demo.
// Ideally, this would use a robust database or static analysis tool.

// The VulnerableBox bytecode (from artifact) ends with metadata, but we can check for specific operational sequences.
// Or we can just check if it matches the known VulnerableBox bytecode exactly (minus metadata).

// The VulnerableBox bytecode (from artifact)
// We'll export the scanner class.

export interface ScanResult {
    isVulnerable: boolean;
    vulnerabilityType?: string;
    action?: 'upgrade' | 'pause';
    confidence: number; // 0-1
}

export class BytecodeScanner {

    static scan(bytecode: string): ScanResult {
        // Remove 0x prefix
        const code = bytecode.replace(/^0x/, '');

        // 1. Check for Empty Bytecode
        if (!code || code === '0x') {
            return { isVulnerable: false, confidence: 0 };
        }

        // 2. Check for VulnerableBox Signature (Upgrade)
        // This is the bytecode snippet for the VulnerableBox as defined in artifacts.
        const vulnerableBoxSnippet = "6080604052348015600e575f5ffd5b503360015f610100";

        if (code.includes(vulnerableBoxSnippet)) {
             // Further check: does it have the upgradeTo selector?
             // upgradeTo(address) -> 0x3659cfe6
             if (code.includes("3659cfe6")) {
                 return {
                     isVulnerable: true,
                     vulnerabilityType: "Unprotected Upgrade Logic (Demo)",
                     action: 'upgrade',
                     confidence: 0.95
                 };
             }
        }

        // 3. Check for PausableBox Signature (Pause)
        // PausableBox usually has 'pause()' -> 0x8456cb59
        // And maybe 'Pausable' logic.
        // Let's assume for the demo that if it looks like our PausableBox artifact, it's a target.
        // PausableBox artifact bytecode snippet (different from VulnerableBox?)
        // Actually, they might share the preamble.
        // Let's check for 'pause' selector: 0x8456cb59
        if (code.includes("8456cb59")) {
             return {
                 isVulnerable: true, // It's "vulnerable" in the sense that it needs Action
                 vulnerabilityType: "Emergency Pause Required (Demo)",
                 action: 'pause',
                 confidence: 0.90
             };
        }

        return { isVulnerable: false, confidence: 0 };
    }
}
