import * as fs from "fs";
import * as path from "path";

function exportAbi() {
  const artifactPath = path.join(__dirname, "../artifacts/contracts/BountyBoard.sol/BountyBoard.json");
  if (!fs.existsSync(artifactPath)) {
    console.error("Artifact not found. Please run 'npm run compile' first.");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const frontendDir = path.join(__dirname, "../../frontend/lib/contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  // Write ABI JSON
  fs.writeFileSync(
    path.join(frontendDir, "BountyBoard.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  // Write TypeScript contract configuration
  const tsContent = `// Automatically exported from backend compilation
// Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local to override
export const BOUNTY_BOARD_DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export const BOUNTY_BOARD_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || BOUNTY_BOARD_DEFAULT_ADDRESS) as \`0x\${string}\`;

export const BOUNTY_BOARD_ABI = ${JSON.stringify(artifact.abi, null, 2)} as const;
`;

  fs.writeFileSync(path.join(frontendDir, "bountyBoard.ts"), tsContent);
  console.log("Successfully exported ABI and types to frontend/lib/contracts/bountyBoard.ts");
}

exportAbi();
