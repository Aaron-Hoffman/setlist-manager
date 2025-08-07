import { BandWithRelations } from "@/types/next-auth";
import { forEach } from "lodash"

const getBandFilters = (band: BandWithRelations) => {
    const usedKeys: string[] = [];
    const usedTags: string[] = [];

    forEach(band.songs, song => {
        if (!usedKeys.includes(song.key)) {
            usedKeys.push(song.key)
        }
        if (song.tags) {
            forEach(song.tags as string[], tag => {
                if (!usedTags.includes(tag)) {
                    usedTags.push(tag)
                }
            })

        }
    })

    return {keys: usedKeys, tags: usedTags}
}

export default getBandFilters;