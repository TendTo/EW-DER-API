import { useCallback } from "react";
import { useIamContext } from "../context";
import { Asset } from "../models";
import { useAsync } from "./useAsync";
import { useLogin } from "./useLogin";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @returns aggregated readings logs
 */
export function useGetAssets() {
  const { state } = useIamContext();
  const { isAggregator } = useLogin();

  const query = useCallback(async () => {
    if (!state) return [];
    return isAggregator
      ? Asset.getAll({ start: "-1y", stop: "now()" })
      : Asset.getByIAM(state.cacheClient, state.iamConnection.signerService.did);
  }, [state, isAggregator]);

  return useAsync(query, true, undefined);
}
