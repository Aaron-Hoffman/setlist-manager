'use client'

export type ShowModalButtonProps = {
    show: boolean,
    clickHandler: Function
}

const ShowModalButton = ({show, clickHandler}: ShowModalButtonProps) => {
    return (
        <button onClick={e => clickHandler(!show)}>Add Band</button>
    )
}

export default ShowModalButton;