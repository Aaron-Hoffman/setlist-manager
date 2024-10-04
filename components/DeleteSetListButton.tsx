'use client'

export type DeleteSetListButtonProps = {
    id: number,
    deleteSetListHandler: Function
}

const DeleteSetListButton = ({id, deleteSetListHandler}: DeleteSetListButtonProps) => {
    const deleteSetList = async () => {
        deleteSetListHandler(id)
    }

    return (
        <button className="border-slate-400 border-2 p-2 cursor-pointer rounded" onClick={deleteSetList}>X</button>
    )
}

export default DeleteSetListButton;