import SongList from "@/components/SongList";
import AddSetListForm from "@/components/AddSetListForm";
import prisma from "@/utils/db";
import Link from "next/link";
import { PageProps } from "@/.next/types/app/page";

const SetlistPage = async (context: PageProps) => {
    const bandId = context.params.id;

    const band = await prisma.band.findUnique({
        where: {
            id: Number(bandId),
        },
    })
    
    const songs = await prisma.song.findMany({
        where: {
            bandId: Number(bandId)
        }
    })

    if (!band) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Band not found</h2>
                    <p className="text-gray-500 mb-6">This band does not exist or has been deleted.</p>
                    <Link 
                        href="/bands" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        Back to Bands
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
                        <Link href={`/bands/${bandId}`} className="hover:text-indigo-600 transition-colors duration-200">
                            {band.name}
                        </Link>
                    </h2>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span>{songs.length} Songs</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow rounded-lg order-2 lg:order-1">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Repertoire</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        {songs.length === 0 ? (
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
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No songs yet</h3>
                                <p className="mt-1 text-sm text-gray-500">Add songs to your band to start creating set lists.</p>
                                <div className="mt-6">
                                    <Link
                                        href={`/bands/${bandId}`}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Songs
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <SongList songList={songs} add={true} bandId={Number(bandId)} />
                        )}
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg order-1 lg:order-2">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Set List</h3>
                    </div>
                    <div className="border-t border-gray-200 p-6">
                        <AddSetListForm songs={songs} bandId={bandId}/>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SetlistPage;