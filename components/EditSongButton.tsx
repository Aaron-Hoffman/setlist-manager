'use client'

import { editSong } from "@/utils/serverActions"

export type EditSongButtonProps = {
    id: number,
}

const EditSongButton = ({id}: DeleteSongButtonProps) => {
    return (
        <td className="border-slate-400 border-2 p-2 cursor-pointer" onClick={e => editSong(id)}>Edit</td>
    )
}

export default EditSongButton;