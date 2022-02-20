import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { AppFooter, AppTopBar } from "./components";
import { ContextProvider } from "./context";
import DApp from "./DApp";

function App() {
  return (
    <ContextProvider>
      <AppTopBar />
      <DApp />
      <AppFooter />
    </ContextProvider>
  );
}

export default App;
