export function scanCode(code: string): string | null {
  console.log('🕵️ Scanning contract code...');

  if (/call\.value/.test(code)) {
    console.log('🕵️ Bug Detected: REENTRANCY (pattern "call.value" found)');
    return 'REENTRANCY';
  }

  console.log('🕵️ No bugs detected.');
  return null;
}
