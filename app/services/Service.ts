import {API_VERSION} from "~/types/api";

export default class Service {
  private static defaultConfig: RequestInit = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  private static handleUrl(url: string, version: string = ""): string {
    const base_api_url: string =
      import.meta.env.VITE_API_BASE_URL || "https://tms.trackingmore.net/api";
    const api_version: string = import.meta.env.VITE_API_VERSION || API_VERSION.V1;
    if (url.startsWith("http")) {
      return url;
    }
    if (version === "") {
      version = api_version;
    }
    if (version === API_VERSION.NONE) {
      return `${base_api_url}/${url}`;
    }
    if (version === API_VERSION.SELF) {
      return `${import.meta.env.VITE_WEB_URL}/${url}`;
    }
    return `${base_api_url}/${version}/${url}`;
  }

  public static sendGetRequest = (
    url: string,
    version: string = "",
    config?: RequestInit,
  ): Promise<Response> => {
    return fetch(this.handleUrl(url, version), {
      ...this.defaultConfig,
      ...config,
    });
  };

  protected static sendDeleteRequest = (
    url: string,
    version = "",
    config?: RequestInit,
  ): Promise<Response> => {
    if (config === undefined) {
      config = {
        method: "DELETE",
      };
    } else {
      config.method = "DELETE";
    }
    return fetch(this.handleUrl(url, version), {
      ...this.defaultConfig,
      ...config,
    });
  };

  protected static sendPostRequest = (
    url: string,
    data?: any,
    version = "",
    config?: RequestInit,
  ): Promise<Response> => {
    if (config === undefined) {
      config = {
        method: "POST",
      };
    } else {
      config.method = "POST";
    }
    console.log(data);
    config.body = JSON.stringify(data);
    return fetch(this.handleUrl(url, version), {
      ...this.defaultConfig,
      ...config,
    });
  };

  protected static sendPutRequest = (
    url: string,
    data?: any,
    version = "",
    config?: RequestInit,
  ): Promise<Response> => {
    if (config === undefined) {
      config = {
        method: "PUT",
      };
    } else {
      config.method = "PUT";
    }
    config.body = JSON.stringify(data);
    return fetch(this.handleUrl(url, version), {
      ...this.defaultConfig,
      ...config,
    });
  };
}
