import DeleteSongButton from "./buttons/DeleteSongButton";
import EditSetListButton from "./buttons/EditSetListButton";
import ReorderButton from "./buttons/ReorderButton";
import EditSongForm from "./forms/EditSongForm";
import { SetList, Song } from "@prisma/client";

export type SongCellProps = {
    song: Song,
    add?: boolean,
    setList?: SetList,
    index: number
}

const SongCell = ({add, setList, song, index}: SongCellProps) => {  
    return (
        <tr key={song.id}>
            <td className="border-slate-400 border-2 p-2">{song.title}</td>
            <td className="border-slate-400 border-2 p-2">{song.key}</td>
            {!setList && <DeleteSongButton id={song.id} />}
            {!setList && <EditSongForm song={song} />}
            {setList && <EditSetListButton song={song} add={add || false} setList={setList} />}
            {setList && <ReorderButton setList={setList} from={index} />}
        </tr>
    )
}

export default SongCell;