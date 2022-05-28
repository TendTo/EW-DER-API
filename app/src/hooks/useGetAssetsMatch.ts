import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useIamContext } from "../context";
import { Asset, AssetMatchQueryOptions } from "../models";
import { useAsync } from "./useAsync";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @returns aggregated readings logs
 */
export function useGetAssetsMatch() {
  const { state } = useIamContext();
  const query = useCallback(
    async (options: AssetMatchQueryOptions) => {
      if (!state) return [[], []] as [Asset[], Asset[]];
      return await Asset.getMatches(options);
    },
    [state],
  );
  const res = useAsync(query);
  useEffect(() => {
    if (res.error) {
      toast.error(res.error);
    }
  }, [res.error]);
  return res;
}
