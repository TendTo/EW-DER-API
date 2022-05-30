import { Provider } from "@ethersproject/providers";
import { CacheClient } from "iam-client-lib";
import Addresses from "../config/contracts.config.json";
import { IdentityManager__factory } from "../typechain";
import { ISingleValueModel } from "./ISingleValueModel";
import { AggregationFunction } from "./reading";
import { BaseRepository } from "./repository";

type AssetDTO = string;
type AssetQueryOptions = {
  assetDIDs?: string[];
  limit?: number;
  offset?: number;
  start: string;
  stop?: string;
};
type AssetMatchDTO = {
  assetDID: string;
  value: number;
};
export type AssetMatchQueryOptions = {
  compatibleValue?: number;
  aggregationWindow: string;
  aggregationFunction: AggregationFunction;
};

const zeroAddress = "0x0000000000000000000000000000000000000000";

export class Asset implements ISingleValueModel<string> {
  static readonly repository = new BaseRepository();
  readonly value: number;
  _owner: string;

  constructor(assetDID: string);
  constructor(assetDID: string, _owner: string);
  constructor(assetDID: string, value: number);
  constructor(assetDID: string, _owner: string, value: number);
  constructor(
    public readonly assetDID: string,
    _ownerOrValue?: string | number,
    value: number = 0,
  ) {
    this._owner = typeof _ownerOrValue === "string" ? _ownerOrValue : zeroAddress;
    this.value = typeof _ownerOrValue === "number" ? _ownerOrValue : value;
  }

  get singleValue(): string {
    return this.assetDID;
  }

  public static async get(options: AssetQueryOptions) {
    const json = await this.repository.fetchJson<AssetDTO[]>(`assets`, {
      method: "POST",
      body: options,
    });
    return json.map((asset) => new this(asset));
  }

  public static async getAll(options: AssetQueryOptions) {
    const json = await this.repository.fetchJson<AssetDTO[]>(`assets/getAll`, {
      method: "POST",
      body: options,
    });
    return json.map((asset) => new this(asset));
  }

  public static async getMatches(options: AssetMatchQueryOptions) {
    const json = await this.repository.fetchJson<[AssetMatchDTO[], AssetMatchDTO[]]>(
      `assets/matches`,
      { queryParams: options },
    );
    return [
      json[0].map(({ assetDID, value }) => new this(assetDID, value)),
      json[1].map(({ assetDID, value }) => new this(assetDID, value)),
    ] as const;
  }

  public static async getByIAM(cache: CacheClient, owner: string) {
    const json = await cache.getOwnedAssets(owner);
    return json.map((asset) => new this(asset.id.replace("volta:", ""), owner));
  }

  public static async getByOwner(owners: string[], provider: Provider) {
    const identityManager = IdentityManager__factory.connect(
      Addresses.identityManagerAddress,
      provider,
    );
    const assets = await Promise.all(
      owners.map(async (owner) => {
        const assetsCreated = await identityManager.queryFilter(
          identityManager.filters.IdentityCreated(null, owner),
          "earliest",
          "latest",
        );
        const assetsTransferred = await identityManager.queryFilter(
          identityManager.filters.IdentityTransferred(null, owner),
          "earliest",
          "latest",
        );
        // Consider all assets the user may owns among the ones that he has created or those that were transferred to him
        const possibleAssets = new Set(
          [...assetsCreated, ...assetsTransferred].map(({ args }) => args.identity),
        );
        // Filter out assets that are not currently owned by the user
        const ownedAssets = await Promise.all(
          Array.from(possibleAssets).map(async (identity) =>
            owner === (await identityManager.identityOwner(identity))
              ? new this(identity, owner)
              : undefined,
          ),
        );
        return ownedAssets.filter((asset) => asset !== undefined) as Asset[];
      }),
    );
    return assets.flat();
  }

  public async fetchOwner(provider: Provider) {
    const identityManager = IdentityManager__factory.connect(
      Addresses.identityManagerAddress,
      provider,
    );
    this._owner = await identityManager.identityOwner(this.assetDID);
    return this._owner;
  }

  public clone() {
    return new Asset(this.assetDID, this._owner);
  }

  get isConsumer() {
    return this.value <= 0;
  }

  get hasOwner() {
    return this._owner !== zeroAddress;
  }

  get hasValue() {
    return this.value !== 0;
  }

  get ownerDID(): string {
    return this._owner;
  }
}
