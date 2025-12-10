import { z } from 'zod';

export const scanNetworkSchema = z.object({});

export async function scanNetwork(args: z.infer<typeof scanNetworkSchema>) {
  console.log("🕵️  Act 1: The Hunter is scanning the network...");

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 800));

  // Read from the shared targets.json if available
  try {
    const fs = await import('fs');
    const path = await import('path');

    // Check both potential locations (if running from dist or src)
    const possiblePaths = [
      path.resolve(__dirname, '../data/targets.json'),
      path.resolve(process.cwd(), 'src/data/targets.json'),
      path.resolve(process.cwd(), 'packages/nullshot-agent/src/data/targets.json')
    ];

    let targetsData = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        console.log(`Loading targets from ${p}`);
        targetsData = JSON.parse(fs.readFileSync(p, 'utf-8'));
        break;
      }
    }

    if (targetsData && targetsData.contracts) {
      console.log(`🕵️  Hunter found ${targetsData.contracts.length} targets on-chain.`);

      const mappedTargets = targetsData.contracts.map((c: any, index: number) => ({
        id: c.contractId || `target-${index}`,
        address: c.address,
        bugType: c.vulnerability || "UNKNOWN",
        name: c.name,
        confidence: "High",
        details: `Detected ${c.vulnerability} in ${c.name} (File: ${c.filename})`
      }));

      return {
        status: "VULNERABLE",
        targets: mappedTargets
      };
    }
  } catch (e) {
    console.warn("Failed to read targets.json, falling back to simulation.", e);
  }

  // Fallback Simulation if file missing
  const mockCode = `
    function withdraw() public {
      (bool success, ) = msg.sender.call{value: address(this).balance}("");
      require(success);
      balances[msg.sender] = 0;
    }
  `;

  const reentrancyPattern = /\.call\{value:/;

  if (reentrancyPattern.test(mockCode) || mockCode.includes("call.value")) {
    console.log("🕵️  Hunter found a potential vulnerability!");
    return {
      status: "VULNERABLE",
      targets: [
        {
          id: "target-1",
          address: "0.0.123456", // Mock Hedera address
          bugType: "REENTRANCY",
          confidence: "High",
          details: "Detected unsafe external call with value transfer."
        }
      ]
    };
  }

  return {
    status: "SECURE",
    targets: []
  };
}
