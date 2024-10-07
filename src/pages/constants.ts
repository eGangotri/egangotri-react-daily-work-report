import * as _ from 'lodash';
export const OTHERS = "Other";

export const appendOthersItemToList = (list:string[]) => {
    list.push(OTHERS);
    return list;
}

export const centers = appendOthersItemToList(["Choose Center", "Delhi", "Haridwar", "Jammu", "Srinagar", "Varanasi", "Lucknow"]);

export const libraryMenuOptions = [
    {
        name: centers[0],
        centers: ["Choose Library"],
    },
    {
        name: centers[1],
        centers: appendOthersItemToList(["SV Shastri","Sundaram", "CSU"]),
    },
    {
        name: centers[2],
        centers: appendOthersItemToList(["Gurukul-Kangri"]),
    },
    {
        name: centers[3],
        centers: appendOthersItemToList(["BVT-Lucknow", "Madras", "Chennai"]),
    },
    {
        name: centers[4],
        centers: appendOthersItemToList(["SPS", "JKACADEMY", "Lucknow-Books", "Noida-Books", "PZ"]),
    },
    {
        name: centers[5],
        centers: appendOthersItemToList([
            "Jangam",
            "Anandomayi",
        ]),
    },
    
    {
        name: centers[6],
        centers: appendOthersItemToList([
            "UP State Museum",
            "UPSS",
            "AkhilBh.Skt.Parishad",
            "Uni.Lucknow",
        ]),
    },
    {
        name: centers[7],
        centers: appendOthersItemToList([]),
    },
];

export const panelOneCSS = { bgcolor: "beige", paddingRight: "10px" };

const range = _.range(1, 63);

export const catalogProfiles = appendOthersItemToList(["Choose Profile", 
...(range.map(x=>`Treasures-${x}`))]);

