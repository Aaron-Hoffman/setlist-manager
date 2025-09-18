import SongList from "@/components/SongList";
import prisma from "@/utils/db";
import Link from "next/link";
import getUser from "@/utils/getUser";
import AddSongToSetDropdown from "@/components/forms/AddSongToSetDropdown";
import FilteredRepertoire from "@/components/FilteredRepertoire";
import EditableField from '@/components/utility/EditableField';
import SetlistEventDetails from '@/components/SetlistEventDetails';
import BandLinks from "@/components/BandLinks";
import BandInfo from "@/components/BandInfo";


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
                <BandInfo bandName={band.name} numberOfSongs={0} numberOfSetlists={0} numberOfUsers={0} showSongs={false} showUsers={false} showSetlists={false} setListName={setList.name} setListId={setList.id}/>
                <BandLinks bandId={band.id} songs={songs} showViewSetlists={true} showShare={false} showCreateSet={false} showPDF={true} showSpotify={hasSpotify} setListsLinkText={"Back To Set Lists"} setList={setList}/>
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
                        <FilteredRepertoire songs={songs} bandId={Number(bandId)} />
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
                                }))} add={false} setId={set.id} bandId={Number(bandId)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SetlistPage;