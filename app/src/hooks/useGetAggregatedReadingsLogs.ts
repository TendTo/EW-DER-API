import { useEthers } from "@usedapp/core";
import { useMemo } from "react";
import Addresses from "../config/contracts.config.json";
import { ReadingsNotary__factory } from "../typechain/ReadingsNotary__factory";
import { useAsync } from "./useAsync";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @param rootHash root hash of the aggregated readings log on the blockchain.
 * If not provided, the latest log will be fetched.
 * @returns aggregated readings logs
 */
export function useGetAggregatedReadingsLogs(
  rootHash?: string | string[],
  aggregator?: string | string[],
) {
  const { library } = useEthers();
  const query = useMemo(() => {
    if (!library) return undefined;
    const notary = ReadingsNotary__factory.connect(
      Addresses.readingsNotaryAddress,
      library,
    );
    const filter = notary.filters.NewMeterReading(aggregator, rootHash);
    return () => notary.queryFilter(filter);
  }, [library, rootHash, aggregator]);
  return useAsync(query);
}
