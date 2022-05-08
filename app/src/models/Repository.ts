type FetchOptions = {
  method?: string;
  queryParams?: Record<string, string | number | boolean>;
  body?: Record<string, string | number | boolean>;
};

export class BaseRepository {
  constructor(
    readonly baseUrl: string = process.env.REACT_API_URL ?? "http://localhost:3000",
    readonly apiVersion = "v1",
  ) {
    if (baseUrl === "") {
      throw new Error("baseUrl is required");
    }
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
    body?: Record<string, string | number | boolean>,
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

  protected queryStringify(obj: Record<string, string | number | boolean>) {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p) && obj[p] !== null && obj[p] !== undefined) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }
}
