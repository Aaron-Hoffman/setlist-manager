import { SetListWithSongsAndBand } from "@/types/pdf";
import SetlistInfo from "./SetlistInfo";
import SetlistActions from "./SetlistActions";

// Extend the type to include sets for new structure
interface SetSong {
    id: number;
    songId: number;
    order: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    song: any;
}
export interface Set {
    id: number;
    setListId: number;
    name: string;
    order: number;
    setSongs: SetSong[];
    createdAt: string | Date;
    updatedAt: string | Date;
}

export type SetListWithSets = SetListWithSongsAndBand & { sets?: Set[] };

export type SetListListProps = {
    setListList: SetListWithSongsAndBand[],
    bandId: number
}

const SetListList = ({bandId, setListList}: { bandId: number, setListList: SetListWithSets[] }) => {
    return (
        <ul className="divide-y divide-gray-200">
            {setListList && setListList.map(setList => (
                <li key={setList.id} className="px-2 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex flex-col gap-2 items-center sm:flex-row sm:items-center sm:justify-between">
                        <SetlistInfo setlist={setList} bandId={bandId} />
                        <SetlistActions setlist={setList} />
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default SetListList;