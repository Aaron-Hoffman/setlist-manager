import DeleteSongButton from "./DeleteSongButton";
import EditSetListButton from "./EditSetListButton";
import EditSongForm from "./EditSongForm";
import { SetList, Song } from "@prisma/client";

export type SongListProps = {
    songList: Song[],
    add?: boolean,
    setList?: SetList
}

const SongList = ({songList, add, setList}: SongListProps) => {
    return (
        <div className="flex flex-col">
            <table className="border-slate-400 border-2">
                <thead>
                    <tr>
                        <th className="border-slate-400 border-2 p-2" >Title</th>
                        <th className="border-slate-400 border-2 p-2">Key</th>
                    </tr>
                </thead>
                <tbody>
                    {songList && songList.map((song: Song) => {
                        return (
                            <tr key={song.id}>
                                <td className="border-slate-400 border-2 p-2">{song.title}</td>
                                <td className="border-slate-400 border-2 p-2">{song.key}</td>
                                <DeleteSongButton id={song.id} />
                                <EditSongForm song={song} />
                                {setList && <EditSetListButton song={song} add={add || false} setList={setList} />}
                            </tr>
                        )}
                    )}
                </tbody>
            </table>
        </ div>
    )
}

export default SongList;