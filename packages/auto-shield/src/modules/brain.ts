// Act 4: The Brain (Memory) 🧠
import fs from "fs/promises";
import path from "path";

export interface MemoryEntry {
  bugType: string;
  action: string;
  timestamp: string;
  hederaContractId: string;
  transactionHash: string;
}

export class Brain {
  static async remember(entry: MemoryEntry): Promise<void> {
    console.log("\n🧠 Act 4: The Brain is committing to memory...");

    const dbPath = path.resolve(process.cwd(), "knowledge_db.json");
    let db: MemoryEntry[] = [];

    try {
      const data = await fs.readFile(dbPath, "utf-8");
      db = JSON.parse(data);
    } catch (error) {
      // File likely doesn't exist, start fresh
      db = [];
    }

    db.push(entry);

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    console.log("🧠 Memory updated in knowledge_db.json");
  }
}
