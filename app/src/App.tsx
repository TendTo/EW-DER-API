import { CssBaseline, ThemeProvider } from "@mui/material";
import { DAppProvider } from "@usedapp/core";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppFooter from "./components/AppFooter";
import AppTopBar from "./components/AppTopBar";
import config from "./config/useDAppconfig";
import { ColorModeContext } from "./context/colorModeContext";
import DApp from "./DApp";
import { getTheme } from "./theme/appTheme";

function App() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DAppProvider config={config}>
            <AppTopBar />
            <DApp />
            <AppFooter />
          </DAppProvider>
          <ToastContainer />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
