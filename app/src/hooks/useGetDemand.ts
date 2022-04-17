import { useContractCall, useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import MarketplaceABI from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import smartContractAddress from "../config/contracts.config.json";
import { Marketplace, MarketplaceInterface } from "../typechain/Marketplace";
import { ContractReturnTypeObject } from "../typeUtil";

const IMarketplace = new ethers.utils.Interface(
  MarketplaceABI.abi,
) as MarketplaceInterface;

export function useGetDemand(
  address?: string | null,
): ContractReturnTypeObject<Marketplace, "demands"> {
  const { account } = useEthers();

  const result =
    useContractCall({
      abi: IMarketplace,
      address: smartContractAddress.marketplaceAddress,
      method: IMarketplace.functions["demands(address)"].name,
      args: [address ?? account],
    }) ?? {};
  return result as ContractReturnTypeObject<Marketplace, "demands">;
}
