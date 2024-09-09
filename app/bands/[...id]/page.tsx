import AddSongForm from "@/components/AddSongForm";
import SongList from "@/components/SongList";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const BandPage = async () => {

  // This page should fetch all songs for the selected band and display a song list and also allow adding, updating, deleting songs

  // Update this query to fetch only songs for given bandId
  const songs = await prisma.song.findMany()

  // const createSetlist = () => {
  //   const setlist = sampleSize(songs, 2);
  //   return setSetlist(setlist);
  // }
 
  return (
    <main className="flex flex-row items-start justify-around p-24">
      <AddSongForm />
      <SongList songList={songs}/>
      {/* <button onClick={createSetlist}>Create Setlist</button> */}
      {/* <h2>SETLIST</h2> */}
      {/* <SongList songList={setlist} /> */}
    </main>
  );
}

export default BandPage;