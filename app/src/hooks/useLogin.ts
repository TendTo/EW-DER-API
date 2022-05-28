import { useEthers } from "@usedapp/core";
import { initWithMetamask } from "iam-client-lib";
import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Volta } from "../config/useDAppconfig";
import { IAMContext } from "../context";
import { useIsAggregator } from "./useIsAggregator";
import { useJwtLogin } from "./useJwtLogin";

export function useLogin() {
  const { t } = useTranslation();
  const { update, state } = useContext(IAMContext);
  const { activateBrowserWallet, account, chainId, deactivate } = useEthers();
  const { jwtLogin, jwtLogout } = useJwtLogin();
  const isAggregator = useIsAggregator(state);

  const login = useCallback(async () => {
    activateBrowserWallet();
    await toast.promise(jwtLogin, {
      pending: t("AGGREGATOR.CONNECTION_PROGRESS"),
      success: t("AGGREGATOR.CONNECTION_SUCCESS"),
      error: t("ERROR.AGGREGATOR_CONNECTION"),
    });
    toast.promise(
      async () => {
        const res = await initWithMetamask();
        const cache = await res.connectToCacheServer();
        const didConnection = await cache.connectToDidRegistry();
        update({
          connected: true,
          iamConnection: res,
          cacheClient: cache.cacheClient,
          didRegistry: didConnection.didRegistry,
          claimsService: didConnection.claimsService,
          domainsService: cache.domainsService,
          didDocument: await didConnection.didRegistry.getDidDocument(),
        });
      },
      {
        pending: t("IAM.CONNECTION_PROGRESS"),
        success: t("IAM.CONNECTION_SUCCESS"),
        error: t("ERROR.IAM_CONNECTION"),
      },
    );
  }, [activateBrowserWallet, jwtLogin, update, t]);

  const logout = useCallback(() => {
    deactivate();
    update(undefined);
    jwtLogout();
  }, [deactivate, update, jwtLogout]);

  const isLogged = useMemo(
    () => !(!account || chainId !== Volta.chainId || !state || !state.connected),
    [state, account, chainId],
  );

  return { login, logout, account, chainId, iam: state, isLogged, isAggregator };
}
