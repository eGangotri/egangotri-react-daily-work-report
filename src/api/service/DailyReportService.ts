import { AddDailyReportResponseType, DailyWorkReportType, LoginProps, LoginUser } from "types/dailyyWorkReportTypes"
import { callBackendGetApi, callBackendGetApiForBlob, callBackendPostApi } from "./callApi";
import { backendServer } from "api/constants";


  
export async function sendFilteredFormToServerGet(operators:string,centers:string, selectedStartDate:Date|null, selectedEndDate:Date|null) {
  
    const params = {
      operators,
      centers,
      selectedStartDate,
      selectedEndDate
    }
  
    const resp = await callBackendGetApiForBlob("dailyWorkReport/csvAsFile", params);
    console.log(`res ${JSON.stringify(resp)}`)
    return resp
  }
  

export async function pushReportToServer(dailyReport: DailyWorkReportType, password: string): Promise<AddDailyReportResponseType> {

    const _reportBody = {
      ...dailyReport,
      password
    }
  
    const resp = await callBackendPostApi("dailyWorkReport/add", _reportBody);
    console.log(`res ${JSON.stringify(resp)}`)
    const respAsJson = await resp.json()
    console.log(`respAsJson ${JSON.stringify(respAsJson)}`)
    return respAsJson
  }
  
  export async function sendFilteredFormToServerPost(operators:string,centers:string, selectedStartDate:Date|null, selectedEndDate:Date|null) {
  
    const _reportBody = {
      operators,
      centers,
      selectedStartDate,
      selectedEndDate
    }
  
    const resp = await callBackendPostApi("dailyWorkReport/csvAsFile", _reportBody);
    console.log(`res ${JSON.stringify(resp)}`)
    const respAsJson = await resp.json()
    console.log(`respAsJson ${JSON.stringify(respAsJson)}`)
    return respAsJson
  }
  
  export async function checkValidCredentials(staffName: string, password: string):Promise<LoginProps> {
    const loginInfo = {
      username: staffName,
      password: password
    } as LoginUser;
  
    const _url = `${backendServer}user/checkValidCredentials`
    console.log(`_url ${_url}`)
  
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginInfo),
    }
  
    const res = await fetch(_url, options)
    //shall be  {"response":false} or {"response":true}
    const items = await res.json()
    console.log(`checkValidCredentials:res ${JSON.stringify(items)}`)
    return items
  }
  