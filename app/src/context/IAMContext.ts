import {
  CacheClient,
  ClaimsService,
  DidRegistry,
  DomainsService,
  initWithMetamask,
} from "iam-client-lib";
import createCtx from "./createCtx";

type DidDocumentType = Awaited<ReturnType<DidRegistry["getDidDocument"]>>;

export type IAMContextType = {
  iamConnection: Awaited<ReturnType<typeof initWithMetamask>>;
  cacheClient: CacheClient;
  didRegistry: DidRegistry;
  claimsService: ClaimsService;
  domainsService: DomainsService;
  connected: boolean;
  didDocument: DidDocumentType;
};

const [ctx, provider, useContext] = createCtx<IAMContextType>();

export const IAMContext = ctx;
export const IAMContextProvider = provider;
export const useIamContext = useContext;
