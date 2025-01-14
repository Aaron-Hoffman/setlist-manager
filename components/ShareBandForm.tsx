'use client'

import { Band } from '@prisma/client';
import { shareBand } from '@/utils/serverActions';
import Modal from './Modal';
import { useState } from 'react';
import ShowModalButton from './ShowModalButton';

export type ShareBandFormProps = {
    band: Band
}

const ShareBandForm = ({band}: ShareBandFormProps) => {
    const [ showModal, setShowModal ] = useState(false)
    const handleSubmit = (formData: FormData) => {
        shareBand(band.id, formData)
        setShowModal(false)
    }

    return (
        <>
            <ShowModalButton clickHandler={setShowModal} show={showModal} label="Share Band" table={false}/>
            <Modal show={showModal}>
                <div className="flex flex-col bg-white border-black border-2 p-5 rounded">
                    <h2 className="text-center text-2xl pb-5">Share Band</h2>
                    <form action={handleSubmit} className="flex flex-col p-5 border-slate-400 border-2 ">
                        <div className="p-5">
                            <label htmlFor="email" className="pr-3">Please enter the email of the user you want to share with:</label>
                            <input type="email" name="email" id="email" placeholder="Email here..." className="rounded p-2 "/>
                        </div>
                        <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Share Band</button>
                        <button className="p-5 mt-5 bg-red-400 rounded font-bold text-lg" onClick={() => setShowModal(false)} type="button">Cancel</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default ShareBandForm;