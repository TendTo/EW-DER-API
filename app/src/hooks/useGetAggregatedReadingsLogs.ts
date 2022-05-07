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
export function useGetAggregatedReadingsLogs(rootHash?: string, aggregator?: string) {
  const { library } = useEthers();
  const query = useMemo(() => {
    if (library) {
      const notary = ReadingsNotary__factory.connect(
        Addresses.readingsNotaryAddress,
        library,
      );
      const filter = notary.filters.NewMeterReading(aggregator, rootHash);
      return () => notary.queryFilter(filter);
    } else return undefined;
  }, [library, rootHash, aggregator]);
  return useAsync(query);
}
