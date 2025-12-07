
// Bytecode for a simple SafeBox (logic only) compiled with EVM 'paris' (no PUSH0)
// Source:
// contract SafeBox {
//     address public implementation;
//     function withdraw() external {}
// }
const SAFE_BYTECODE = "0x6080604052348015600f57600080fd5b5060ae8061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80633ccfd60b1460375780635c60da1b14603f575b600080fd5b603d6047565b005b60456049565b60405160529190606e565b60405180910390f35b565b60005481565b6000819050919050565b6068816057565b82525050565b6000602082019050608160008301846061565b9291505056fea26469706673582212204c27807913337770977e23583214736f6c63430008130033";

export const SafeBoxArtifact = {
  abi: [
    {
      "inputs": [],
      "name": "implementation",
      "outputs": [{"internalType": "address","name": "","type": "address"}],
      "stateMutability": "view",
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
  bytecode: SAFE_BYTECODE
} as const;
