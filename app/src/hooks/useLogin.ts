import { useEthers } from "@usedapp/core";
import { initWithMetamask } from "iam-client-lib";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { IAMContext } from "../context";

export function useLogin() {
  const { t } = useTranslation();
  const { update } = useContext(IAMContext);
  const { activateBrowserWallet } = useEthers();

  const login = async () => {
    activateBrowserWallet();
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
  };

  return { login };
}
