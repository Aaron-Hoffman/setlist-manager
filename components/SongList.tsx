import DeleteSongButton from "./DeleteSongButton";
import prisma from "@/utils/db";
import { Song } from "@prisma/client";
import { revalidatePath } from 'next/cache'

export type SongListProps = {
    songList: Song[]
}

const SongList = ({songList}: SongListProps) => {
    const deleteSong = async (id: number) => {
        'use server'
        await prisma.song.delete({
            where: {
              id: id,
            },
        })
        revalidatePath('/')
    }

    return (
        <div className="flex flex-col w-1/3">
            <h2 className="text-center text-2xl pb-5">Songs</h2>
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
                                <DeleteSongButton id={song.id} deleteSongHandler={deleteSong}/>
                            </tr>
                        )}
                    )}
                </tbody>
            </table>
        </ div>
    )
}

export default SongList;