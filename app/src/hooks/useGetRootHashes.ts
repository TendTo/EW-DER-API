import { useCallback } from "react";
import { RootHash } from "../models";
import { useAsync } from "./useAsync";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @returns aggregated readings logs
 */
export function useGetRootHashes(assetDIDs?: string[]) {
  const query = useCallback(async (assetDIDs?: string[]) => {
    if (!assetDIDs) return [];
    const res = await RootHash.get({
      assetDIDs,
      start: "-1y",
      stop: "now()",
    });
    return res;
  }, []);
  return useAsync(query, true, assetDIDs);
}
