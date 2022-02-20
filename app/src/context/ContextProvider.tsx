import { CssBaseline, ThemeProvider } from "@mui/material";
import { DAppProvider } from "@usedapp/core";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config/useDAppconfig";
import { ColorModeContext } from "./colorModeContext";
import { getTheme } from "../theme/appTheme";
import { IAMContextProvider } from "./IAMContext";

type ContextProviderProps = {
  children: React.ReactNode;
};

export function ContextProvider({ children }: ContextProviderProps) {
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
    <IAMContextProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DAppProvider config={config}>{children}</DAppProvider>
          <ToastContainer />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </IAMContextProvider>
  );
}
