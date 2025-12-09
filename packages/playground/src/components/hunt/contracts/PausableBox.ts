
export const PausableBoxArtifact = {
  abi: [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const,
  bytecode: "0x6080604052348015600f57600080fd5b5033600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101d8806100606000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80633f4ba83a146100515780635c975abb1461005b5780638456cb59146100795780638da5cb5b14610083575b600080fd5b6100596100a1565b005b6100636100bd565b604051610070919061012b565b60405180910390f35b6100816100ce565b005b61008b6100ea565b6040516100989190610187565b60405180910390f35b60008060006101000a81548160ff021916908315150217905550565b60008054906101000a900460ff1681565b60016000806101000a81548160ff021916908315150217905550565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008115159050919050565b61012581610110565b82525050565b6000602082019050610140600083018461011c565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061017182610146565b9050919050565b61018181610166565b82525050565b600060208201905061019c6000830184610178565b9291505056fea264697066735822122053f66ce24421bd305f08f923355623bac910d7a599efdcbb18313e10e53ed38964736f6c634300081f0033"
} as const;
