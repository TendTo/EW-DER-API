import { useMemo } from "react";
import { Reading, ReadingsDTOOptions } from "../models";
import { useAsyncParams } from "./useAsync";

type UseGetReadingsArgs = ReadingsDTOOptions & {
  assetDID?: string | string[];
  rootHash?: string | string[];
};

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @param rootHash root hash of the aggregated readings log on the blockchain.
 * If not provided, the latest log will be fetched.
 * @returns aggregated readings logs
 */
export function useGetReadings() {
  const getReadings = useMemo(
    () =>
      async ({ assetDID, rootHash, ...options }: UseGetReadingsArgs) => {
        if (assetDID) {
          if (Array.isArray(assetDID)) {
            const readings = await Promise.all(
              assetDID.map(async (did) => await Reading.getByAssetDID(did, options)),
            );
            return readings.flat();
          }
          return Reading.getByAssetDID(assetDID, options);
        }
        if (rootHash) {
          if (Array.isArray(rootHash)) {
            const readings = await Promise.all(
              rootHash.map(async (hash) => await Reading.getByRootHash(hash, options)),
            );
            return readings.flat();
          }
          return Reading.getByRootHash(rootHash, options);
        }
        return [];
      },
    [],
  );
  return useAsyncParams<Reading[], UseGetReadingsArgs>(getReadings);
}
