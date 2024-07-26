export default class Service {

  protected static base_api_url: string = process.env.API_BASE_URL || "https://tms.trackingmore.net/api";
  protected static api_version: string = process.env.API_VERSION || "v1";
  private static defaultConfig:RequestInit = {
    headers:{
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  }
  private static handleUrl(url:string,version: string = ""):string {
    if (url.startsWith("http")) {
      return url;
    }
    if (version === "") {
      version = this.api_version;
    }
    return `${this.base_api_url}/${version}/${url}`;
  }

  public static sendGetRequest = (url: string, version: string = "", config?: RequestInit): Promise<Response> => {
    return fetch(this.handleUrl(url,version), {...this.defaultConfig,...config});
  };

  protected static sendDeleteRequest = (url: string, version = "", config?: RequestInit): Promise<Response> => {
    if (config === undefined) {
      config = {
        method: "DELETE",
      };
    } else {
      config.method = "DELETE";
    }
    return fetch(this.handleUrl(url,version), {...this.defaultConfig,...config});
  };

  protected static sendPostRequest = (url: string, data?: any, version = "", config?: RequestInit): Promise<Response> => {
    if (config === undefined) {
      config = {
        method: "POST",
      };
    } else {
      config.method = "POST";
    }
    console.log(data);
    config.body = JSON.stringify(data);
    return fetch(this.handleUrl(url,version), {...this.defaultConfig,...config});
  };

  protected static sendPutRequest = (url: string, data?: any, version = "", config?: RequestInit): Promise<Response> => {
    if (config === undefined) {
      config = {
        method: "PUT",
      };
    } else {
      config.method = "PUT";
    }
    config.body = JSON.stringify(data);
    return fetch(this.handleUrl(url,version), {...this.defaultConfig,...config});
  };
}
