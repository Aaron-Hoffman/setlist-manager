'use client'

import { User } from '@prisma/client';
import { addBand } from '@/utils/serverActions';
import Modal from './Modal';
import { useState, useRef } from 'react';
import ShowModalButton from './ShowModalButton';

export type AddBandFormProps = {
    user: User | null
}

const AddBandForm = ({user}: AddBandFormProps) => {
    const [ showModal, setShowModal ] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = (formData: FormData) => {
        addBand(user, formData)
        setShowModal(false)
        formRef.current?.reset()
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Band
            </button>
            <Modal show={showModal}>
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Add a New Band</h2>
                    </div>
                    <form ref={formRef} action={handleSubmit} className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Band Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Enter band name..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                Create Band
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default AddBandForm;