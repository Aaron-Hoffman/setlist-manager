import SongList from "@/components/SongList";
import AddSetListForm from "@/components/forms/AddSetListForm";
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

    return (
        <main className="p-24">
            <h2 className="text-3xl underline text-center mb-10"><Link href={`/bands/${bandId}`}>{band?.name}</Link></h2>
            <div className="flex flex-row items-start">
                <div className="flex flex-col items-start justify-around w-1/2 mr-12">
                    <h3 className="text-center text-2xl pb-5">Repertoire</h3>
                    <SongList songList={songs}/>
                </div>
                <div className="flex flex-col items-start justify-around w-1/2 mt-7">
                    <AddSetListForm songs={songs} bandId={bandId}/>
                </div>
            </div>
        </main>
    )
}

export default SetlistPage;