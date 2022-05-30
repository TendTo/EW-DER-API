import { Box, Container } from "@mui/material";
import { useRouterContext } from "../../context";
import { MatchList } from "../match";
import { ReadingsList } from "../readings";
import { AggregatorHome } from "./AggregatorHome";

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
