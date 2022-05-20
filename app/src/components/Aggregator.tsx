import { Box, Container } from "@mui/material";
import React from "react";
import { useRouterContext } from "../context";
import { useGetReadings } from "../hooks";
import { ReadingsForm } from "./readings/ReadingsForm";
import { ReadingList } from "./readings/ReadingsList";

export function Aggregator() {
  const { value, execute } = useGetReadings();
  const { state: route } = useRouterContext();

  return (
    <Container sx={{ maxWidth: { xs: "100vw", md: "md" } }}>
      {route === "home" || route === "readings" ? (
        <Box mt={2} mb={2}>
          <ReadingsForm onSuccess={execute} />
          <ReadingList readings={value ?? [[]]} />
        </Box>
      ) : (
        <Box mt={2} mb={2}>
          <div>Fest</div>
        </Box>
      )}
    </Container>
  );
}
