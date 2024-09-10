'use client'
import prisma from "@/utils/db";

const DeleteSongButton = ({id, deleteSongHandler}) => {
    const deleteSong = async () => {
        deleteSongHandler(id)
    }

    return (
        <td className="border-slate-400 border-2 p-2 cursor-pointer" onClick={deleteSong}>X</td>
    )
}

export default DeleteSongButton;