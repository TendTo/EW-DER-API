import { Box, Container } from "@mui/material";
import { useRouterContext } from "../context";
import { CreateReadings, ReadingsList } from "./readings";

export function Prosumer() {
  const { state: route } = useRouterContext();

  let content;
  switch (route) {
    case "createReadings":
      content = <CreateReadings />;
      break;
    case "readings":
    case "aggregatedRedings":
    case "rootHashes":
      content = <ReadingsList />;
      break;
    default:
      content = <div>Prosumer HOME</div>;
  }
  return (
    <Container sx={{ maxWidth: { xs: "99vw", lg: "lg" } }}>
      <Box mt={2} mb={2}>
        {content}
      </Box>
    </Container>
  );
}
