import solc from "solc";
import fs from "fs";
import path from "path";

const sourcePath = path.resolve("src/contracts/VulnerableBox.sol");
const sourceContent = fs.readFileSync(sourcePath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "VulnerableBox.sol": {
      content: sourceContent,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
  if (output.errors.some((err) => err.severity === "error")) {
    process.exit(1);
  }
}

const contract = output.contracts["VulnerableBox.sol"]["VulnerableBox"];
const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

const fileContent = `
export const VulnerableBoxArtifact = {
  abi: ${JSON.stringify(abi, null, 2)} as const,
  bytecode: "0x${bytecode}"
};
`;

const safeFileContent = `
export const SafeBoxArtifact = {
  abi: ${JSON.stringify(abi, null, 2)} as const,
  bytecode: "0x${bytecode}"
};
`;

fs.writeFileSync("src/contracts/VulnerableBox.ts", fileContent);
fs.writeFileSync("src/contracts/SafeBox.ts", safeFileContent);

console.log("Artifacts compiled and updated successfully.");
