import prisma from "@/utils/db";
import getUser from "@/utils/getUser";
import SetlistEventDetails from '@/components/SetlistEventDetails';
import BandLinks from "@/components/BandLinks";
import BandInfo from "@/components/BandInfo";
import BandNotFound from "@/components/BandNotFound";
import SetListNotFound from "@/components/SetListNotFound";
import SetlistOtherRepertoire from "@/components/SetlistOtherRepertoire";
import SetlistDisplay from "@/components/SetlistDisplay";
import { SetListWithBandAndSets } from "@/types/setlist";


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
            <BandNotFound />
        )
    }

    const setList: SetListWithBandAndSets | null = await prisma.setList.findUnique({
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
            <SetListNotFound bandId={bandId} />
        )
    }

    const songsNotInSetlist = await prisma.song.findMany({
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
                <BandLinks bandId={band.id} songs={songsNotInSetlist} showViewSetlists={true} showShare={false} showCreateSet={false} showPDF={true} showSpotify={hasSpotify} setListsLinkText={"Back To Set Lists"} setList={setList}/>
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
                <SetlistOtherRepertoire songs={songsNotInSetlist} bandId={bandId} />
                <SetlistDisplay setList={setList} songsNotInSetlist={songsNotInSetlist} bandId={bandId}/>
            </div>
        </main>
    )
}

export default SetlistPage;