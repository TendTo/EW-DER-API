import { Container } from "@mui/material";
import { useEthers } from "@usedapp/core";
import React, { useContext, useMemo } from "react";
import { Aggregator, LoginPage, User } from "./components";
import org from "./config/org.config.json";
import { Volta } from "./config/useDAppconfig";
import { IAMContext } from "./context";

function DApp() {
  const { account, chainId } = useEthers();
  const { state } = useContext(IAMContext);

  const isAggregator = useMemo(() => {
    if (!state) return false;
    return !!state.didDocument.service.find(
      (role) =>
        role.claimType === org.roles.dfo.namespace &&
        role.signer === org.roles.dfo.issuer
    );
  }, [state]);

  if (!account || chainId !== Volta.chainId || !state || !state.connected)
    return <LoginPage />;

  return (
    <Container maxWidth="sm">
      {isAggregator ? <Aggregator /> : <User />}
    </Container>
  );
}

export default DApp;
