import { SetList, Song } from "@prisma/client";
import Link from "next/link";
import DeleteSetListButton from "./DeleteSetListButton";

export type SetListListProps = {
    setListList: (SetList & { songs: Song[] })[],
    bandId: number
}

const SetListList = ({bandId, setListList}: SetListListProps) => {
    return (
        <ul className="divide-y divide-gray-200">
            {setListList && setListList.map(setList => (
                <li key={setList.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <div>
                                <Link 
                                    href={`/bands/${bandId}/setlist/${setList.id}`}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                >
                                    {setList.name}
                                </Link>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                    <span>{setList.songs.length} Songs</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                {new Date(setList.createdAt).toLocaleDateString()}
                            </span>
                            <DeleteSetListButton id={setList.id} />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default SetListList;