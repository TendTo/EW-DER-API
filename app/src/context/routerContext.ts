import createCtx from "./createCtx";

export type RouterContextType =
  | "home"
  | "createReadings"
  | "readings"
  | "rootHashes"
  | "aggregatedRedings"
  | "match"
  | "about";

const [ctx, provider, useContext] = createCtx<RouterContextType>("readings");

export const RouterContext = ctx;
export const RouterContextProvider = provider;
export const useRouterContext = useContext;
