import { AddDailyReportResponseType, DailyWorkReportType, LoginProps, LoginUser } from "types/dailyWorkReportTypes"
import { callBackendGetApiForBlob, callBackendPostApi } from "./callApi";


const backEndPathForMetadataScanners = "dailyWorkReport/csvAsFile";
const backEndPathForMetadataCatalogers = "dailyCatWorkReport/csvAsFile";

export async function sendFilteredFormToServerGetForBasicUser(operator: string,
    selectedStartDate: string | null,
    selectedEndDate: string | null,
    aggregations: boolean = false,
    password: string | null,
    forCatalog: boolean = false,
) {
    return sendFilteredFormToServerGet(operator, "", selectedStartDate, selectedEndDate, aggregations, password, forCatalog)
}

export async function sendFilteredFormToServerGet(operators: string,
    centers: string,
    selectedStartDate: string | null,
    selectedEndDate: string | null,
    aggregations: boolean = false,
    password: string | null,
    forCatalog: boolean = false
) {
    const params = {
        operatorName: operators,
        centers,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        password
    }
    const resp = await callBackendGetApiForBlob(forCatalog ?
        `${backEndPathForMetadataCatalogers}?aggregations=${aggregations}` :
        `${backEndPathForMetadataScanners}?aggregations=${aggregations}`
        ,
        params);
    console.log(`res ${JSON.stringify(resp)}`);
    return resp;
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

export async function sendFilteredFormToServerPost(operators: string,
    centers: string,
    selectedStartDate: Date | null,
    selectedEndDate: Date | null,
    password: string | null,
) {

    const _reportBody = {
        operators,
        centers,
        selectedStartDate,
        selectedEndDate,
        password
    }

    const resp = await callBackendPostApi("dailyWorkReport/csvAsFile", _reportBody);
    console.log(`res ${JSON.stringify(resp)}`)
    const respAsJson = await resp.json()
    console.log(`respAsJson ${JSON.stringify(respAsJson)}`)
    return respAsJson
}

export async function checkValidCredentials(staffName: string, password: string): Promise<LoginProps> {
    const loginInfo = {
        username: staffName,
        password: password
    } as LoginUser;


    const options: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
    }

    const res = await callBackendPostApi("user/checkValidCredentials", loginInfo)
    const items = await res.json()
    console.log(`checkValidCredentials:res ${JSON.stringify(items)}`)
    return {
        username: staffName,
        password,
        ...items
    }
}
