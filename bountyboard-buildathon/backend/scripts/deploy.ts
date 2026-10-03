import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting deployment of BountyBoard to network:", (await ethers.provider.getNetwork()).name);

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account found. Check your PRIVATE_KEY in .env");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "MON");

  const BountyBoard = await ethers.getContractFactory("BountyBoard");
  const bountyBoard = await BountyBoard.deploy();
  await bountyBoard.waitForDeployment();

  const contractAddress = await bountyBoard.getAddress();
  console.log("\n========================================================");
  console.log("🎉 BountyBoard successfully deployed!");
  console.log("Contract Address:", contractAddress);
  console.log("MonadScan Explorer URL: https://testnet.monadscan.com/address/" + contractAddress);
  console.log("========================================================\n");

  // Export ABI and address to frontend integration boundary
  const artifactPath = path.join(__dirname, "../artifacts/contracts/BountyBoard.sol/BountyBoard.json");
  if (fs.existsSync(artifactPath)) {
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
    const tsContent = `// Automatically exported from backend deployment
export const BOUNTY_BOARD_ADDRESS = "${contractAddress}" as const;
export const BOUNTY_BOARD_ABI = ${JSON.stringify(artifact.abi, null, 2)} as const;
`;
    fs.writeFileSync(path.join(frontendDir, "bountyBoard.ts"), tsContent);
    console.log("Exported ABI and contract configuration to frontend/lib/contracts/bountyBoard.ts");
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
