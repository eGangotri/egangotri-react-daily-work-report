import { AddUserType, BackendResponseType } from "types/types";
import { callBackendPostApi } from "./callApi";

export async function addUserToBackend(dailyReport: AddUserType): Promise<BackendResponseType> {
    const _reportBody = {
        ...dailyReport,
    }

    const resp = await callBackendPostApi("user/add", _reportBody);
    console.log(`res ${JSON.stringify(resp)}`)
    const respAsJson = await resp.json()
    console.log(`respAsJson ${JSON.stringify(respAsJson)}`)
    return respAsJson
}