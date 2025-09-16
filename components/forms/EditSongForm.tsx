'use client'

import KEYS from "@/constants/KEYS";
import { editSong } from "@/utils/serverActions";
import Modal from '../utility/Modal';
import { useState, useEffect } from 'react';
import { Song } from "@prisma/client";
import EditableList from "../EditablePersonelList";
import { formatKeyLabel } from '../../utils/formatKeyLabel';

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

export type EditSongFormProps = {
    song: Song,
}

const EditSongForm = ({song}: EditSongFormProps) => {
    const [show, setShow] = useState(false);
    const [chartFile, setChartFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [removeChart, setRemoveChart] = useState(false);

    // Parse initial tags from song.tags (which is Json | null)
    let initialTags: string[] = [];
    if (Array.isArray(song.tags)) {
        initialTags = song.tags.map(String);
    } else if (typeof song.tags === "string") {
        try {
            const parsed = JSON.parse(song.tags);
            if (Array.isArray(parsed)) {
                initialTags = parsed.map(String);
            }
        } catch {}
    }
    const [tags, setTags] = useState<string[]>(initialTags);
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (show && song.bandId) {
            fetch(`/api/tags?bandId=${song.bandId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setTagSuggestions(data);
                });
        }
    }, [show, song.bandId]);

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
                        setUploading(true);
                        let chartPath = song.chart || '';
                        if (removeChart) {
                            // Remove chart: delete file and clear field
                            if (song.chart) {
                                await fetch('/api/delete-upload', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ filePath: song.chart }),
                                });
                            }
                            formData.delete('chart');
                        } else if (chartFile) {
                            chartPath = (await uploadChartFile(chartFile)) || song.chart || '';
                            if (chartPath) {
                                formData.set('chart', chartPath);
                            } else {
                                formData.delete('chart');
                            }
                        } else if (chartPath) {
                            formData.set('chart', chartPath);
                        } else {
                            formData.delete('chart');
                        }
                        // Add tags as JSON array if present
                        formData.set('tags', JSON.stringify(tags));
                        await editSong(song.id, formData);
                        setChartFile(null);
                        setRemoveChart(false);
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
                                    defaultValue={song.title}
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
                                    defaultValue={song.artist || ''}
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
                                    defaultValue={song.key}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                >
                                    {KEYS.map(key => <option value={key.label} key={key.value}>{formatKeyLabel(key.label)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                                    Tags
                                </label>
                                <EditableList
                                    value={tags}
                                    onChange={setTags}
                                    placeholder="Add tag"
                                    suggestions={tagSuggestions}
                                />
                                {/* Hidden input for form submission */}
                                <input type="hidden" name="tags" value={JSON.stringify(tags)} />
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
                                    disabled={removeChart}
                                />
                                {song.chart && !chartFile && !removeChart && (
                                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                                        <span>Current: <a href={song.chart} target="_blank" rel="noopener noreferrer" className="underline">View Chart</a></span>
                                        <button
                                            type="button"
                                            className="text-red-600 underline text-xs ml-2"
                                            onClick={() => setRemoveChart(true)}
                                        >
                                            Remove Chart
                                        </button>
                                    </div>
                                )}
                                {removeChart && (
                                    <div className="mt-2 text-xs text-red-600">Chart will be removed.</div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => { setShow(false); setRemoveChart(false); setChartFile(null); }}
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
                                    {uploading ? 'Uploading...' : 'Save Changes'}
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