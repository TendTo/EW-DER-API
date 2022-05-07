import { Container } from "@mui/material";
import React from "react";
import { useGetAggregatedReadingsLogs } from "../hooks/useGetAggregatedReadingsLogs";

export function Aggregator() {
  const { value, status, error } = useGetAggregatedReadingsLogs();
  console.log("Aggregator", value, status, error);

  const logs = value?.map((log) => (
    <li key={log.transactionHash}>
      Aggregator: {log.args.operator} - RootHash (hashed): {(log.args.proof as any).hash}
    </li>
  ));

  return (
    <Container maxWidth="xl">
      <div>
        <p>Aggregator</p>
        {status === "pending" ? (
          <p>Loading...</p>
        ) : value && value.length ? (
          <ul>{logs}</ul>
        ) : (
          <p>No data</p>
        )}
      </div>
    </Container>
  );
}
