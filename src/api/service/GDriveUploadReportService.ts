import { AddDailyReportResponseType } from "types/dailyWorkReportTypes"
import { callBackendPostApi } from "./callApi";
import { GDriveUploadWorkReportType } from "mirror/types";

export async function pushGDriveReportToServer(gdriveUploadReport: GDriveUploadWorkReportType, password: string): Promise<AddDailyReportResponseType> {
    const _reportBody = {
        ...gdriveUploadReport,
        password
    }

    const resp = await callBackendPostApi("dailyGDriveUploadWorkReport/add", _reportBody);
    console.log(`res ${JSON.stringify(resp)}`)
    const respAsJson = await resp.json()
    console.log(`respAsJson ${JSON.stringify(respAsJson)}`)
    return respAsJson
}
