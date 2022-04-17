export class BaseRepository {
  constructor(readonly baseUrl: string, readonly apiVersion = "v1") {}

  public async fetchText(
    path?: string,
    method: string = "GET",
    queryParams?: Record<string, string | number | boolean>,
    body?: Record<string, string | number | boolean>,
  ): Promise<string> {
    const res = await this.apiRequest(path, method, queryParams, body);
    this.handleError(res);
    return res.text();
  }

  public async fetchJson<T>(
    path?: string,
    method: string = "GET",
    queryParams?: Record<string, string | number | boolean>,
    body?: Record<string, string | number | boolean>,
  ): Promise<T> {
    const res = await this.apiRequest(path, method, queryParams, body);
    this.handleError(res);
    return res.json();
  }

  public apiRequest(
    path?: string,
    method: string = "GET",
    queryParams?: Record<string, string | number | boolean>,
    body?: Record<string, string | number | boolean>,
  ): Promise<Response> {
    const url = `${this.baseUrl}/${path ?? ""}${
      queryParams ? `?${this.queryStringify(queryParams)}` : ""
    }`;
    return this.httpRequest(url, method, body);
  }

  protected httpRequest(
    url: string,
    method: string = "GET",
    body?: Record<string, string | number | boolean>,
  ) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options: RequestInit = {
      headers: headers,
      method: method,
      ...(body && { body: JSON.stringify(body) }),
    };
    console.debug(`Fetch - ${method} - ${url}`);
    return fetch(url, options);
  }

  protected handleError(error: Response) {
    const errMsg =
      error.status && error.status !== 200
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
