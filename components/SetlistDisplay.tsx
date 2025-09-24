import AddSongToSetDropdown from "@/components/forms/AddSongToSetDropdown";
import SongList from "@/components/SongList";
import { Song } from "@prisma/client";
import { SetListWithBandAndSets } from "@/types/setlist";

export type SetlistDisplayProps = {
    setList: SetListWithBandAndSets,
    songsNotInSetlist: Song[],
    bandId: number
}

const SetlistDisplay = ({setList, songsNotInSetlist, bandId}: SetlistDisplayProps) => {
    return (
        <div className="bg-white shadow rounded-lg order-1 lg:order-2">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Set List</h3>
            </div>
            <div className="border-t border-gray-200">
                {setList.sets?.map(set => (
                    <div key={set.id} className="mb-8">
                        <div className="flex items-center">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 mt-6 ml-4">{set.name}</h4>
                            {/* Add button for adding repertoire songs to this set */}
                            <AddSongToSetDropdown setId={set.id} repertoire={songsNotInSetlist} />
                        </div>
                        <SongList 
                            songList={set.setSongs.map(s => ({
                                ...s.song,
                                id: s.song.id,
                                createdAt: new Date(s.song.createdAt),
                                updatedAt: new Date(s.song.updatedAt),
                            }))}
                            add={false}
                            setId={set.id}
                            bandId={bandId}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SetlistDisplay;