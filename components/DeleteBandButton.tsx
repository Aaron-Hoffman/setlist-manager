'use client'

export type DeleteBandButtonProps = {
    id: number,
    deleteBandHandler: Function
}

const DeleteBandButton = ({id, deleteBandHandler}: DeleteBandButtonProps) => {
    const deleteBand = async () => {
        deleteBandHandler(id)
    }

    return (
        <button className="border-slate-400 border-2 p-2 cursor-pointer" onClick={deleteBand}>X</button>
    )
}

export default DeleteBandButton;