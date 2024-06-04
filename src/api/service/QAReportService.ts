import { AddDailyReportResponseType } from "types/dailyWorkReportTypes"
import { callBackendPostApi } from "./callApi";
import { QAWorkReportType } from "mirror/qaWorkReportType";

export async function pushQAReportToServer(qaReport: QAWorkReportType, password: string): Promise<AddDailyReportResponseType> {
    const _reportBody = {
        ...qaReport,
        password
    }

    const resp = await callBackendPostApi("dailyQAWorkReport/add", _reportBody);
    console.log(`res ${JSON.stringify(resp)}`)
    const respAsJson = await resp.json()
    console.log(`respAsJson ${JSON.stringify(respAsJson)}`)
    return respAsJson
}
