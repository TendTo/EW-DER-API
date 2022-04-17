import { BaseRepository } from "./Repository";

export class MeteredReading {
  readonly repository = new BaseRepository(process.env.API_URL ?? "");

  constructor(
    private _asset: string,
    private _owner: string,
    private _volume: number,
    private _timestamp: Date,
  ) {}

  public static async getAll() {
    const repository = new BaseRepository(process.env.API_URL ?? "");
    return repository.fetchJson<MeteredReading[]>(`/metered-readings`);
  }

  public static async get() {}

  public verify(): boolean {
    //TODO: verify reading by calling contract
    return true;
  }

  public clone(): MeteredReading {
    return new MeteredReading(this._asset, this._owner, this._volume, this._timestamp);
  }

  get asset(): string {
    return this._asset;
  }

  get owner(): string {
    return this._owner;
  }

  get volume(): number {
    return this._volume;
  }

  get timestamp(): Date {
    return this._timestamp;
  }
}
