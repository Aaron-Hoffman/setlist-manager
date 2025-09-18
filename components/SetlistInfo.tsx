import { SetListWithSets, Set } from "./SetListList";
import Link from "next/link";

export type SetlistInfoProps = {
    setlist: SetListWithSets,
    bandId: number
}

const SetlistInfo = ({bandId, setlist}: SetlistInfoProps) => {
    return (
        <div className="flex flex-col items-center sm:flex-row sm:items-center flex-1 min-w-0">
            <svg className="h-5 w-5 text-gray-400 mb-1 sm:mb-0 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div className="min-w-0 text-center sm:text-left">
                <Link 
                    href={`/bands/${bandId}/setlist/${setlist.id}`}
                    className="text-base font-semibold text-indigo-600 hover:text-indigo-900 truncate block"
                >
                    {setlist.name}
                </Link>
                <div className="mt-1 flex items-center justify-center sm:justify-start text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span>{
                        Array.isArray(setlist.sets) && setlist.sets.length > 0
                            ? setlist.sets.reduce((acc: number, set: Set) => acc + (set.setSongs?.length || 0), 0)
                            : setlist.songs.length
                    } Songs</span>
                </div>
            </div>
        </div>
    )
}

export default SetlistInfo;