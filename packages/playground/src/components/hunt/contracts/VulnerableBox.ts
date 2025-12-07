
// Bytecode for VulnerableBox (Mock Proxy) compiled with EVM 'paris' (no PUSH0)
// Source:
// contract VulnerableBox {
//     address public implementation;
//     function upgradeTo(address newImpl) external { implementation = newImpl; }
//     function withdraw() external {}
// }
const VULN_BYTECODE = "0x6080604052348015600f57600080fd5b5060d28061001e6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80633659cfe61460415780633ccfd60b14605f5780635c60da1b146067575b600080fd5b605d60048036036020811015605757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16905050506087565b005b6065608b565b005b606d608d565b604051607a91906096565b60405180910390f35b806000908051906020019061021792919061021e565b5050565b565b60005481565b6000819050919050565b609081607f565b82525050565b600060208201905060a960008301846089565b9291505056fea26469706673582212204c27807913337770977e23583214736f6c63430008130033";

export const VulnerableBoxArtifact = {
  abi: [
    {
      "inputs": [],
      "name": "implementation",
      "outputs": [{"internalType": "address","name": "","type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address","name": "newImplementation","type": "address"}],
      "name": "upgradeTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  bytecode: VULN_BYTECODE
} as const;
