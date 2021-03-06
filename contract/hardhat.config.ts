import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import "hardhat-gas-reporter";
import { HardhatUserConfig, task } from "hardhat/config";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ganache: {
      chainId: 1337,
      url: "http://192.168.1.29:8545",
      accounts: process.env.SK !== undefined ? [process.env.SK] : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: process.env.SK !== undefined ? [process.env.SK] : [],
    },
    volta: {
      chainId: 73799,
      url: process.env.VOLTA_URL || "https://volta-rpc.energyweb.org/",
      accounts: process.env.SK !== undefined ? [process.env.SK] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "./typechain",
  },
};

export default config;
