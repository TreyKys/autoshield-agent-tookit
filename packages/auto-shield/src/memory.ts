import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'knowledge_db.json');

export interface KnowledgeEntry {
  bugType: string;
  fixAction: string;
  successCount: number;
  timestamp: string;
}

export function learnFromSuccess(bugType: string, fixAction: string): void {
  let db: KnowledgeEntry[] = [];

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(fileContent);
    } catch (e) {
      console.error('Error reading knowledge DB:', e);
      // Reset DB if corrupted
      db = [];
    }
  }

  const existingEntryIndex = db.findIndex(
    (entry) => entry.bugType === bugType && entry.fixAction === fixAction
  );

  if (existingEntryIndex >= 0) {
    db[existingEntryIndex].successCount += 1;
    db[existingEntryIndex].timestamp = new Date().toISOString();
  } else {
    db.push({
      bugType,
      fixAction,
      successCount: 1,
      timestamp: new Date().toISOString(),
    });
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log('🧠 Learning DB Updated: Success recorded for', bugType);
}

export function getKnowledge(): KnowledgeEntry[] {
  if (fs.existsSync(DB_PATH)) {
    try {
      const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(fileContent);
    } catch (e) {
      return [];
    }
  }
  return [];
}
