import { BackendResponseType } from "types/types";
import { callBackendDeleteApi, callBackendGetApi, callBackendPatchApi, callBackendPostApi } from "./callApi";

export type CenterListItem = {
    _id?: string;
    centerName: string;
    libraries: string[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export async function listCenters(params: Record<string, any> = {}): Promise<CenterListItem[]> {
    const list: CenterListItem[] = await callBackendGetApi("scanningCenter/getCenters", params);
    return Array.isArray(list) ? list : [];
}

export async function addCenterToBackend(payload: { centerName: string; libraries: string[]; superadmin_user: string; superadmin_password: string; }): Promise<BackendResponseType> {
    const resp = await callBackendPostApi("scanningCenter/addCenter", payload);
    try {
        const json = await resp.json();
        return json;
    } catch {
        return { success: "ok" };
    }
}

export async function editCenterInBackend(centerId: string, payload: { centerName?: string; libraries?: string[]; superadmin_user: string; superadmin_password: string; }): Promise<BackendResponseType> {
    const resp = await callBackendPatchApi(`scanningCenter/centers/${encodeURIComponent(centerId)}`, payload);
    try {
        const json = await resp.json();
        return json;
    } catch {
        return { success: "ok" };
    }
}

export async function deleteCenterFromBackend(payload: { centerId: string; superadmin_user: string; superadmin_password: string; }): Promise<BackendResponseType> {
    const resp = await callBackendPostApi("scanningCenter/deleteCenter", payload);
    try {
        const json = await resp.json();
        return json;
    } catch {
        return { success: "ok" };
    }
}
