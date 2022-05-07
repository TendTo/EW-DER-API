import { useMemo } from "react";
import org from "../config/org.config.json";
import { IAMContextType } from "../context";

/**
 * Whether or not the current user is an aggregator
 * @param state current state of the IAM client lib
 * @returns whether or not the current user is an aggregator
 */
export function useIsAggregator(state?: IAMContextType): boolean {
  return useMemo(() => {
    if (!state) return false;
    return !!state.didDocument.service.find(
      (role) =>
        role.claimType === org.roles.dfo.namespace &&
        role.signer === org.roles.dfo.issuer,
    );
  }, [state]);
}
