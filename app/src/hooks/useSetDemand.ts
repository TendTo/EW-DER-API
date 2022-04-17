import { TransactionStatus, useContractFunction } from "@usedapp/core";
import { Contract, ethers } from "ethers";
import MarketplaceABI from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import smartContractAddress from "../config/contracts.config.json";
import { useContractCallToast } from "./useContractCallToast";

const IMarketplace = new ethers.utils.Interface(MarketplaceABI.abi);
const marketplace = new Contract(smartContractAddress.marketplaceAddress, IMarketplace);

export function useSetDemand(): {
  send: (volume: number, price: number) => Promise<void>;
  state: TransactionStatus;
  events: ethers.utils.LogDescription[] | undefined;
  resetState: () => void;
} {
  const res = useContractFunction(marketplace, "createDemand");
  const { state, resetState } = res;
  useContractCallToast(state, resetState);
  return res;
}
