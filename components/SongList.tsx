import { SetList, Song } from "@prisma/client";
import SongCell from "./SongCell";

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
                            <SongCell song={song} setList={setList} add={add} key={song.id}/>
                        )}
                    )}
                </tbody>
            </table>
        </ div>
    )
}

export default SongList;