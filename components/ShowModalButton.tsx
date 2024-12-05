'use client'

export type ShowModalButtonProps = {
    show: boolean,
    clickHandler: Function,
    label: string,
    table: boolean
}

const ShowModalButton = ({show, clickHandler, label, table}: ShowModalButtonProps) => {
    return (
        <>
            {table && <td className="border-slate-400 border-2 p-2 cursor-pointer" onClick={e => clickHandler(!show)}>Edit</td>}
            {!table && <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" onClick={e => clickHandler(!show)}>{label}</button>}
        </>
    )
}

export default ShowModalButton;