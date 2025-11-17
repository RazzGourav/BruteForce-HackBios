const { ethers } = require("hardhat");

async function main() {
  const ecoStakeAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // deployed EcoStake
  const cleanupDaoAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // deployed CleanupDAO

  const [admin, factory, other] = await ethers.getSigners();
  console.log("Admin:", admin.address);
  console.log("Factory:", factory.address);

  const ecoStake = await ethers.getContractAt("EcoStake", ecoStakeAddress);
  const cleanupDAO = await ethers.getContractAt("CleanupDAO", cleanupDaoAddress);

  // 1) Factory registers and stakes 1 ETH
  console.log("Registering and staking 1 ETH from factory...");
  const stakeTx = await ecoStake.connect(factory).registerAndStake("factory-001", { value: ethers.parseEther("1.0") });
  await stakeTx.wait();

  let staked = await ecoStake.factoryStakes(factory.address);
  console.log("Factory stake after staking:", ethers.formatEther(staked), "ETH");

  // 2) Admin slashes 0.5 ETH
  const slashAmount = ethers.parseEther("0.5");
  console.log("Admin slashing", ethers.formatEther(slashAmount), "ETH from factory...");
  const slashTx = await ecoStake.connect(admin).slash(factory.address, slashAmount);
  await slashTx.wait();

  staked = await ecoStake.factoryStakes(factory.address);
  console.log("Factory stake after slash:", ethers.formatEther(staked), "ETH");

  // 3) Check CleanupDAO balance (should have received the slashed funds)
  const daoBalance = await ethers.provider.getBalance(cleanupDaoAddress);
  console.log("CleanupDAO balance:", ethers.formatEther(daoBalance), "ETH");

  console.log("Slash test complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
