import { Container } from "@mui/material";
import { useEthers } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import EmptyLogin from "./components/EmptyLogin";
import { Volta } from "./config/useDAppconfig";
import { useGetDemand } from "./hooks/useGetDemand";
import { useSetDemand } from "./hooks/useSetDemand";

function DApp() {
  const [volume, setVolume] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const { account, library, chainId, error } = useEthers();
  const demand = useGetDemand(account);
  const { send, state, resetState } = useSetDemand();
  library?.resolveName("tend.ewc").then(console.log).catch(console.error);

  useEffect(() => {
    if (demand[1] && demand[2]) {
      setVolume(demand[1].toNumber());
      setPrice(demand[2].toNumber());
    }
  }, [demand]);

  if (!account || chainId !== Volta.chainId) {
    error && console.error(error);
    return <EmptyLogin />;
  }

  return (
    <Container maxWidth="xl">
      <div>
        {demand && demand[1] && (
          <>
            <p>IsAccepted: {demand[0] ? "true" : "false"}</p>
            <p>Volume: {demand[1].toString()}</p>
            <p>Price: {demand[2].toString()}</p>
          </>
        )}
      </div>
      <hr />
      {account && (
        <div>
          <input
            type="number"
            name="volume"
            value={volume}
            onChange={(e) => {
              e.preventDefault();
              if (Number.parseInt(e.target.value))
                setVolume(parseInt(e.target.value));
              else setVolume(0);
            }}
          />
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => {
              e.preventDefault();
              if (Number.parseInt(e.target.value))
                setPrice(parseInt(e.target.value));
              else setPrice(0);
            }}
          />
          <button onClick={() => send(volume, price)}>Connect</button>
        </div>
      )}
    </Container>
  );
}

export default DApp;
