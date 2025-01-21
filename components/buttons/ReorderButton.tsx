'use client'

import { reorderSetList } from "@/utils/serverActions"
import { SetList } from "@prisma/client"

export type ReorderButtonProps = {
    setList: SetList,
    from: number,
}

const ReorderButton = ({setList, from}: ReorderButtonProps) => {
    const to = from + 1;

    return (
        <td className="border-slate-400 border-2 p-2 cursor-pointer" onClick={e => reorderSetList(setList, from, to)}>&#8595;</td>
    )
}

export default ReorderButton;