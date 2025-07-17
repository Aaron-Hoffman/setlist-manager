'use client'

import { useState, useRef } from "react";
import Modal from "./Modal";
import KEYS from "@/constants/KEYS";
import { addSong } from "@/utils/serverActions";
import EditableList from "./EditablePersonelList";

async function uploadChartFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.filePath || null;
}

type AddSongFormProps = {
    bandId: string
}

const AddSongForm = ({ bandId }: AddSongFormProps) => {
    const [show, setShow] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [chartFile, setChartFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    return (
        <>
            <button
                onClick={() => setShow(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Song
            </button>
            <Modal show={show}>
                <div className="p-6 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Song</h3>
                    <form ref={formRef} action={async (formData: FormData) => {
                        setUploading(true);
                        let chartPath = '';
                        if (chartFile) {
                            chartPath = (await uploadChartFile(chartFile)) || '';
                        }
                        if (chartPath) {
                            formData.set('chart', chartPath);
                        } else {
                            formData.delete('chart');
                        }
                        // Add tags as JSON array if present
                        if (tags.length > 0) {
                            formData.set('tags', JSON.stringify(tags));
                        } else {
                            formData.delete('tags');
                        }
                        await addSong(Number(bandId), formData);
                        formRef.current?.reset();
                        setChartFile(null);
                        setTags([]);
                        setUploading(false);
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
                                    Artist
                                </label>
                                <input
                                    type="text"
                                    name="artist"
                                    id="artist"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Artist or band"
                                />
                            </div>
                            <div>
                                <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                                    Key
                                </label>
                                <select
                                    name="key"
                                    id="key"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                >
                                    {KEYS.map((key: { label: string; value: string }) => (
                                        <option value={key.label} key={key.value}>{key.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="chart" className="block text-sm font-medium text-gray-700">
                                    Chart (PDF, image, or text file)
                                </label>
                                <input
                                    type="file"
                                    name="chart"
                                    id="chart"
                                    accept=".pdf,image/*,text/*"
                                    className="mt-1 block w-full text-sm text-gray-700"
                                    onChange={e => setChartFile(e.target.files?.[0] || null)}
                                />
                            </div>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                                    Tags
                                </label>
                                <EditableList
                                    value={tags}
                                    onChange={setTags}
                                    placeholder="Add tag"
                                />
                                {/* Hidden input for form submission */}
                                <input type="hidden" name="tags" value={JSON.stringify(tags)} />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShow(false)}
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Add Song'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default AddSongForm;