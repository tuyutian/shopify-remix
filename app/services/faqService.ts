import Service from "~/services/Service";
import {API_VERSION} from "~/types/api";

export default class FaqService extends Service{
  static async search(keyword:string){
    return this.sendGetRequest(`faq/search?keyword=${keyword}`,API_VERSION.NONE).then((res) => {
      return res.json();
    });
  }
  static async  updatePopularity($keyword:number, $id:number, $helpful:{yes:number,no:number}){
    return this.sendPostRequest(`faq/popularity`,{id:$id,helpful:$helpful,keyword:$keyword},API_VERSION.NONE).then((res) => {
      return res.json();
    });
  }
}
