import { AddDailyReportResponseType, DailyWorkReportType } from "types/dailyWorkReportTypes"
import { callBackendPostApi } from "./callApi";


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

