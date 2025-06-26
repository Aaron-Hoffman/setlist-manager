import DeleteSongButton from "./DeleteSongButton";
import EditSetListButton from "./EditSetListButton";
import EditSongForm from "./EditSongForm";
import { SetList, Song } from "@prisma/client";

export type SongListProps = {
    songList: Song[],
    add?: boolean,
    setList?: SetList
}

const SongList = ({songList, add, setList}: SongListProps) => {
    if (!songList.length) {
        return (
            <div className="text-center py-12">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No songs</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new song.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Artist
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {songList.map((song: Song) => (
                        <tr key={song.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {song.title}
                                {song.spotifyPerfectMatch && (
                                    <span title="Perfect Spotify match" className="inline-block align-middle ml-2" aria-label="Spotify perfect match">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                                            <circle cx="12" cy="12" r="12" fill="#1ED760"/>
                                            <path d="M17.25 16.13a.75.75 0 0 1-1.03.23c-2.82-1.73-6.39-2.12-10.6-1.17a.75.75 0 1 1-.32-1.47c4.6-1.01 8.56-.57 11.7 1.27.36.22.47.69.25 1.03zm1.47-2.93a.94.94 0 0 1-1.29.29c-3.23-2-8.16-2.59-11.98-1.52a.94.94 0 1 1-.53-1.81c4.23-1.23 9.6-.59 13.3 1.7.44.27.58.85.3 1.34zm.16-3.02c-3.7-2.21-9.81-2.42-13.19-1.42a1.13 1.13 0 1 1-.64-2.18c3.85-1.13 10.54-.89 14.7 1.6a1.13 1.13 0 0 1-1.17 1.99z" fill="#fff"/>
                                        </svg>
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {song.artist || '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {song.key}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                    <EditSongForm song={song} />
                                    {!setList && <DeleteSongButton id={song.id} />}
                                    {setList && <EditSetListButton song={song} add={add || false} setList={setList} />}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SongList;