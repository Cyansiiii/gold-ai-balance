const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy Mocks if on Testnet (Optional, if QIE Router doesn't exist yet)
  // For this guide, we assume you have addresses. 
  // REPLACE these with real Testnet addresses from QIE Docs
  const QIE_TOKEN = "0x..."; 
  const STABLE_TOKEN = "0x..."; 
  const ARM_TOKEN = "0x..."; // Your token from Phase 1
  const QIE_ORACLE = "0x..."; // Native Oracle Address
  const QIEDEX_ROUTER = "0x..."; 
  const AI_AGENT_WALLET = "0x..."; // Your Python script's wallet address

  const Vault = await hre.ethers.getContractFactory("AurumVault");
  const vault = await Vault.deploy(
    QIE_TOKEN, STABLE_TOKEN, ARM_TOKEN, QIE_ORACLE, QIEDEX_ROUTER, AI_AGENT_WALLET
  );

  await vault.waitForDeployment();

  console.log("AurumVault deployed to:", vault.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
