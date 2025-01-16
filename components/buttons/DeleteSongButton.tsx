'use client'

import { deleteSong } from "@/utils/serverActions"

export type DeleteSongButtonProps = {
    id: number,
}

const DeleteSongButton = ({id}: DeleteSongButtonProps) => {
    return (
        <td className="border-slate-400 border-2 p-2 cursor-pointer" onClick={e => deleteSong(id)}>X</td>
    )
}

export default DeleteSongButton;