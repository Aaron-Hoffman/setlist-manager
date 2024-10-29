'use client'

import { deleteSetList } from "@/utils/serverActions"

export type DeleteSetListButtonProps = {
    id: number,
}

const DeleteSetListButton = ({id}: DeleteSetListButtonProps) => {
    return (
        <button className="border-slate-400 border-2 p-2 cursor-pointer rounded" onClick={e => deleteSetList(id)}>X</button>
    )
}

export default DeleteSetListButton;