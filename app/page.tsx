'use client';

import AddSongForm from "@/components/AddSongForm";
import SongList from "@/components/SongList";
import Song from "@/types/Song";
import { useState } from "react";
import { sampleSize } from "lodash";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [setlist, setSetlist] = useState([]);

  const addSong = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target.form);
    const song: Song = {
      title: formData.get('title'),
      key: formData.get('key')
    }

    return setSongs([...songs, song])
  }

  const createSetlist = () => {
    const setlist = sampleSize(songs, 2);
    return setSetlist(setlist);
  }
 
  return (
    <>
      <header className="flex flex-col columns-2 items-center justify-between p-24">
        <h1 className="text-4xl">Setlist Manager</h1>
      </header>    
      <main className="flex flex-row items-start justify-around p-24">
        <AddSongForm addSongHandler={addSong}/>
        <SongList songList={songs}/>
        <button onClick={createSetlist}>Create Setlist</button>
        <h2>SETLIST</h2>
        <SongList songList={setlist} />
      </main>
    </>
  );
}
