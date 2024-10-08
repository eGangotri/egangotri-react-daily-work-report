import * as _ from 'lodash';
import { getLibraryMenuUptopns, getScanningCenters } from 'service/CentersService';
const OTHERS = "Other";

const appendOthersItemToList = (list: string[]) => {
    list.push(OTHERS);
    return list;
}

export const scanCenters = await getScanningCenters()

export const libraryMenuOptions =  await getLibraryMenuUptopns()

export const panelOneCSS = { bgcolor: "beige", paddingRight: "10px" };


const range = _.range(1, 75);

export const catalogProfiles = appendOthersItemToList(["Choose Profile",
    ...(range.map(x => `Treasures-${x}`))]);

