import { BaseRepository } from "./repository";

type RootHashDTO = string;
type RootHashQueryOptions = {
  assetDIDs?: string[];
  limit?: number;
  offset?: number;
  start: string;
  stop?: string;
};

export class RootHash {
  static readonly repository = new BaseRepository();

  constructor(public readonly rootHash: string) {}

  public static async get(options: RootHashQueryOptions) {
    const json = await this.repository.fetchJson<RootHashDTO[]>(`readings/rootHashes`, {
      body: { ...options },
    });
    return json.map((rootHash) => new this(rootHash));
  }
}
