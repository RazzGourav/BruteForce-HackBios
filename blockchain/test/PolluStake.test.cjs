const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Pollu-Stake Core Loop", function () {
  let ecoStake, cleanupDAO, greenCredit;
  let admin, factory, communityMember;
  let deployer; // This will be the admin

  // --- Deploy all contracts before each test ---
  beforeEach(async function () {
    [deployer, factory, communityMember] = await ethers.getSigners();
    admin = deployer; // The deployer is the admin

    // 1. Deploy GreenCredit (GRC)
    const GreenCredit = await ethers.getContractFactory("GreenCredit");
    greenCredit = await GreenCredit.deploy(admin.address);
    await greenCredit.waitForDeployment();

    // 2. Deploy CleanupDAO
    const CleanupDAO = await ethers.getContractFactory("CleanupDAO");
    cleanupDAO = await CleanupDAO.deploy(greenCredit.target);
    await cleanupDAO.waitForDeployment();

    // 3. Deploy EcoStake
    const EcoStake = await ethers.getContractFactory("EcoStake");
    ecoStake = await EcoStake.deploy(cleanupDAO.target);
    await ecoStake.waitForDeployment();

    // 4. *** CRITICAL STEP ***
    // Transfer ownership of the GRC token to the DAO contract
    await greenCredit.connect(admin).transferOwnership(cleanupDAO.target);
  });

  it("Should execute the full stake -> slash -> reward loop", async function () {
    const stakeAmount = ethers.parseEther("10"); // 10 ETH
    const slashAmount = ethers.parseEther("1"); // 1 ETH
    const rewardAmount = ethers.parseUnits("1000", 18); // 1000 GRC

    // --- 1. Factory Stakes ---
    await expect(
      ecoStake.connect(factory).registerAndStake("BHILAI-001", {
        value: stakeAmount,
      })
    )
      .to.emit(ecoStake, "Staked")
      .withArgs(factory.address, "BHILAI-001", stakeAmount);

    expect(await ecoStake.factoryStakes(factory.address)).to.equal(stakeAmount);

    // --- 2. Admin Slashes ---
    await expect(ecoStake.connect(admin).slash(factory.address, slashAmount))
      .to.emit(ecoStake, "Slashed")
      .withArgs(factory.address, slashAmount, stakeAmount - slashAmount);

    // Check balances
    expect(await ecoStake.factoryStakes(factory.address)).to.equal(
      stakeAmount - slashAmount // Factory stake is now 9 ETH
    );
    expect(await cleanupDAO.getBalance()).to.equal(slashAmount); // DAO balance is now 1 ETH

    // --- 3. Admin Rewards Community ---
    await expect(
      cleanupDAO
        .connect(admin)
        .rewardCommunity(communityMember.address, rewardAmount)
    )
      .to.emit(cleanupDAO, "CreditsMinted")
      .withArgs(communityMember.address, rewardAmount);

    // Check GRC token balance
    expect(await greenCredit.balanceOf(communityMember.address)).to.equal(
      rewardAmount
    );
  });
});
