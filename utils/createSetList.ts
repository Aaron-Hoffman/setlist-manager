import { sampleSize } from "lodash";
import { Song } from "@prisma/client";

const createSetList = (repertoire: Song[], numberOfSongs: number = 1) => {
    return sampleSize(repertoire, numberOfSongs);
}

export default createSetList;