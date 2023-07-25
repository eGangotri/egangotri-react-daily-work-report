import { CatalogWorkReportType } from "mirror/catalogWorkReportTypes";
import { AddDailyReportResponseType } from "types/dailyWorkReportTypes";
import { callBackendPostApi } from "./callApi";

export async function pushCatReportToServer(dailyReport: CatalogWorkReportType, password: string): Promise<AddDailyReportResponseType> {
    const _reportBody = {
        ...dailyReport,
        password
        //remove this line later
        ,title:"..."
    }
    const resp = await callBackendPostApi("dailyCatWorkReport/add", _reportBody);
    console.log(`res ${JSON.stringify(resp)}`)
    const respAsJson = await resp.json()
    console.log(`respAsJson ${JSON.stringify(respAsJson)}`)
    return respAsJson
}
