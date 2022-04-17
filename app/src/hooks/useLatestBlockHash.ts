import { MultiCall, useContractCall } from "@usedapp/core";
import { ethers } from "ethers";
import { Volta } from "../config/useDAppconfig";

const multicallInterface = new ethers.utils.Interface(MultiCall.abi);

export function useLatestBlockHash() {
  const [hash]: string[] =
    useContractCall({
      abi: multicallInterface,
      address: Volta.multicallAddress,
      method: "getLastBlockHash",
      args: [],
    }) ?? [];
  return hash;
}
