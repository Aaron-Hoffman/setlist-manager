import SongList from "@/components/SongList";
import AddSetListForm from "@/components/AddSetListForm";
import prisma from "@/utils/db";

const SetlistPage = async (context: object) => {
    // This page should show the bands' repertoire on one side and a setlist on the other
    // If a setlist exists already the repertoire should not include songs in the setlist
    // If it's a new setlist, we should show the full repertoire
    // There should be a button to generate a new setlist
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

    // let setList = []

    return (
        <main className="p-24">
            <h2 className="text-3xl underline text-center mb-10">{band.name}</h2>
            <div className="flex flex-row items-start justify-around">
                <h3>Repertoire</h3>
                <SongList songList={songs}/>
            </div>
            <div className="flex flex-row items-start justify-around">
                <h3>Setlist</h3>
                <AddSetListForm songs={songs}/>
                {/* <SongList songList={setList} /> */}
            </div>
        </main>
    )
}

export default SetlistPage;