import { useRouterContext } from "../../context";
import { useGetReadings } from "../../hooks";
import { Asset, RootHash } from "../../models";
import { AggregatedReadingsForm } from "./AggregatedReadingsForm";
import { ReadingsChart } from "./ReadingsChart";
import { ReadingsForm } from "./ReadingsForm";

type ReadingsListProps = {
  assets: Asset[];
  rootHashes: RootHash[];
};

export function ReadingsList({ assets, rootHashes }: ReadingsListProps) {
  const { value: readings, execute: getReadings, status } = useGetReadings();
  const { state: route } = useRouterContext();

  const source = route === "rootHashes" ? "rootHash" : "assetDID";
  const input = route === "rootHashes" ? rootHashes : assets;

  return (
    <>
      {route === "aggregatedRedings" ? (
        <AggregatedReadingsForm
          source={source}
          onSuccess={getReadings}
          assets={input}
          status={status}
        />
      ) : (
        <ReadingsForm
          source={source}
          onSuccess={getReadings}
          assets={input}
          status={status}
        />
      )}
      <ReadingsChart source={source} readings={readings ?? []} />
    </>
  );
}
