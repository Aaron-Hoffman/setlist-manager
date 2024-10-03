import SongList from "@/components/SongList";
import AddSetListForm from "@/components/AddSetListForm";
import prisma from "@/utils/db";

const SetlistPage = async (context: object) => {
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

    return (
        <main className="p-24">
            <h2 className="text-3xl underline text-center mb-10">{band?.name}</h2>
            <div className="flex flex-row items-start">
                <div className="flex flex-col items-start justify-around w-1/2">
                    <h3 className="text-center text-2xl pb-5">Repertoire</h3>
                    <SongList songList={songs}/>
                </div>
                <div className="flex flex-col items-start justify-around w-1/2">
                    <AddSetListForm songs={songs} bandId={bandId}/>
                </div>
            </div>
        </main>
    )
}

export default SetlistPage;