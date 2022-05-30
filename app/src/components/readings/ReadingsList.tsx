import React, { useEffect } from "react";
import { useRouterContext } from "../../context";
import { useGetAssets, useGetReadings, useGetRootHashes } from "../../hooks";
import { AggregatedReadingsForm } from "./AggregatedReadingsForm";
import { ReadingsChart } from "./ReadingsChart";
import { ReadingsForm } from "./ReadingsForm";

export function ReadingsList() {
  const { value: assets } = useGetAssets();
  const { value: rootHashes, execute: getRootHashes } = useGetRootHashes();
  const { value: readings, execute: getReadings, status } = useGetReadings();
  const { state: route } = useRouterContext();

  const source = route === "rootHashes" ? "rootHash" : "assetDID";
  const input = route === "rootHashes" ? rootHashes : assets;

  useEffect(() => {
    if (assets) {
      getRootHashes(assets.map(({ singleValue: value }) => value));
    }
  }, [getRootHashes, assets]);

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
