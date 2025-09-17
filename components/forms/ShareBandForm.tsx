'use client'

import { useState, useRef } from 'react';
import Modal from '../utility/Modal';
import { shareBand } from '@/utils/serverActions';
import toast from 'react-hot-toast';

type ShareBandFormProps = {
    bandId: number
}

const ShareBandForm = ({ bandId }: ShareBandFormProps) => {
    const [show, setShow] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <>
            <button
                onClick={() => setShow(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <svg className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
            </button>
            <Modal show={show}>
                <div className="p-6 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Share Band</h3>
                    <form ref={formRef} action={async (formData: FormData) => {
                        try {
                            await shareBand(bandId, formData);
                            toast.success('Band shared successfully!');
                            formRef.current?.reset();
                            setShow(false);
                        } catch (e) {
                            const errorMsg = e instanceof Error && e.message ? e.message : 'Failed to share band.';
                            toast.error(errorMsg);
                        }
                    }}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Enter email address"
                                    required
                                />
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
                                    Share
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default ShareBandForm;