import { ReactNode } from 'react';

export type ModalProps = {
    show: boolean,
    children: ReactNode
}

const Modal = ({show, children}: ModalProps) => {
    return (
        <div className={`fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50 ${show ? '' : 'hidden'}`}>
            {children}
        </div>
    )
}

export default Modal;