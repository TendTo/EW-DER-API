import { useCallback } from "react";
import { AggregatedReadingsDTOOptions, Reading, ReadingsDTOOptions } from "../models";
import { useAsync } from "./useAsync";

type UseGetReadingsArgs = (ReadingsDTOOptions | AggregatedReadingsDTOOptions) & {
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
      if ("difference" in options) {
        if (assetDID && assetDID.length > 0)
          return [await Reading.getManyAggregatedReadingsByAssetDID(assetDID, options)];
        if (rootHash && rootHash.length > 0)
          return [await Reading.getManyAggregatedReadingsByRootHash(rootHash, options)];
        return [[]];
      }
      if (assetDID && assetDID.length > 0)
        return Reading.getManyByAssetDID(assetDID, options);
      if (rootHash && rootHash.length > 0)
        return Reading.getManyByRootHash(rootHash, options);
      return [[]];
    },
    [],
  );
  return useAsync(getReadings);
}
