'use client'

import { deleteBand } from "@/utils/serverActions"

export type DeleteBandButtonProps = {
    id: number
}

const DeleteBandButton = ({id}: DeleteBandButtonProps) => {
    return (
        <button 
            onClick={e => deleteBand(id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            title="Delete band"
        >
            <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
            </svg>
        </button>
    )
}

export default DeleteBandButton;