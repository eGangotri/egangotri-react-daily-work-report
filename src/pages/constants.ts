export const OTHERS = "Other";

export const appendOthersItemToList = (list:string[]) => {
    list.push(OTHERS);
    return list;
}

export const centers = appendOthersItemToList(["Choose Center", "Delhi", "Haridwar", "Jammu", "Srinagar", "Varanasi"]);

export const libraryMenuOptions = [
    {
        name: centers[0],
        centers: ["Choose Library"],
    },
    {
        name: centers[1],
        centers: appendOthersItemToList(["SV Shastri","CSU", "Sarai"]),
    },
    {
        name: centers[2],
        centers: appendOthersItemToList(["Gurukul-Kangri"]),
    },
    {
        name: centers[3],
        centers: appendOthersItemToList(["BVT-Lucknow"]),
    },
    {
        name: centers[4],
        centers: appendOthersItemToList(["SPS", "JKACADEMY", "Lucknow"]),
    },
    {
        name: centers[5],
        centers: appendOthersItemToList([
            "Vasishth Tripathi",
            "Jangam",
            "Kamalakarji",
            "Panini",
        ]),
    },
    {
        name: centers[6],
        centers: appendOthersItemToList([]),
    },
];

export const panelOneCSS = { bgcolor: "white", paddingRight: "10px" };

const treasureIndices = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,55,56,57,58,59]

export const catalogProfiles = appendOthersItemToList(["Choose Profile", 
...(treasureIndices.map(x=>`Treasures-${x}`))]);

