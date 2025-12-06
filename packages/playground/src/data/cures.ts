export const curesData = {
  "cures": {
    "Reentrancy": {
      "id": "cure-reentrancy",
      "name": "Reentrancy Guard Injection",
      "description": "Injects OpenZeppelin ReentrancyGuard and adds 'nonReentrant' modifier to vulnerable functions.",
      "risk": "Low",
      "complexity": "Low",
      "example_fix": "function withdraw() external nonReentrant { ... }"
    },
    "Integer Overflow": {
      "id": "cure-overflow",
      "name": "SafeMath / Solidity 0.8 Upgrade",
      "description": "Upgrades contract to Solidity 0.8.x which has built-in overflow protection.",
      "risk": "Medium",
      "complexity": "Medium",
      "example_fix": "pragma solidity ^0.8.0;"
    },
    "Access Control": {
      "id": "cure-access",
      "name": "Ownable Enforcement",
      "description": "Adds 'onlyOwner' modifier to critical administrative functions.",
      "risk": "High",
      "complexity": "Low",
      "example_fix": "function setFee() external onlyOwner { ... }"
    },
    "Unchecked Call": {
      "id": "cure-unchecked",
      "name": "Call Verification Pattern",
      "description": "Ensures low-level call return values are checked using require().",
      "risk": "High",
      "complexity": "Medium",
      "example_fix": "(bool success, ) = target.call(data); require(success, 'Call failed');"
    },
    "Private Data Exposure": {
      "id": "cure-privacy",
      "name": "State Variable Encryption",
      "description": "Private state variables are still visible on-chain. Moves sensitive data to off-chain storage or encrypts it.",
      "risk": "Medium",
      "complexity": "High",
      "example_fix": "// Sensitive data removed from public storage"
    }
  }
} as const;

export default curesData;
