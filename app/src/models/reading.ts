import { BaseRepository } from "./repository";

type DID = `did:ethr:0x${string}`;
type Address = `0x${string}`;
type Order = "ASC" | "DESC";

type ReadingsDTO = {
  assetDID: DID;
  rootHash: Address;
  timestamp: string;
  value: number;
};

export type ReadingsDTOOptions = {
  start: string;
  stop?: string;
  limit?: number;
  offset?: number;
  order?: Order;
};

export class Reading {
  static readonly repository = new BaseRepository();

  constructor(
    private _assetDID: DID,
    private _assetOwner: Address,
    private _rootHash: Address,
    private _volume: number,
    private _timestamp: Date,
    private _verified: boolean = false,
  ) {}

  private static dtoMapper(dto: ReadingsDTO) {
    return new Reading(
      dto.assetDID,
      "0x",
      dto.rootHash,
      dto.value,
      new Date(dto.timestamp),
    );
  }

  public static async getByAssetDID(assetDID: string, options: ReadingsDTOOptions) {
    const json = await this.repository.fetchJson<ReadingsDTO[]>(
      `readings/assetDID/${encodeURIComponent(assetDID)}`,
      {
        queryParams: options,
      },
    );
    return json.map(this.dtoMapper);
  }

  public static async getManyByAssetDID(
    assetDIDs: string[],
    options: ReadingsDTOOptions,
  ) {
    const json = await this.repository.fetchJson<ReadingsDTO[][]>(`readings/assetDID`, {
      method: "POST",
      body: { ...options, assetDIDs },
    });
    return json.map((readings: ReadingsDTO[]) => readings.map(this.dtoMapper));
  }

  public static async getByRootHash(rootHash: string, options: ReadingsDTOOptions) {
    const json = await this.repository.fetchJson<ReadingsDTO[]>(
      `/readings/roothash/${encodeURIComponent(rootHash)}`,
      { queryParams: options },
    );
    return json.map(this.dtoMapper);
  }

  public static async getManyByRootHash(
    rootHashes: string[],
    options: ReadingsDTOOptions,
  ) {
    const json = await this.repository.fetchJson<ReadingsDTO[][]>(`readings/roothash`, {
      method: "POST",
      body: { ...options, rootHashes },
    });
    return json.map((readings: ReadingsDTO[]) => readings.map(this.dtoMapper));
  }

  public static async getLast(
    assetDID: string,
    options: Pick<ReadingsDTOOptions, "start">,
  ) {
    const json = await this.repository.fetchJson<ReadingsDTO>(
      `readings/${encodeURIComponent(assetDID)}/latest`,
      {
        queryParams: options,
      },
    );
    return this.dtoMapper(json);
  }

  public clone(): Reading {
    return new Reading(
      this._assetDID,
      this._assetOwner,
      this._rootHash,
      this._volume,
      this._timestamp,
    );
  }

  get verified(): boolean {
    //TODO: verify reading by calling contract
    return this._verified;
  }

  get assetDID(): DID {
    return this._assetDID;
  }

  get rootHash(): Address {
    return this._rootHash;
  }

  get assetOwner(): Address {
    return this._assetOwner;
  }

  get volume(): number {
    return this._volume;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get unixTimestamp(): number {
    return this._timestamp.getTime();
  }
}
