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
                                    <span title="Perfect Spotify match" className="inline-block align-middle ml-2">
                                        <svg width="18" height="18" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                                            <circle cx="84" cy="84" r="84" fill="#1ED760"/>
                                            <path d="M123.6 115.2c-2.4 3.6-6.8 4.8-10.4 2.8-28.4-17.2-64.4-21.2-106.8-12.4-4.2.8-8.4-1.8-9.2-6-1-4.2 1.8-8.4 6-9.2 45.2-9.2 84.4-4.8 115.2 13.2 3.6 2.2 4.8 6.8 2.8 10.4zm14.8-28.8c-3 4.4-8.8 5.8-13.2 2.8-32.4-20-81.6-25.8-119.6-15.2-5 1.4-10.2-1.4-11.6-6.4-1.4-5 1.4-10.2 6.4-11.6 42.8-11.8 96.8-5.6 133.2 17 4.4 2.8 5.8 8.8 2.8 13.2zm15.2-32.4c-38.2-22.6-101.2-24.8-137.2-14.6-6 1.6-12.2-1.6-13.8-7.6-1.6-6 1.6-12.2 7.6-13.8 40.8-11.2 109.2-8.8 152.8 16.2 5.4 3.2 7.2 10.2 4 15.6-3.2 5.4-10.2 7.2-15.6 4z" fill="#fff"/>
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
                                    {!setList && <EditSongForm song={song} />}
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