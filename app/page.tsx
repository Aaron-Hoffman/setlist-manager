import AddSongForm from "@/components/AddSongForm";
import SongList from "@/components/SongList";
import Song from "@/types/Song";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function Home() {
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
