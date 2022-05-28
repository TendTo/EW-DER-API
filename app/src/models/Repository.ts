type Stringifiable = string | number | boolean | string[] | number[] | boolean[];
type QueryParamsType = Record<string, Stringifiable>;
type FetchOptions = {
  method?: string;
  queryParams?: QueryParamsType;
  body?: Record<string, Stringifiable>;
};

export class BaseRepository {
  readonly baseUrl: string;
  constructor(
    baseUrl: string = process.env.REACT_APP_API_URL ?? "http://localhost:3000",
    // baseUrl: string = "http://localhost:3000",
    readonly apiVersion = "v1",
  ) {
    if (baseUrl === "") {
      throw new Error("baseUrl is required");
    }
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  public async fetchText(
    path: string,
    { method = "GET", queryParams, body }: FetchOptions = {},
  ): Promise<string> {
    const res = await this.apiRequest(path, { method, queryParams, body });
    this.handleError(res);
    return res.text();
  }

  public async fetchJson<T>(
    path: string,
    { method = "GET", queryParams, body }: FetchOptions = {},
  ): Promise<T> {
    const res = await this.apiRequest(path, { method, queryParams, body });
    this.handleError(res);
    return res.json();
  }

  public apiRequest(
    path: string,
    { method = "GET", queryParams, body }: FetchOptions = {},
  ): Promise<Response> {
    const fixedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${this.baseUrl}${fixedPath}${
      queryParams ? `?${this.queryStringify(queryParams)}` : ""
    }`;
    return this.httpRequest(url, method, body);
  }

  protected httpRequest(
    url: string,
    method: string = "GET",
    body?: Record<string, Stringifiable>,
  ) {
    const jwt = localStorage.getItem("jwt");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("X-API-Version", this.apiVersion);
    jwt && headers.append("Authorization", `Bearer ${jwt}`);
    const options: RequestInit = {
      headers: headers,
      method: method,
      ...(body && { body: JSON.stringify(body) }),
    };
    console.debug(`Fetch - ${method} - ${url}`);
    return fetch(url, options);
  }

  protected handleError(error: Response) {
    if (error.status < 400) return;
    const errMsg =
      error.status && error.status >= 400
        ? `${error.status} - ${error.statusText}`
        : "Server error";
    throw Error(errMsg);
  }

  protected queryStringify(obj: QueryParamsType) {
    let str = [];
    for (let p in obj) {
      const val = obj[p];
      if (val !== null && val !== undefined) {
        if (Array.isArray(val)) {
          str.push(
            val.map((v) => `${encodeURIComponent(p)}=${encodeURIComponent(v)}`).join("&"),
          );
        } else {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
        }
      }
    }
    return str.join("&");
  }
}
