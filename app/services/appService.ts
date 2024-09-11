import Service from "~/services/Service";
import {API_VERSION} from "~/types/api";

export default class AppService extends Service{
  static async authorization(param:URLSearchParams){
    let jsonObject:any = {};
    for (let [key, value] of param.entries()) {
      jsonObject[key] = value;
    }
    return this.sendPostRequest("auth", jsonObject).then((res) => {
      return res.json();
    });
  }
  static async callback(param:URLSearchParams){
    return this.sendGetRequest(`auth/callback?${param.toString()}`).then((res) => {
      return res.json();
    });
  }

  static async saveUser(session_id:string){
    return this.sendGetRequest(`session/install/${session_id}`).then((res) => {
      return res.json();
    });
  }

  static async getOthers(accessToken:string|undefined) {
    console.log(accessToken);
    return await this.sendGetRequest("user_other",API_VERSION.V1,{headers:{
      Authorization:`Bearer ${accessToken}`,
      }}).then(res=>res.json())
  }
}
