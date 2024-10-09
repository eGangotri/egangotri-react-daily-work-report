import { callBackendGetApi } from "api/service/callApi"
import { ScanningCenterType } from "types/types";
import * as _ from 'lodash';

const OTHERS = "Other";
const CHOOSE_CENTER = "Choose Center";
const CHOOSE_LIBRARY = "Choose Library";

let cachedCentersData: any = [];

const getCentersAndLibrariesViaApi = async () => {
    const centersData = await callBackendGetApi('scanningCenter/getCenters', {})
    console.log(`centersData ${JSON.stringify(centersData)}`)
    return centersData;
}

export const getCentersAndLibraries = async ():Promise<ScanningCenterType[]> => {
    if (cachedCentersData?.length > 0) {
        return cachedCentersData;
    }
    const _response = await getCentersAndLibrariesViaApi();
    cachedCentersData =  [{
        centerName: CHOOSE_CENTER,
        libraries: [CHOOSE_LIBRARY]
    },
    ..._response,
    { centerName: OTHERS, libraries: [] }];
    console.log('Returning cached centers data', JSON.stringify(cachedCentersData));
    return cachedCentersData;
};

export const getScanningCenters = async ():Promise<string[]> => {
    const centersData = await getCentersAndLibraries();
    return centersData.map((center: any) => center.centerName);
}

export const getLibraryMenuOptions = async ():Promise<ScanningCenterType[]> => {
    const centersData:ScanningCenterType[] = await getCentersAndLibraries();
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

export const SCAN_CENTERS: string[] = await getScanningCenters()

export const LIBRARY_MENU_OPTIONS = await getLibraryMenuOptions()

export const panelOneCSS = { bgcolor: "beige", paddingRight: "10px" };

const range = _.range(1, 75);

export const catalogProfiles = appendOthersItemToList(["Choose Profile",
    ...(range.map(x => `Treasures-${x}`))]);


export const getLibrariesInCenter = (center: string = ""): string[] => {
    const obj = LIBRARY_MENU_OPTIONS.find((o: ScanningCenterType) => o.centerName === (center));
    const _libraries = obj?.libraries || [];
    return _libraries;
};


