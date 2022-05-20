import { useCallback } from "react";
import { useIamContext } from "../context";
import { Asset } from "../models";
import { useAsync } from "./useAsync";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @returns aggregated readings logs
 */
export function useGetAssets(assetDIDs?: string[]) {
  const { state } = useIamContext();
  const query = useCallback(
    async (assetDIDs?: string[]) => {
      if (!state) return [];
      return await Asset.get({ assetDIDs, start: "-1y" });
    },
    [state],
  );
  return useAsync(query, true, assetDIDs);
}
