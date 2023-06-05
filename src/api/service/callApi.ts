import { backendServer } from "api/constants"
import { AddDailyReportResponseType, DailyWorkReportType, LoginProps, LoginUser } from "types/dailyyWorkReportTypes"

export const callBackendGetApiForBlob = async (route: string, params: any): Promise<void> => {
  try {

    const _url = new URL(`${backendServer}${route}`)
    console.log(`_url ${_url}`)

    Object.keys(params).forEach(key => _url.searchParams.append(key, params[key]));

    const resp = await fetch(_url, {
      method: 'GET',
      // responseType: 'blob' // Set the response type to blob
    });

    if (resp.ok) {
      const fileBlob = await resp.blob();
      const url = URL.createObjectURL(fileBlob);
      window.open(url, '_blank');
    } else {
      console.log('Error fetching file:', resp.status);
    }
  } catch (error) {
    console.log('Error fetching file:', error);
  }
};;

export const callBackendGetApi = async (route: string, params: any) => {
  const _url = new URL(`${backendServer}${route}`)
  console.log(`_url ${_url}`)

  Object.keys(params).forEach(key => _url.searchParams.append(key, params[key]));

  const resp = await fetch(_url)
  return resp;
}


export const callBackendPostApi = async (route: string, _jsonBody: {}) => {
  const _url = `${backendServer}${route}`
  console.log(`_url ${_url}`)

  const options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_jsonBody)
  }
  const resp = await fetch(_url, options)

  return resp;
}
