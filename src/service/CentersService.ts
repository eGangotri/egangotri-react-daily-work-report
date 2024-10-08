import { callBackendGetApi } from "api/service/callApi"
const OTHERS = "Other";
const CHOOSE_CENTER = "Choose Center";
const CHOOSE_LIBRARY = "Choose Library";

const getCentersAndLibrariesViaApi = async () => {
    const centersData = await callBackendGetApi('scanningCenter/getCenters', {})
    console.log(`centersData ${JSON.stringify(centersData)}`)
    return centersData;
}

let cachedCentersData: any = [];

export const getCentersAndLibraries = async () => {
    if (cachedCentersData?.length > 0) {
        console.log('Returning cached centers data', JSON.stringify(cachedCentersData));
        return cachedCentersData;
    }
    const _response = await getCentersAndLibrariesViaApi();
    cachedCentersData =  [{
        centerName: CHOOSE_CENTER,
        libraries: [CHOOSE_LIBRARY]
    },
    ..._response,
    { centerName: OTHERS, libraries: [OTHERS] }];
    return cachedCentersData;
};

export const getScanningCenters = async () => {
    const centersData = await getCentersAndLibraries();
    return centersData.map((center: any) => center.centerName);
}

export const getLibraryMenuUptopns = async () => {
    const centersData = await getCentersAndLibraries();
    const menuOptions = centersData.map((center: any) => {
        return {
            name: center.centerName,
            centers: [...center.libraries, OTHERS],
        }
    })
    return menuOptions;
}
