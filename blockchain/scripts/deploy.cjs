const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // --- 1. Deploy GreenCredit (GRC) ---
  const greenCreditFactory = await ethers.getContractFactory("GreenCredit");
  const greenCredit = await greenCreditFactory.deploy(deployer.address);
  await greenCredit.waitForDeployment();
  console.log(`✅ GreenCredit (GRC) token deployed to: ${greenCredit.target}`);

  // --- 2. Deploy CleanupDAO ---
  const cleanupDAOFactory = await ethers.getContractFactory("CleanupDAO");
  const cleanupDAO = await cleanupDAOFactory.deploy(greenCredit.target);
  await cleanupDAO.waitForDeployment();
  console.log(`✅ CleanupDAO deployed to: ${cleanupDAO.target}`);

  // --- 3. Deploy EcoStake ---
  const ecoStakeFactory = await ethers.getContractFactory("EcoStake");
  const ecoStake = await ecoStakeFactory.deploy(cleanupDAO.target);
  await ecoStake.waitForDeployment();
  console.log(`✅ EcoStake deployed to: ${ecoStake.target}`);

  // --- 4. Transfer GRC Ownership to the DAO ---
  console.log("Transferring ownership of GreenCredit to CleanupDAO...");
  const tx = await greenCredit.transferOwnership(cleanupDAO.target);
  await tx.wait();
  console.log("✅ Ownership transferred successfully.");

  console.log("\n--- Deployment Complete ---");
  console.log(`export const GREENCREDIT_CONTRACT_ADDRESS = "${greenCredit.target}";`);
  console.log(`export const CLEANUPDAO_CONTRACT_ADDRESS = "${cleanupDAO.target}";`);
  console.log(`export const ECOSTAKE_CONTRACT_ADDRESS = "${ecoStake.target}";`);
  console.log("\nCopy these addresses into your frontend's 'constants.js' file.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
