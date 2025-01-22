import { Song, SetListItem } from "@prisma/client";
import { forEach } from "lodash";
import prisma from "./db";

const createSetOrder = async (songs: Song[], setListId: number) => {
    forEach(songs, async (song, index) => {
        await prisma.setListItem.create({
            data: {
                songId: song.id,
                index: index,
                setListId: setListId
            }
        });
    })

    return
}

export default createSetOrder;