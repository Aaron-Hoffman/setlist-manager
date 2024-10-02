import SongList from "@/components/SongList";
import AddSetListForm from "@/components/AddSetListForm";
import prisma from "@/utils/db";

const SetlistPage = async (context: object) => {
    // This page should show the bands' repertoire on one side and a setlist on the other
    // If a setlist exists already the repertoire should not include songs in the setlist
    // If it's a new setlist, we should show the full repertoire
    // There should be a button to generate a new setlist
    const bandId = context.params.id;
    const setId = context.params.setId;

    const band = await prisma.band.findUnique({
        where: {
            id: Number(bandId),
        },
    })

    const setList = await prisma.setList.findUnique({
        where: {
            id: Number(setId),
        },
        include: {
            songs: true
        }
    })

    const songs = await prisma.song.findMany({
        where: {
            bandId: Number(bandId)
        }
    })

    return (
        <main className="p-24">
            <h2 className="text-3xl underline text-center mb-10">{band.name}</h2>
            <div className="flex flex-row items-start justify-around">
                <h3>Repertoire</h3>
                <SongList songList={songs}/>
            </div>
            <div className="flex flex-row items-start justify-around">
                <h3>Setlist</h3>
                <AddSetListForm songs={songs} bandId={bandId}/>
                {setList && <SongList songList={setList.songs} />}
            </div>
        </main>
    )
}

export default SetlistPage;