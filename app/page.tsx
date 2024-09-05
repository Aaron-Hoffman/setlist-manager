'use client';

import AddSongForm from "@/components/AddSongForm";
import SongList from "@/components/SongList";
import Song from "@/types/Song";
import { useState } from "react";
import { sampleSize } from "lodash";
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()


export default function Home() {
  const [songs, setSongs] = useState([]);
  const [setlist, setSetlist] = useState([]);

  const addSong = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target.form);
    const song: Song = {
      title: formData.get('title'),
      key: formData.get('key')
    }

    // await prisma.song.create({
    //   data: {
    //    ...song
    //   },
    // })
  

    return setSongs([...songs, song])
  }

  const createSetlist = () => {
    const setlist = sampleSize(songs, 2);
    return setSetlist(setlist);
  }
 
  return (
    <main className="flex flex-row items-start justify-around p-24">
      <AddSongForm addSongHandler={addSong}/>
      <SongList songList={songs}/>
      <button onClick={createSetlist}>Create Setlist</button>
      <h2>SETLIST</h2>
      <SongList songList={setlist} />
    </main>
  );
}
