import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { AppFooter, AppTopBar } from "./components";
import { Graph } from "./components/Graph";
import { ContextProvider } from "./context";
import DApp from "./DApp";

function App() {
  return (
    <ContextProvider>
      <AppTopBar />
      <DApp />
      <Graph data={[]} />
      <AppFooter />
    </ContextProvider>
  );
}

export default App;
