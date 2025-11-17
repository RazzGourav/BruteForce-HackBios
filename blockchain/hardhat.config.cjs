require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // This line loads your .env file

const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.20" },
      { version: "0.8.19" }
    ]
  },
  networks: {
    hardhat: {
      // Default network, runs in-memory
    },
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};