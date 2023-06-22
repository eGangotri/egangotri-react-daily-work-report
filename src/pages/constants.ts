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
        centers: appendOthersItemToList(["CSU", "Sarai"]),
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
        centers: appendOthersItemToList(["SPS", "JKACADEMY"]),
    },
    {
        name: centers[5],
        centers: appendOthersItemToList([
            "Vasishth Tripathi",
            "Jangam",
            "Kamalakarji",
            "Mumukshu",
            "Ved Nidhi",
        ]),
    },
    {
        name: centers[6],
        centers: appendOthersItemToList([]),
    },
];

export const panelOneCSS = { bgcolor: "white", paddingRight: "10px" };

export const BASIC_ROLE = "Basic";
export const ADMIN_ROLE = "Admin";
export const CATALOGER_ROLE = "Cataloger";
export const SUPERADMIN_ROLE = "Superadmin";

export const catalogProfiles = appendOthersItemToList(["Choose Profile", "Treasures-1", "Treasures-2", "Treasures-4", "Treasures-5", "Treasures-6"]);

