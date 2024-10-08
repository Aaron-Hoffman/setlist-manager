import SongList from "@/components/SongList";
import AddSetListForm from "@/components/AddSetListForm";
import prisma from "@/utils/db";
import { PageProps } from "@/.next/types/app/page";

const SetlistPage = async (context: PageProps) => {
    const bandId = context.params.id;
    const setId = context.params.setId;

    const band = await prisma.band.findUnique({
        where: {
            id: Number(bandId),
        },
    })

    if (!band) {
        return (
            <p>This band does not exist.</p>
        )
    }

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
            bandId: Number(bandId),
            id: {
                notIn: setList?.songs.map(song => song.id)
            }
        }
    })

    return (
        <main className="p-24">
            <h2 className="text-3xl underline text-center mb-10">{band.name}</h2>
            <div className="flex flex-row items-start">
                <div className="flex flex-col items-start justify-around w-1/2">
                    <h3 className="text-center text-2xl pb-5">Repertoire</h3>
                    <SongList songList={songs}/>
                </div>
                <div className="flex flex-col items-start justify-around w-1/2">
                    <h3 className="text-center text-2xl pb-5">Setlist</h3>
                    {setList && <SongList songList={setList.songs} />}
                </div>
            </div>
        </main>
    )
}

export default SetlistPage;