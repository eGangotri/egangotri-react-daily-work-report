import { callBackendGetApi } from "api/service/callApi"
import { ScanningCenterType } from "types/types";
import * as _ from 'lodash';

const OTHERS = "Other";
export const CHOOSE_CENTER = "Choose Center";
const CHOOSE_LIBRARY = "Choose Library";

let CENTERS_DATA_AS_CACHE: ScanningCenterType[] = [];

export let SCAN_CENTERS: string[] = []

export let LIBRARY_MENU_OPTIONS: ScanningCenterType[] = [];

const getCentersAndLibrariesViaApi = async () => {
    const centersData = await callBackendGetApi('scanningCenter/getCenters', {})
    return centersData;
}

export const getCentersAndLibraries = async (): Promise<ScanningCenterType[]> => {

    if (CENTERS_DATA_AS_CACHE?.length > 0) {
        return CENTERS_DATA_AS_CACHE
    }
    localStorage.clear();
    const _cache = localStorage.getItem('CENTERS_DATA_AS_CACHE');
    if (_cache) {
        CENTERS_DATA_AS_CACHE = JSON.parse(_cache);
        SCAN_CENTERS = await getScanningCenters();
        LIBRARY_MENU_OPTIONS = await getLibraryMenuOptions();
        return CENTERS_DATA_AS_CACHE
    }

    const _response = await getCentersAndLibrariesViaApi();
    CENTERS_DATA_AS_CACHE = [{
        centerName: CHOOSE_CENTER,
        libraries: [CHOOSE_LIBRARY]
    },
    ..._response,
    { centerName: OTHERS, libraries: [] }];

    SCAN_CENTERS = await getScanningCenters();
    LIBRARY_MENU_OPTIONS = await getLibraryMenuOptions();
    localStorage.setItem('scanCenters', JSON.stringify(SCAN_CENTERS));
    localStorage.setItem('libraryMenuOptions', JSON.stringify(LIBRARY_MENU_OPTIONS));
    localStorage.setItem('CENTERS_DATA_AS_CACHE', JSON.stringify(CENTERS_DATA_AS_CACHE));
    return CENTERS_DATA_AS_CACHE;
};


export const getScanningCenters = async (): Promise<string[]> => {
    const scanCenters = localStorage.getItem('scanCenters');
    if (scanCenters) {
        return JSON.parse(scanCenters);
    }
    const centersData = await getCentersAndLibraries();
    return centersData.map((center: any) => center.centerName) || [];
}

export const getLibraryMenuOptions = async (): Promise<ScanningCenterType[]> => {
    const libraryMenuOptions = localStorage.getItem('libraryMenuOptions');
    if (libraryMenuOptions) {
        return JSON.parse(libraryMenuOptions);
    }
    const centersData: ScanningCenterType[] = await getCentersAndLibraries();
    const menuOptions = centersData.map((center: any) => {
        return {
            centerName: center.centerName,
            libraries: [...center.libraries, OTHERS],
        }
    })
    return menuOptions;
}

const appendOthersItemToList = (list: string[]) => {
    list.push(OTHERS);
    return list;
}

export const panelOneCSS = "py-2";

const range = _.range(1, 75);

export const catalogProfiles = appendOthersItemToList(["Choose Profile",
    ...(range.map((x: number) => `Treasures-${x}`))]);


export const getLibrariesInCenter = (center: string = ""): string[] => {
    const obj = LIBRARY_MENU_OPTIONS.find((o: ScanningCenterType) => o.centerName === (center));
    const _libraries = obj?.libraries || [];
    return _libraries;
};


