import { AllCatalogReportStatsInterface } from "types/catalogWorkReportTypes";
import { AddDailyReportResponseType } from "types/dailyWorkReportTypes";
import { callBackendPostApi } from "./callApi";

export async function pushCatReportToServer(dailyReport: AllCatalogReportStatsInterface, password: string): Promise<AddDailyReportResponseType> {
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