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
      if (assetDID) {
        if (assetDID.length > 1) return Reading.getManyByAssetDID(assetDID, options);
        else if (assetDID.length === 1)
          return [await Reading.getByAssetDID(assetDID[0], options)];
      }
      if (rootHash) {
        if (rootHash.length > 1) return Reading.getManyByRootHash(rootHash, options);
        else if (rootHash.length === 1)
          return [await Reading.getByRootHash(rootHash[0], options)];
      }
      return [[]];
    },
    [],
  );
  return useAsync(getReadings);
}
