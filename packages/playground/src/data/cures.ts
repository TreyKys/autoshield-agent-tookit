import { VulnerableBoxArtifact } from '../components/hunt/contracts/VulnerableBox';
import { SafeBoxArtifact } from '../components/hunt/contracts/SafeBox';
import { PausableBoxArtifact } from '../components/hunt/contracts/PausableBox';
import { BatchExecutorArtifact } from '../components/hunt/contracts/BatchExecutor';

export const curesData = {
  "cures": {
    "Reentrancy": {
      "id": "cure-reentrancy",
      "name": "Reentrancy Guard Injection",
      "description": "Injects OpenZeppelin ReentrancyGuard and adds 'nonReentrant' modifier to vulnerable functions.",
      "risk": "Low",
      "complexity": "Low",
      "example_fix": "function withdraw() external nonReentrant { ... }",
      "artifact": SafeBoxArtifact
    },
    "Integer Overflow": {
      "id": "cure-overflow",
      "name": "SafeMath / Solidity 0.8 Upgrade",
      "description": "Upgrades contract to Solidity 0.8.x which has built-in overflow protection.",
      "risk": "Medium",
      "complexity": "Medium",
      "example_fix": "pragma solidity ^0.8.0;",
      "artifact": SafeBoxArtifact
    },
    "Access Control": {
      "id": "cure-access",
      "name": "Ownable Enforcement",
      "description": "Adds 'onlyOwner' modifier to critical administrative functions.",
      "risk": "High",
      "complexity": "Low",
      "example_fix": "function setFee() external onlyOwner { ... }",
      "artifact": SafeBoxArtifact
    },
    "Unchecked Call": {
      "id": "cure-unchecked",
      "name": "Call Verification Pattern",
      "description": "Ensures low-level call return values are checked using require().",
      "risk": "High",
      "complexity": "Medium",
      "example_fix": "(bool success, ) = target.call(data); require(success, 'Call failed');",
      "artifact": SafeBoxArtifact
    },
    "Private Data Exposure": {
      "id": "cure-privacy",
      "name": "State Variable Encryption",
      "description": "Private state variables are still visible on-chain. Moves sensitive data to off-chain storage or encrypts it.",
      "risk": "Medium",
      "complexity": "High",
      "example_fix": "// Sensitive data removed from public storage",
      "artifact": SafeBoxArtifact
    },
    "Emergency Pause": {
        "id": "cure-pause",
        "name": "Emergency Pause",
        "description": "Halts all contract activity to prevent further exploitation.",
        "risk": "Low",
        "complexity": "Low",
        "example_fix": "function pause() external onlyOwner { _pause(); }",
        "artifact": PausableBoxArtifact
    }
  },
  "artifacts": {
      "VulnerableBox": VulnerableBoxArtifact,
      "SafeBox": SafeBoxArtifact,
      "PausableBox": PausableBoxArtifact,
      "BatchExecutor": BatchExecutorArtifact
  }
} as const;

export default curesData;
