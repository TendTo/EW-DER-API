import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { Asset } from "../models/asset";
import { useAsync } from "./useAsync";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @param rootHash root hash of the aggregated readings log on the blockchain.
 * If not provided, the latest log will be fetched.
 * @returns aggregated readings logs
 */
export function useGetAssets() {
  const { library } = useEthers();
  const query = useCallback(
    async (owners: string[]) => {
      if (!library) return [];
      return await Asset.getByOwner(owners, library);
    },
    [library],
  );
  return useAsync(query);
}
