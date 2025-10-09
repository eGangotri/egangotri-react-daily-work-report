import { AddUserType, BackendResponseType } from "types/types";
import { callBackendDeleteApi, callBackendGetApi, callBackendPatchApi, callBackendPostApi } from "./callApi";

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

export type UserListItem = {
    _id?: string;
    username: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}

export async function listUsers(params: Partial<UserListItem> = {}): Promise<UserListItem[]> {
    const list: UserListItem[] = await callBackendGetApi("user/list", params);
    return Array.isArray(list) ? list : [];
}

export async function deleteUserFromBackend(payload: { username: string; superadmin_user: string; superadmin_password: string; }): Promise<BackendResponseType> {
    const resp = await callBackendDeleteApi("user/delete", payload);
    try {
        const json = await resp.json();
        return json;
    } catch {
        return { success: "ok" };
    }
}

export async function patchUserInBackend(username: string, body: { username?: string; role?: string; password?: string; superadmin_user: string; superadmin_password: string; }): Promise<BackendResponseType> {
    const resp = await callBackendPatchApi(`user/patch/${encodeURIComponent(username)}`, body);
    try {
        const json = await resp.json();
        return json;
    } catch {
        return { success: "ok" };
    }
}