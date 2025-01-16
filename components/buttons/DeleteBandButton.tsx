'use client'

import { deleteBand } from "@/utils/serverActions"

export type DeleteBandButtonProps = {
    id: number
}

const DeleteBandButton = ({id}: DeleteBandButtonProps) => {
    return (
        <button className="border-slate-400 border-2 p-2 cursor-pointer rounded" onClick={e => deleteBand(id)}>X</button>
    )
}

export default DeleteBandButton;