import SongList from "@/components/SongList";
import prisma from "@/utils/db";
import Link from "next/link";
import { editSetList } from "@/utils/serverActions";
import { Song } from "@prisma/client";
import CreateSpotifyPlaylistModalButton from '@/components/CreateSpotifyPlaylistModalButton';
import ExportPDFButton from '@/components/ExportPDFButton';
import getUser from "@/utils/getUser";
import AddSongToSetDropdown from "@/components/AddSongToSetDropdown";
import EditableField from "@/components/EditableField";
import SetlistEventDetails from '@/components/SetlistEventDetails';


const SetlistPage = async (context: any) => {
    const bandId = context.params.id;
    const setId = context.params.setId;

    const band = await prisma.band.findUnique({
        where: {
            id: Number(bandId),
        },
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

    const setList = await prisma.setList.findUnique({
        where: {
            id: Number(setId),
        },
        include: {
            sets: {
                orderBy: { order: 'asc' },
                include: {
                    setSongs: {
                        orderBy: { order: 'asc' },
                        include: { song: true },
                    },
                },
            },
            band: true
        }
    })

    if (!setList) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Set List not found</h2>
                    <p className="text-gray-500 mb-6">This set list does not exist or has been deleted.</p>
                    <Link 
                        href={`/bands/${bandId}/setlists`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        Back to Set Lists
                    </Link>
                </div>
            </div>
        )
    }

    const songs = await prisma.song.findMany({
        where: {
            bandId: Number(bandId),
            id: {
                notIn: setList.sets.flatMap(set => set.setSongs.map(s => s.songId))
            }
        }
    })

    const session = await getUser();
    const accessToken = session?.accessToken;
    const hasSpotify = !!accessToken;

    const updateSetList = async (song: Song, add: boolean, setIdOverride?: number) => {
        return editSetList(setIdOverride ?? setId, song, add)
    }

    const bandMembers = await prisma.user.findMany({
        where: {
            bands: {
                some: { id: Number(bandId) }
            }
        },
        select: { id: true, name: true, email: true }
    });

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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{setList.name}</span>
                    </div>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <ExportPDFButton setList={{...setList, songs: setList.sets.flatMap(set => set.setSongs.map(s => s.song)), band: setList.band}} />
                    <div className="ml-3">
                        <CreateSpotifyPlaylistModalButton setListId={String(setId)} hasSpotify={hasSpotify} songs={setList.sets.flatMap(set => set.setSongs.map(s => s.song))} />
                    </div>
                    <Link
                        href={`/bands/${bandId}/setlists`}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Back to Set Lists
                    </Link>
                </div>
            </div>

            {/* Event Details Section */}
            <SetlistEventDetails
                setListId={setList.id}
                initialTime={setList.time ? setList.time.toISOString() : null}
                initialEndTime={setList.endTime ? setList.endTime.toISOString() : null}
                initialLocation={setList.location}
                initialDetails={setList.details}
                initialPersonel={setList.personel}
                bandMembers={bandMembers.map(m => ({ ...m, id: Number(m.id) }))}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow rounded-lg order-2 lg:order-1">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Repertoire</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <SongList songList={songs} add={true} />
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg order-1 lg:order-2">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Set List</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        {setList.sets.map(set => (
                            <div key={set.id} className="mb-8">
                                <div className="flex items-center">
                                  <h4 className="text-md font-semibold text-gray-700 mb-4 mt-6 ml-4">{set.name}</h4>
                                  {/* Add button for adding repertoire songs to this set */}
                                  <AddSongToSetDropdown setId={set.id} repertoire={songs} />
                                </div>
                                <SongList songList={set.setSongs.map(s => ({
                                    id: s.id,
                                    setListId: setList.id,
                                    songId: s.songId,
                                    order: s.order,
                                    createdAt: s.createdAt,
                                    updatedAt: s.updatedAt,
                                    song: s.song
                                }))} add={false} setId={set.id} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SetlistPage;