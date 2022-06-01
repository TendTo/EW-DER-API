import { Box, Container } from "@mui/material";
import { useMemo } from "react";
import { useRouterContext } from "../../context";
import { useGetAssets, useGetRootHashes } from "../../hooks";
import { CreateReadings, ReadingsList } from "../readings";
import { ProsumerHome } from "./ProsumerHome";

export function Prosumer() {
  const { state: route } = useRouterContext();
  const { value: assets } = useGetAssets();

  const assetDIDs = useMemo(
    () => assets?.map(({ singleValue }) => singleValue),
    [assets],
  );

  const { value: rootHashes } = useGetRootHashes(assetDIDs);

  let content;
  switch (route) {
    case "createReadings":
      content = <CreateReadings assets={assets ?? []} />;
      break;
    case "readings":
    case "aggregatedRedings":
    case "rootHashes":
      content = <ReadingsList assets={assets ?? []} rootHashes={rootHashes ?? []} />;
      break;
    default:
      content = <ProsumerHome />;
  }
  return (
    <Container sx={{ maxWidth: { xs: "99vw", lg: "lg" } }}>
      <Box mt={2} mb={2}>
        {content}
      </Box>
    </Container>
  );
}
