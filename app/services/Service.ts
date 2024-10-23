import { API_VERSION } from "~/types/api";

export default class Service {
  static defaultConfig: RequestInit = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  private static handleUrl(url: string, version: API_VERSION | null): string {
    const base_api_url: string = import.meta.env.VITE_API_BASE_URL as string || "https://tms.trackingmore.net/api";
    const api_version: API_VERSION = import.meta.env.VITE_API_VERSION as API_VERSION || API_VERSION.V1;

    if (url.startsWith("http")) {
      return url;
    }

    version = version ?? api_version;

    if (version === API_VERSION.NONE) {
      return `${base_api_url}/${url}`;
    }

    if (version === API_VERSION.SELF) {
      return `${import.meta.env.VITE_WEB_URL as string}/${url}`;
    }

    return `${base_api_url}/${version}/${url}`;
  }

  public static sendGetRequest = (
    url: string,
    version: API_VERSION | null = API_VERSION.NONE,
    config?: RequestInit,
  ): Promise<Response> => {
    return fetch(this.handleUrl(url, version), {
      ...this.defaultConfig,
      ...config,
    });
  };

  protected static sendDeleteRequest = (
    url: string,
    version: API_VERSION | null = null,
    config: RequestInit = { method: "DELETE" },
  ): Promise<Response> => {
    return fetch(this.handleUrl(url, version), {
      ...this.defaultConfig,
      ...config,
    });
  };

  protected static sendPostRequest = (
    url: string,
    data?: any,
    version: API_VERSION | null = null,
    config: RequestInit = { method: "POST" },
  ): Promise<Response> => {
    config.body = JSON.stringify(data);
    return fetch(this.handleUrl(url, version), {
      ...this.defaultConfig,
      ...config,
    });
  };

  protected static sendPutRequest = (
    url: string,
    data?: any,
    version: API_VERSION | null = null,
    config: RequestInit = { method: "PUT" },
  ): Promise<Response> => {
    config.body = JSON.stringify(data);
    return fetch(this.handleUrl(url, version), {
      ...this.defaultConfig,
      ...config,
    });
  };
}
