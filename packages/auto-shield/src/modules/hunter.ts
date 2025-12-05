// Act 1: The Hunter (Diagnosis) 🕵️

export interface DiagnosisResult {
  bugType: string;
  confidence: string;
  details: string;
}

export class Hunter {
  static async diagnose(code: string): Promise<DiagnosisResult> {
    console.log("\n🕵️  Act 1: The Hunter is scanning the contract...");

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simple regex for "call.value" pattern which is often a sign of reentrancy if not guarded
    const reentrancyPattern = /\.call\{value:/;

    if (reentrancyPattern.test(code) || code.includes("call.value")) {
      console.log("🕵️  Hunter found a potential vulnerability!");
      return {
        bugType: "REENTRANCY",
        confidence: "High",
        details: "Detected unsafe external call with value transfer."
      };
    }

    return {
      bugType: "NONE",
      confidence: "High",
      details: "No obvious vulnerabilities found."
    };
  }
}
