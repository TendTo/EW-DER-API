import { Provider } from "@ethersproject/providers";
import Addresses from "../config/contracts.config.json";
import { IdentityManager__factory } from "../typechain";

const zeroAddress = "0x0000000000000000000000000000000000000000";

export class Asset {
  constructor(private _asset: string, private _owner: string = zeroAddress) {}

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
    this._owner = await identityManager.identityOwner(this.asset);
    return this._owner;
  }

  public clone() {
    return new Asset(this._asset, this._owner);
  }

  get asset(): string {
    return this._asset;
  }

  get owner(): string {
    return this._owner;
  }
}
