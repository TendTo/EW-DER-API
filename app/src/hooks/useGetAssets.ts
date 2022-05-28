import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useIamContext } from "../context";
import { Asset } from "../models";
import { useAsync } from "./useAsync";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @returns aggregated readings logs
 */
export function useGetAssets() {
  const { state } = useIamContext();
  const query = useCallback(async () => {
    if (!state) return [];
    return await Asset.getByIAM(state.cacheClient, state.iamConnection.signerService.did);
  }, [state]);
  const res = useAsync(query, true, undefined);
  useEffect(() => {
    if (res.error) {
      toast.error(res.error);
    }
  }, [res.error]);
  return res;
}
