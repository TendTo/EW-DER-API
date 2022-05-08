import { Container } from "@mui/material";
import React from "react";
import { useGetReadings } from "../hooks";
import { ReadingList } from "./ReadingList";
import { ReadingsForm } from "./ReadingsForm";

export function Aggregator() {
  const { value, status, error, execute } = useGetReadings();
  console.log("Aggregator", value, status, error);

  // const logs = value?.map((log) => (
  //   <li key={log.transactionHash}>
  //     Aggregator: {log.args.operator} - RootHash (hashed): {(log.args.proof as any).hash}
  //   </li>
  // ));

  // const readings = value?.map((reading) => (
  //   <li key={`${reading.assetDID}-${reading.timestamp}`}>
  //     DID: {reading.assetDID} - Volume: {reading.volume}
  //   </li>
  // ));

  return (
    <Container maxWidth="xl">
      <ReadingsForm onSuccess={execute} />
      <ReadingList data={value ?? []} />
    </Container>
  );
}
