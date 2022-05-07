import { Container } from "@mui/material";
import { useEthers } from "@usedapp/core";
import React, { useContext } from "react";
import { Aggregator, LoginPage, User } from "./components";
import { Volta } from "./config/useDAppconfig";
import { IAMContext } from "./context";
import { useIsAggregator } from "./hooks";

function DApp() {
  const { account, chainId } = useEthers();
  const { state } = useContext(IAMContext);
  const isAggregator = useIsAggregator(state);

  if (!account || chainId !== Volta.chainId || !state || !state.connected)
    return <LoginPage />;

  return <Container maxWidth="sm">{isAggregator ? <Aggregator /> : <User />}</Container>;
}

export default DApp;
