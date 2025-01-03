import { PageProps } from "@/.next/types/app/page";
import AddSongForm from "@/components/AddSongForm";
import SongList from "@/components/SongList";
import prisma from "@/utils/db";
import Link from "next/link";

const BandPage = async (context: PageProps) => {
  const bandId = context.params.id;

  const band = await prisma.band.findUnique({
    where: {
      id: Number(bandId),
    },
  })

  if (!band) {
    return (
      <p>This band does not exist or has been deleted.</p>
    )
  }
  
  const songs = await prisma.song.findMany({
    where: {
      bandId: Number(bandId)
    }
  })
 
  return (
    <main className="p-24">
      <h2 className="text-5xl underline text-center mb-10">{band.name}</h2>
      <div className="flex flex-row items-start justify-end pb-10 max-w-6xl">
        <Link href={`/bands/${bandId}/setlists`} className="px-5 text-xl">Setlists</Link>
        <Link href={`/bands/${bandId}/setlist`} className="px-5 text-xl">New Setlist</Link>
        <Link href={`/bands/${bandId}/setlist`} className="px-5 text-xl">Share Band</Link>
      </div>
      <div className="flex flex-row items-start justify-around">
        <AddSongForm bandId={bandId} />
        <div className="mt-12">
          <SongList songList={songs} />
        </div>
      </div>
    </main>
  );
}

export default BandPage;