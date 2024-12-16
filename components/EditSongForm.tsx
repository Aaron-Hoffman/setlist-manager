'use client'

import KEYS from "@/constants/KEYS";
import { editSong } from "@/utils/serverActions";
import Modal from './Modal';
import { ChangeEvent, useState } from 'react';
import ShowModalButton from './ShowModalButton';
import { Song } from "@prisma/client";

export type EditSongFormProps = {
    song: Song,
}

const EditSongForm = ({song}: EditSongFormProps) => {
    const [ showModal, setShowModal ] = useState(false)
    const [ formValues, setFormValues ] = useState({
        title: song.title,
        key: song.key
    })

    const handleSubmit = (formData: FormData) => {
        editSong(song.id, formData)
        setShowModal(false)
    }
    
    const handleChange = (event: any) => {
        const values = {...formValues}
        values[event.target.name as keyof typeof values] = event.target.value

        setFormValues(values)
    }

    return (
        <>
            <ShowModalButton clickHandler={setShowModal} show={showModal} label="Edit" table={true}/>
            <Modal show={showModal}>
                <div className="flex flex-col bg-white border-black border-2 p-5 rounded">
                    <h2 className="text-center text-2xl pb-5">Edit Song</h2>
                    <form action={handleSubmit} className="flex flex-col p-5 border-slate-400 border-2">
                        <div className="p-5">
                            <label htmlFor="title" className="pr-3">Title:</label>
                            <input type="text" name="title" id="title" placeholder="Song title here..." className="rounded p-2" value={formValues.title} onChange={handleChange}/>
                        </div>
                        <div className="p-5">
                            <label htmlFor="key" className="pr-3">Key:</label>
                            <select name="key" id="key" className="rounded p-2" value={formValues.key} onChange={handleChange}>
                                {KEYS.map(key => <option value={key.label} key={key.value}>{key.label}</option>)}
                            </select>
                        </div>
                        <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Save Changes</button>
                        <button className="p-5 mt-5 bg-red-400 rounded font-bold text-lg" onClick={() => setShowModal(false)} type="button">Cancel</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default EditSongForm;