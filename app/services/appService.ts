import Service from "~/services/Service";

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
    return this.sendGetRequest("auth/callback?"+param.toString()).then((res) => {
      return res.json();
    });
  }

  static async saveUser(session_id:string){
    return this.sendGetRequest("session/install/"+session_id).then((res) => {
      return res.json();
    });
  }
}
