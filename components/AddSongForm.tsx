'use client'

import KEYS from "@/constants/KEYS";
import { addSong } from "@/utils/serverActions";
import Modal from './Modal';
import { useState, useRef } from 'react';
import ShowModalButton from './ShowModalButton';

export type AddSongFormProps = {
    bandId: number,
}

const AddSongForm = ({bandId}: AddSongFormProps) => {
    const [ showModal, setShowModal ] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = (formData: FormData) => {
        addSong(bandId, formData)
        setShowModal(false)
        formRef.current?.reset()
    }

    return (
        <div className="mt-7 mr-12">
            <ShowModalButton clickHandler={setShowModal} show={showModal} label="Add Song" table={false}/>
            <Modal show={showModal}>
                <div className="flex flex-col bg-white border-black border-2 p-5 rounded">
                    <h2 className="text-center text-2xl pb-5">Add A Song</h2>
                    <form ref={formRef} action={handleSubmit} className="flex flex-col p-5 border-slate-400 border-2">
                        <div className="p-5">
                            <label htmlFor="title" className="pr-3">Title:</label>
                            <input type="text" name="title" id="title" placeholder="Song title here..." className="rounded p-2 "/>
                        </div>
                        <div className="p-5">
                            <label htmlFor="key" className="pr-3">Key:</label>
                            <select name="key" id="key" className="rounded p-2 ">
                                {KEYS.map(key => <option value={key.label} key={key.value}>{key.label}</option>)}
                            </select>
                        </div>
                        <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Add Song</button>
                        <button className="p-5 mt-5 bg-red-400 rounded font-bold text-lg" onClick={() => setShowModal(false)} type="button">Cancel</button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default AddSongForm;