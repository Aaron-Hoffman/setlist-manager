import AddSongForm from "@/components/AddSongForm";
import SongList from "@/components/SongList";
import prisma from "@/utils/db";



const BandPage = async (context: object) => {
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

  // const createSetlist = () => {
  //   const setlist = sampleSize(songs, 2);
  //   return setSetlist(setlist);
  // }
 
  return (
    <main className="p-24">
      <h2 className="text-3xl underline text-center mb-10">{band.name}</h2>
      <div className="flex flex-row items-start justify-around">
        <AddSongForm bandId={bandId} />
        <SongList songList={songs}/>
      </div>
      {/* <button onClick={createSetlist}>Create Setlist</button> */}
      {/* <h2>SETLIST</h2> */}
      {/* <SongList songList={setlist} /> */}
    </main>
  );
}

export default BandPage;