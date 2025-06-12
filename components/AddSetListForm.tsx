'use client'

import { Song } from '@prisma/client';
import { addSetList } from '@/utils/serverActions';
import Modal from './Modal';
import { useState, useRef } from 'react';
import ShowModalButton from './ShowModalButton';

export type AddSetListFormProps = {
    bandId: number,
    songs: Song[]
}

const AddSetListForm = ({bandId, songs}: AddSetListFormProps) => {
    const [ showModal, setShowModal ] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = (formData: FormData) => {
        addSetList(bandId, songs, formData)
        setShowModal(false)
        formRef.current?.reset()
    }

    return (
        <>
            <ShowModalButton clickHandler={setShowModal} show={showModal} label="Create Set List" table={false}/>
            <Modal show={showModal}>
                <div className="flex flex-col bg-white border-black border-2 p-5 rounded">
                    <h2 className="text-center text-2xl pb-5">Create a Set List</h2>
                    <form ref={formRef} action={handleSubmit} className="flex flex-col p-5 border-slate-400 border-2">
                        <div className="p-5">
                            <label htmlFor="name" className="pr-3">Name:</label>
                            <input type="text" name="name" id="name" placeholder="Set list name here..." className="rounded p-2 "/>
                            <label htmlFor="number" className="pr-3">Number of songs:</label>
                            <input type="number" name="number" id="number" className="rounded p-2 "/>
                        </div>
                        <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Create Set List</button>
                        <button className="p-5 mt-5 bg-red-400 rounded font-bold text-lg" onClick={() => setShowModal(false)} type="button">Cancel</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default AddSetListForm;