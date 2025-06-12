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
    const [show, setShow] = useState(false);

    return (
        <>
            <button
                onClick={() => setShow(true)}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
            </button>
            <Modal show={show}>
                <div className="p-6 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Song</h3>
                    <form action={async (formData: FormData) => {
                        await editSong(song.id, formData);
                        setShow(false);
                    }}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    defaultValue={song.title}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                                    Key
                                </label>
                                <select
                                    name="key"
                                    id="key"
                                    defaultValue={song.key}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                >
                                    {KEYS.map(key => <option value={key.label} key={key.value}>{key.label}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShow(false)}
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default EditSongForm;