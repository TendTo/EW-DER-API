import { Chain, Config } from "@usedapp/core";

const voltaExplorerUrl = "https://volta-explorer.energyweb.org/";

export const Volta: Chain = {
  chainId: 73799,
  chainName: "volta",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: "0xEe2ADcB5BEAa7E08AF1F1a4Ee0EFfE0DfDDEdD27",
  getExplorerAddressLink(address: string) {
    return `${voltaExplorerUrl}/address/${address}`;
  },
  getExplorerTransactionLink(transactionHash: string) {
    return `${voltaExplorerUrl}/tx/${transactionHash}`;
  },
};

export const ganache: Chain = {
  isLocalChain: false,
  isTestChain: true,
  chainId: 5777,
  chainName: "ganache",
  multicallAddress: "0xaB7E524B88B66759990Ec8AFb8Af131218be7788",
  getExplorerAddressLink: (address: string) =>
    `${voltaExplorerUrl}/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `${voltaExplorerUrl}/tx/${transactionHash}`,
};

const config: Config = {
  networks: [Volta],
};

export default config;
