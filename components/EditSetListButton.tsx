'use client'

import { SetList, Song } from "@prisma/client"
import { editSetList } from "@/utils/serverActions"

export type EditSetListButtonProps = {
    song: Song,
    add: boolean,
    setList: SetList
}

const EditSetListButton = ({song, add, setList}: EditSetListButtonProps) => {
    return (
        <td className="border-slate-400 border-2 p-2 cursor-pointer" onClick={e => editSetList(setList, song, add)}>{add ? "Add" : "Remove"}</td>
    )
}

export default EditSetListButton;