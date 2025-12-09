
export const VulnerableBoxArtifact = {
  abi: [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "implementation",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
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
] as const,
  bytecode: "0x6080604052348015600f57600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610275806100606000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80633659cfe6146100515780633ccfd60b1461006d5780635c60da1b146100775780638da5cb5b14610095575b600080fd5b61006b600480360381019061006691906101e8565b6100b3565b005b610075610139565b005b61007f61013b565b60405161008c9190610224565b60405180910390f35b61009d61015f565b6040516100aa9190610224565b60405180910390f35b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a250565b565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101b58261018a565b9050919050565b6101c5816101aa565b81146101d057600080fd5b50565b6000813590506101e2816101bc565b92915050565b6000602082840312156101fe576101fd610185565b5b600061020c848285016101d3565b91505092915050565b61021e816101aa565b82525050565b60006020820190506102396000830184610215565b9291505056fea26469706673582212200d6c9b6d8668f688bd385b47a66fa90e36b3db5ce974d5ac22d3a5b6b714007064736f6c634300081f0033"
} as const;
