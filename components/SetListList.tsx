import { SetListWithSongsAndBand } from "@/types/pdf";
import Link from "next/link";
import DeleteSetListButton from "@/components/buttons/DeleteSetListButton";
import ExportPDFButton from "./buttons/ExportPDFButton";
import SetlistInfo from "./SetlistInfo";

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
                        {/* Actions Section */}
                        <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
                            <span className="text-sm text-gray-500">{new Date(setList.createdAt).toLocaleDateString()}</span>
                            <ExportPDFButton setList={setList} className="w-full sm:w-auto" />
                            <DeleteSetListButton id={setList.id} className="w-full sm:w-auto" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default SetListList;