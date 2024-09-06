'use client'
import Song from "@/types/Song";
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient();

const DeleteSongButton = ({id, deleteSongHandler}) => {
    const deleteSong = async (id) => {
        console.log(id)
        deleteSongHandler(id)
    }

    return (
        <td className="border-slate-400 border-2 p-2 cursor-pointer" onClick={() => deleteSong(id)}>X</td>
    )
}

export default DeleteSongButton;