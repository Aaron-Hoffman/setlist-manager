'use client'

import { Song } from '@prisma/client';
import { addSetList } from '@/utils/serverActions';
import Modal from './Modal';
import { useState, useRef } from 'react';
import { sampleSize } from 'lodash';

export type AddSetListFormProps = {
    bandId: number,
    songs: Song[]
}

const AddSetListForm = ({bandId, songs}: AddSetListFormProps) => {
    const [showModal, setShowModal] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const [numSets, setNumSets] = useState(1);
    const [songsPerSet, setSongsPerSet] = useState([1]);
    // New state for personnel emails
    const [personelEmail, setPersonelEmail] = useState("");
    const [personelList, setPersonelList] = useState<string[]>([]);

    // Update songsPerSet array when numSets changes
    const handleNumSetsChange = (n: number) => {
        setNumSets(n);
        setSongsPerSet(prev => {
            const arr = [...prev];
            if (n > arr.length) {
                return arr.concat(Array(n - arr.length).fill(1));
            } else {
                return arr.slice(0, n);
            }
        });
    };

    // Handle number of songs per set change
    const handleSongsPerSetChange = (idx: number, value: number) => {
        setSongsPerSet(prev => prev.map((v, i) => i === idx ? value : v));
    };

    const handleSubmit = (formData: FormData) => {
        // Add personnel emails as JSON string
        formData.set('personel', JSON.stringify(personelList));
        // Randomly select songs for each set, no duplicates across sets
        let available = [...songs];
        const sets = songsPerSet.map((num, idx) => {
            const selected = sampleSize(available, num);
            available = available.filter(s => !selected.includes(s));
            return {
                name: `Set ${idx + 1}`,
                songIds: selected.map(s => s.id)
            };
        });
        addSetList(bandId, sets, formData)
        setShowModal(false)
        formRef.current?.reset()
        setNumSets(1);
        setSongsPerSet([1]);
    }

    // If no songs, show disabled button with message
    if (songs.length === 0) {
        return (
            <div className="text-center">
                <button
                    disabled
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-400 bg-gray-300 cursor-not-allowed"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Set List
                </button>
                <p className="mt-2 text-sm text-gray-500">
                    Add songs to your band before creating a set list
                </p>
            </div>
        )
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Set List
            </button>
            <Modal show={showModal}>
                <div className="p-6 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Set List</h3>
                            <div className="mt-2">
                                <form ref={formRef} action={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Set List Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            placeholder="Set list name here..."
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="numSets" className="block text-sm font-medium text-gray-700">Number of Sets</label>
                                        <input
                                            type="number"
                                            name="numSets"
                                            id="numSets"
                                            min={1}
                                            max={songs.length}
                                            value={numSets}
                                            onChange={e => handleNumSetsChange(Number(e.target.value))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {Array.from({ length: numSets }).map((_, idx) => (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium text-gray-700">Number of Songs in Set {idx + 1}</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={songs.length - songsPerSet.slice(0, idx).reduce((a, b) => a + b, 0)}
                                                value={songsPerSet[idx]}
                                                onChange={e => handleSongsPerSetChange(idx, Number(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    ))}
                                    {/* Event Details Section */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h4 className="text-md font-semibold text-gray-700 mb-4">Event Details</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                                                <input
                                                    type="datetime-local"
                                                    name="time"
                                                    id="time"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    id="location"
                                                    placeholder="Venue, city, etc."
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
                                                <textarea
                                                    name="details"
                                                    id="details"
                                                    placeholder="Any extra details about this set list..."
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    rows={3}
                                                />
                                            </div>
                                            {/* Personnel email input */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Band Member Emails</label>
                                                <div className="flex gap-2 mt-1">
                                                    <input
                                                        type="email"
                                                        value={personelEmail}
                                                        onChange={e => setPersonelEmail(e.target.value)}
                                                        placeholder="Enter email and press Add"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (personelEmail && !personelList.includes(personelEmail)) {
                                                                setPersonelList([...personelList, personelEmail]);
                                                                setPersonelEmail("");
                                                            }
                                                        }}
                                                        className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                {/* List of added emails */}
                                                {personelList.length > 0 && (
                                                    <ul className="mt-2 space-y-1">
                                                        {personelList.map((email, idx) => (
                                                            <li key={idx} className="flex items-center justify-between bg-gray-100 rounded px-2 py-1 text-sm">
                                                                <span>{email}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPersonelList(personelList.filter(e => e !== email))}
                                                                    className="ml-2 text-red-500 hover:text-red-700 text-xs"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {/* Hidden input for form submission */}
                                                <input type="hidden" name="personel" value={JSON.stringify(personelList)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Create
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AddSetListForm;