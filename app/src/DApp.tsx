import React from "react";
import { Aggregator, LoginPage, Prosumer } from "./components";
import { useLogin } from "./hooks";

function DApp() {
  const { isLogged, isAggregator } = useLogin();

  if (!isLogged) return <LoginPage />;

  return isAggregator ? <Aggregator /> : <Prosumer />;
}

export default DApp;
