'use client'

import { SetList, Song } from "@prisma/client"
import { editSetList } from "@/utils/serverActions"

interface EditSetListButtonProps {
    song: Song;
    add: boolean;
    setList: SetList;
}

const EditSetListButton = ({ song, add, setList }: EditSetListButtonProps) => {
    return (
        <button
            onClick={() => editSetList(setList, song, add)}
            className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md transition-colors duration-200 ${
                add 
                    ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' 
                    : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            }`}
        >
            {add ? (
                <>
                    <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                </>
            ) : (
                <>
                    <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                </>
            )}
        </button>
    )
}

export default EditSetListButton;