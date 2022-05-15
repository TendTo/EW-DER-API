import React from "react";
import { Aggregator, LoginPage, User } from "./components";
import { useLogin } from "./hooks";

function DApp() {
  const { isLogged, isAggregator } = useLogin();

  if (!isLogged) return <LoginPage />;

  return isAggregator ? <Aggregator /> : <User />;
}

export default DApp;
