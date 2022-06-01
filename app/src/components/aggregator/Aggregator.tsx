import { Box, Container } from "@mui/material";
import { useMemo } from "react";
import { useRouterContext } from "../../context";
import { useGetAssets, useGetRootHashes } from "../../hooks";
import { MatchList } from "../match";
import { ReadingsList } from "../readings";
import { AggregatorHome } from "./AggregatorHome";

export function Aggregator() {
  const { state: route } = useRouterContext();
  const { value: assets } = useGetAssets();

  const assetDIDs = useMemo(
    () => assets?.map(({ singleValue }) => singleValue),
    [assets],
  );

  const { value: rootHashes } = useGetRootHashes(assetDIDs);

  let content;
  switch (route) {
    case "readings":
    case "aggregatedRedings":
    case "rootHashes":
      content = <ReadingsList assets={assets ?? []} rootHashes={rootHashes ?? []} />;
      break;
    case "match":
      content = <MatchList />;
      break;
    default:
      content = <AggregatorHome />;
  }

  return (
    <Container sx={{ maxWidth: { xs: "95vw", lg: "lg" } }}>
      <Box mt={2} mb={2}>
        {content}
      </Box>
    </Container>
  );
}
