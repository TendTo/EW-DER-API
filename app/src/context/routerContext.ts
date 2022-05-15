import createCtx from "./createCtx";

export type RouterContextType = "home" | "readings" | "aggregated";

const [ctx, provider, useContext] = createCtx<RouterContextType>("home");

export const RouterContext = ctx;
export const RouterContextProvider = provider;
export const useRouterContext = useContext;
