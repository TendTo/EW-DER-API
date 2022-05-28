import { Box, Container } from "@mui/material";
import React from "react";
import { useRouterContext } from "../context";
import { MatchList } from "./match";
import { ReadingsList } from "./readings";

export function Aggregator() {
  const { state: route } = useRouterContext();

  let content;
  switch (route) {
    case "readings":
    case "aggregatedRedings":
    case "rootHashes":
      content = <ReadingsList />;
      break;
    case "match":
      content = <MatchList />;
      break;
    default:
      content = <div>Aggregator HOME</div>;
  }

  return (
    <Container sx={{ maxWidth: { xs: "100vw", md: "lg" } }}>
      <Box mt={2} mb={2}>
        {content}
      </Box>
    </Container>
  );
}
