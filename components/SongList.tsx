import DeleteSongButton from "./DeleteSongButton";
import { Song } from "@prisma/client";

export type SongListProps = {
    songList: Song[]
}

const SongList = ({songList}: SongListProps) => {
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
                            </tr>
                        )}
                    )}
                </tbody>
            </table>
        </ div>
    )
}

export default SongList;