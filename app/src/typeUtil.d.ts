import { Contract } from "ethers";

type ArrayKeys = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type Test<C extends Contract, M extends keyof C["functions"]> = Awaited<
  ReturnType<C["functions"][M]>
>;

export type ContractReturnType<
  C extends Contract,
  M extends keyof C["functions"]
> = Awaited<ReturnType<C["functions"][M]>>;

export type ContractReturnTypeArray<
  C extends Contract,
  M extends keyof C["functions"]
> = {
  [K in keyof ContractReturnType<C, M> as K extends ArrayKeys
    ? K
    : never]: ContractReturnType<C, M>[K];
};

export type ContractReturnTypeObject<
  C extends Contract,
  M extends keyof C["functions"]
> = {
  [K in keyof ContractReturnType<C, M> as K extends keyof Array<any>
    ? never
    : K]: ContractReturnType<C, M>[K];
};
