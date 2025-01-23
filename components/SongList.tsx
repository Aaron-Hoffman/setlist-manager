import { SetList, Song } from "@prisma/client";
import SongCell from "./SongCell";
import orderSetForDisplay from "@/utils/orderSetForDisplay";
import prisma from "@/utils/db";

export type SongListProps = {
    songList: Song[],
    add?: boolean,
    setList?: SetList,

}

const SongList = async ({songList, add, setList}: SongListProps) => {
    const setListWithOrder = setList ? await prisma.setList.findUnique({
        where: {
            id: setList.id,
        },
        include: {
            order: true
        }
    }) : undefined;

    const order = setListWithOrder ? setListWithOrder.order : undefined;

    const orderedSongList = orderSetForDisplay(songList, order)

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
                    {songList && orderedSongList.map((song: Song, index) => {
                        return (
                            <SongCell song={song} setList={setList} add={add} index={index} key={song.id}/>
                        )}
                    )}
                </tbody>
            </table>
        </ div>
    )
}

export default SongList;