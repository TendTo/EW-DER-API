/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { EventFragment, FunctionFragment, Result } from "@ethersproject/abi";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  CallOverrides,
  ContractTransaction,
  ethers,
  Overrides,
  PopulatedTransaction,
  Signer,
} from "ethers";
import type { TypedEvent, TypedEventFilter, TypedListener } from "./common";

interface IdentityManagerInterface extends ethers.utils.Interface {
  functions: {
    "compliant(address)": FunctionFragment;
    "createIdentity(address)": FunctionFragment;
    "identityAccepted(address)": FunctionFragment;
    "identityCreated(address)": FunctionFragment;
    "identityOfferCanceled(address)": FunctionFragment;
    "identityOffered(address)": FunctionFragment;
    "identityOwner(address)": FunctionFragment;
    "identityRejected(address)": FunctionFragment;
    "verified(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "compliant", values: [string]): string;
  encodeFunctionData(
    functionFragment: "createIdentity",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "identityAccepted",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "identityCreated",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "identityOfferCanceled",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "identityOffered",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "identityOwner",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "identityRejected",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "verified", values: [string]): string;

  decodeFunctionResult(functionFragment: "compliant", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createIdentity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "identityAccepted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "identityCreated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "identityOfferCanceled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "identityOffered",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "identityOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "identityRejected",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "verified", data: BytesLike): Result;

  events: {
    "IdentityCreated(address,address,uint256)": EventFragment;
    "IdentityOfferCanceled(address,address,address,uint256)": EventFragment;
    "IdentityOfferRejected(address,address,address,uint256)": EventFragment;
    "IdentityOffered(address,address,address,uint256)": EventFragment;
    "IdentityTransferred(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "IdentityCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IdentityOfferCanceled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IdentityOfferRejected"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IdentityOffered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IdentityTransferred"): EventFragment;
}

export type IdentityCreatedEvent = TypedEvent<
  [string, string, BigNumber] & {
    identity: string;
    owner: string;
    at: BigNumber;
  }
>;

export type IdentityOfferCanceledEvent = TypedEvent<
  [string, string, string, BigNumber] & {
    identity: string;
    owner: string;
    oferedto: string;
    at: BigNumber;
  }
>;

export type IdentityOfferRejectedEvent = TypedEvent<
  [string, string, string, BigNumber] & {
    identity: string;
    owner: string;
    offeredTo: string;
    at: BigNumber;
  }
>;

export type IdentityOfferedEvent = TypedEvent<
  [string, string, string, BigNumber] & {
    identity: string;
    owner: string;
    offeredTo: string;
    at: BigNumber;
  }
>;

export type IdentityTransferredEvent = TypedEvent<
  [string, string, BigNumber] & {
    identity: string;
    owner: string;
    at: BigNumber;
  }
>;

export class IdentityManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IdentityManagerInterface;

  functions: {
    compliant(identity: string, overrides?: CallOverrides): Promise<[boolean]>;

    createIdentity(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    identityAccepted(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    identityCreated(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    identityOfferCanceled(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    identityOffered(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    identityOwner(
      identity: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    identityRejected(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    verified(identity: string, overrides?: CallOverrides): Promise<[boolean]>;
  };

  compliant(identity: string, overrides?: CallOverrides): Promise<boolean>;

  createIdentity(
    _owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  identityAccepted(
    _owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  identityCreated(
    _owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  identityOfferCanceled(
    _offeredTo: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  identityOffered(
    _offeredTo: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  identityOwner(identity: string, overrides?: CallOverrides): Promise<string>;

  identityRejected(
    _offeredTo: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  verified(identity: string, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    compliant(identity: string, overrides?: CallOverrides): Promise<boolean>;

    createIdentity(_owner: string, overrides?: CallOverrides): Promise<void>;

    identityAccepted(_owner: string, overrides?: CallOverrides): Promise<void>;

    identityCreated(_owner: string, overrides?: CallOverrides): Promise<void>;

    identityOfferCanceled(
      _offeredTo: string,
      overrides?: CallOverrides
    ): Promise<void>;

    identityOffered(
      _offeredTo: string,
      overrides?: CallOverrides
    ): Promise<void>;

    identityOwner(identity: string, overrides?: CallOverrides): Promise<string>;

    identityRejected(
      _offeredTo: string,
      overrides?: CallOverrides
    ): Promise<void>;

    verified(identity: string, overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    "IdentityCreated(address,address,uint256)"(
      identity?: string | null,
      owner?: string | null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { identity: string; owner: string; at: BigNumber }
    >;

    IdentityCreated(
      identity?: string | null,
      owner?: string | null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { identity: string; owner: string; at: BigNumber }
    >;

    "IdentityOfferCanceled(address,address,address,uint256)"(
      identity?: string | null,
      owner?: string | null,
      oferedto?: null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { identity: string; owner: string; oferedto: string; at: BigNumber }
    >;

    IdentityOfferCanceled(
      identity?: string | null,
      owner?: string | null,
      oferedto?: null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { identity: string; owner: string; oferedto: string; at: BigNumber }
    >;

    "IdentityOfferRejected(address,address,address,uint256)"(
      identity?: string | null,
      owner?: null,
      offeredTo?: string | null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { identity: string; owner: string; offeredTo: string; at: BigNumber }
    >;

    IdentityOfferRejected(
      identity?: string | null,
      owner?: null,
      offeredTo?: string | null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { identity: string; owner: string; offeredTo: string; at: BigNumber }
    >;

    "IdentityOffered(address,address,address,uint256)"(
      identity?: string | null,
      owner?: string | null,
      offeredTo?: null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { identity: string; owner: string; offeredTo: string; at: BigNumber }
    >;

    IdentityOffered(
      identity?: string | null,
      owner?: string | null,
      offeredTo?: null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { identity: string; owner: string; offeredTo: string; at: BigNumber }
    >;

    "IdentityTransferred(address,address,uint256)"(
      identity?: string | null,
      owner?: string | null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { identity: string; owner: string; at: BigNumber }
    >;

    IdentityTransferred(
      identity?: string | null,
      owner?: string | null,
      at?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { identity: string; owner: string; at: BigNumber }
    >;
  };

  estimateGas: {
    compliant(identity: string, overrides?: CallOverrides): Promise<BigNumber>;

    createIdentity(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    identityAccepted(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    identityCreated(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    identityOfferCanceled(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    identityOffered(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    identityOwner(
      identity: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    identityRejected(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    verified(identity: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    compliant(
      identity: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createIdentity(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    identityAccepted(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    identityCreated(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    identityOfferCanceled(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    identityOffered(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    identityOwner(
      identity: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    identityRejected(
      _offeredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    verified(
      identity: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
