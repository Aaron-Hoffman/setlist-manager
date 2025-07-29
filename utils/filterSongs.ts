import { filter, isEmpty } from "lodash";

const filterSongs = (songs: Song[], filters: []) => {
    if (isEmpty(filters)) return songs;

    const filteredSongs = filter(songs, song => {
        return filters.every(filter => {
            if (filter.key === "tags") {
                if (!Array.isArray(song.tags)) return false;
                    return filter.value.every(tag => song.tags.includes(tag));
                } else {
                return song[filter.key] === filter.value;
            }
        })
    })

    return filteredSongs;
}

export default filterSongs;