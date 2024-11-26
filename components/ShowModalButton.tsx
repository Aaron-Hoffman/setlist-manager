'use client'

export type ShowModalButtonProps = {
    show: boolean,
    clickHandler: Function,
    label: string
}

const ShowModalButton = ({show, clickHandler, label}: ShowModalButtonProps) => {
    return (
        <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" onClick={e => clickHandler(!show)}>{label}</button>
    )
}

export default ShowModalButton;