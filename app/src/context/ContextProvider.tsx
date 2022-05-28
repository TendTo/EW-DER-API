import { CssBaseline, ThemeProvider } from "@mui/material";
import { DAppProvider } from "@usedapp/core";
import React, { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config/useDAppconfig";
import { getTheme } from "../theme/appTheme";
import ColorModeContext from "./colorModeContext";
import { IAMContextProvider } from "./IAMContext";
import { RouterContextProvider } from "./routerContext";

type ContextProviderProps = {
  children: React.ReactNode;
};

export default function ContextProvider({ children }: ContextProviderProps) {
  const [mode, setMode] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "light" ? "light" : "dark",
  );
  const theme = useMemo(() => getTheme(mode), [mode]);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("theme", newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  return (
    <RouterContextProvider>
      <IAMContextProvider>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <DAppProvider config={config}>{children}</DAppProvider>
            <ToastContainer />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </IAMContextProvider>
    </RouterContextProvider>
  );
}
