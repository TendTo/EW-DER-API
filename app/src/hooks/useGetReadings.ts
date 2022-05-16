import { useCallback } from "react";
import { Reading, ReadingsDTOOptions } from "../models";
import { useAsync } from "./useAsync";

type UseGetReadingsArgs = ReadingsDTOOptions & {
  assetDID?: string[];
  rootHash?: string[];
};

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @returns aggregated readings logs
 */
export function useGetReadings() {
  const getReadings = useCallback(
    async ({ assetDID, rootHash, ...options }: UseGetReadingsArgs) => {
      if (assetDID) return Reading.getManyByAssetDID(assetDID, options);
      if (rootHash) return Reading.getManyByRootHash(rootHash, options);
      return [[]];
    },
    [],
  );
  return useAsync(getReadings);
}
