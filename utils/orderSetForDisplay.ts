import { SetListItem, Song } from "@prisma/client";
import { forEach, find, sortBy, isEmpty } from "lodash";

const orderSetForDisplay = (songList: Song[], order: SetListItem[] | undefined): Song[] => {
    if (!order) return songList

    const orderedSongList: Song[] = [];
    const sortedOrder = sortBy(order, item => item.index)

    forEach(sortedOrder, setListItem => {
        const song = find(songList, song => song.id === setListItem.songId)

        if (!song) return
        
        orderedSongList.push(song)
    })

    if (isEmpty(orderedSongList)) return songList;

    return orderedSongList;
}

export default orderSetForDisplay;