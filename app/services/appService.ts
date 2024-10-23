import Service from "~/services/Service";
import {API_VERSION} from "~/types/api";
import {generateToken} from "~/utils/jwt";
import type { JwtPayload} from '@shopify/shopify-api';
export default class AppService extends Service{
  static async authorization(param:URLSearchParams){
    const jsonObject:any = {};
    for (const [key, value] of param.entries()) {
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

  static async getOthers(payload:JwtPayload):Promise<any> {
    return await this.sendGetRequest("user_other",API_VERSION.V1,{headers:{
      Authorization:`Bearer ${generateToken(payload)}`,
      }}).then(res=>res.json())
  }
}
