import { useCallback } from "react";
import { RootHash } from "../models";
import { useAsync } from "./useAsync";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @returns aggregated readings logs
 */
export function useGetRootHashes(assetDIDs?: string[]) {
  const query = useCallback(async (assetDIDs?: string[]) => {
    return await RootHash.get({ assetDIDs, start: "-1y" });
  }, []);
  return useAsync(query, true, assetDIDs);
}
