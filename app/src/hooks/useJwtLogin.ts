import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { BaseRepository } from "../models";

export function useJwtLogin() {
  const { account, library } = useEthers();
  const jwtLogin = useCallback(async () => {
    if (!account || !library) return null;
    const repository = new BaseRepository();
    const { nonce } = await repository.fetchJson<{ nonce: string }>("auth/nonce", {
      queryParams: { address: account },
    });
    const signedNonce = await library?.getSigner().signMessage(nonce);
    if (!signedNonce) return null;
    const { jwt } = await repository.fetchJson<{ jwt: string }>("auth/login", {
      body: { signedNonce, address: account },
      method: "POST",
    });
    localStorage.setItem("jwt", jwt);
    return jwt;
  }, [library, account]);

  return { jwtLogin };
}
