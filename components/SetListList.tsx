import { SetListWithSongsAndBand } from "@/types/pdf";
import Link from "next/link";
import DeleteSetListButton from "./DeleteSetListButton";
import ExportPDFButton from "./ExportPDFButton";

export type SetListListProps = {
    setListList: SetListWithSongsAndBand[],
    bandId: number
}

const SetListList = ({bandId, setListList}: SetListListProps) => {
    return (
        <ul className="divide-y divide-gray-200">
            {setListList && setListList.map(setList => (
                <li key={setList.id} className="px-2 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex flex-col gap-2 items-center sm:flex-row sm:items-center sm:justify-between">
                        {/* Info Section */}
                        <div className="flex flex-col items-center sm:flex-row sm:items-center flex-1 min-w-0">
                            <svg className="h-5 w-5 text-gray-400 mb-1 sm:mb-0 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <div className="min-w-0 text-center sm:text-left">
                                <Link 
                                    href={`/bands/${bandId}/setlist/${setList.id}`}
                                    className="text-base font-semibold text-indigo-600 hover:text-indigo-900 truncate block"
                                >
                                    {setList.name}
                                </Link>
                                <div className="mt-1 flex items-center justify-center sm:justify-start text-sm text-gray-500">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                    <span>{setList.songs.length} Songs</span>
                                </div>
                            </div>
                        </div>
                        {/* Actions Section */}
                        <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
                            <span className="text-sm text-gray-500">{new Date(setList.createdAt).toLocaleDateString()}</span>
                            <ExportPDFButton setList={setList} className="w-full sm:w-auto" />
                            <DeleteSetListButton id={setList.id} className="w-full sm:w-auto" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default SetListList;