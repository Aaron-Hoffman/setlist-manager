export type BandInfoProps = {
    bandName: string,
    numberOfSongs: number,
    numberOfSetlists: number,
    numberOfUsers: number
}

const BandInfo = ({bandName, numberOfSongs, numberOfSetlists, numberOfUsers}: BandInfoProps) => {

    return (
        <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
            {bandName}
            </h2>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
                <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span>{numberOfSongs} Songs</span>
            </div>
            <div className="flex items-center">
                <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{numberOfSetlists} Set Lists</span>
            </div>
            <div className="flex items-center">
                <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>{numberOfUsers} User{numberOfUsers !== 1 ? 's' : ''}</span>
            </div>
            </div>
        </div>
    )
}

export default BandInfo;