import { JsonRpcProvider } from "@ethersproject/providers";
import { Injectable, Logger } from "@nestjs/common";
import { utils, Wallet } from "ethers";
import { VOLTA_CHAIN } from "src/constants";
import { ReadingDTO } from "src/readings/dto";
import { getAddressFromDID } from "src/utility";
import { IdentityManager, IdentityManager__factory } from "./typechain";

@Injectable()
export class BlockchainService {
  private wallet: Wallet;
  private identityManager: IdentityManager;

  constructor() {
    const provider = new JsonRpcProvider(
      process.env.VOLTA_URL ?? "https://volta-rpc.energyweb.org",
      VOLTA_CHAIN,
    );
    this.wallet = utils.isValidMnemonic(process.env.SK)
      ? Wallet.fromMnemonic(process.env.SK).connect(provider)
      : new Wallet(process.env.SK, provider);

    this.identityManager = IdentityManager__factory.connect(
      process.env.IDENTITY_MANAGER_ADDRESS,
      this.wallet,
    );
  }

  getSignatureAddress(message: string, signature: string) {
    return utils.verifyMessage(message, signature);
  }

  async isOwner(prosumer: string, readings: ReadingDTO[]): Promise<boolean>;
  async isOwner(prosumer: string, assetDID: string): Promise<boolean>;
  async isOwner(
    prosumer: string,
    DIDorReadings: string | ReadingDTO[],
  ): Promise<boolean> {
    Logger.debug(`Requesting isOwner for ${prosumer} and ${DIDorReadings}`);
    if (typeof DIDorReadings === "string") {
      const addressDID = getAddressFromDID(DIDorReadings);
      const owner = await this.identityManager.identityOwner(addressDID);
      Logger.debug(`Owner of ${DIDorReadings} is ${owner}`);
      return owner === prosumer;
    } else {
      const assetDIDs = DIDorReadings.filter(
        (assetDID, i, arr) => arr.indexOf(assetDID) === i,
      ).map((reading) => getAddressFromDID(reading.assetDID));
      const owner = await Promise.all(
        assetDIDs.map(async (assetDID) => {
          Logger.debug(`${assetDID}: is ${this.identityManager.address}`);
          const owner = await this.identityManager.identityOwner(assetDID);
          Logger.debug(`Owner of ${assetDID} is ${owner}`);
          return owner === prosumer;
        }),
      );
      return owner.every((o) => o);
    }
  }
}
