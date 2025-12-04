import { Hunter } from "./modules/hunter.js";
import { Broker } from "./modules/broker.js";
import { Surgeon } from "./modules/surgeon.js";
import { Brain } from "./modules/brain.js";
import { CURES } from "./library/cures.js";
import { VulnerableBoxArtifact } from "./contracts/VulnerableBox.js";

async function main() {
  console.log("🚀 Starting Auto-Shield Agent on Hedera Testnet...");

  try {
    // Act 3 (Part 1): Initialize Surgeon early to deploy target
    const surgeon = new Surgeon();

    // Act 0: The Setup - Deploy a target to hunt
    const targetAddress = await surgeon.deployTarget();

    // Mock getting code from the chain (we know what it is)
    // In a real scenario: const code = await getSourceCode(targetAddress);
    const mockSourceCode = `
      function withdraw() public {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success);
        balances[msg.sender] = 0;
      }
    `;

    // Act 1: The Hunter
    const diagnosis = await Hunter.diagnose(mockSourceCode);

    if (diagnosis.bugType === "NONE") {
      console.log("No bugs found. Exiting.");
      return;
    }

    // Act 2: The Broker
    const negotiation = await Broker.negotiate("0.0.6928410");

    if (negotiation.status === "APPROVED") {
      // Act 3: The Surgeon
      // Select cure
      const cure = CURES[diagnosis.bugType as keyof typeof CURES];
      if (!cure) {
        console.error("No cure found for this bug!");
        return;
      }

      const txHash = await surgeon.performSurgery(targetAddress, cure.code);

      // Act 4: The Brain
      await Brain.remember({
        bugType: diagnosis.bugType,
        action: "PATCHED",
        timestamp: new Date().toISOString(),
        hederaContractId: targetAddress, // Store address as ID
        transactionHash: txHash
      });
    }

    console.log("\n✅ Mission Complete. Agent entering sleep mode.");

  } catch (error) {
    console.error("\n❌ Mission Failed:", error);
    process.exit(1);
  }
}

main();
