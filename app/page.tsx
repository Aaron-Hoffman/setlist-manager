'use client';

import AddSongForm from "@/components/AddSongForm";
import SongList from "@/components/SongList";
import { useState } from "react";

export default function Home() {
  const [songs, setSongs] = useState([]);

  const addSong = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target.form);
    const song = {
      title: formData.get('title'),
      key: formData.get('key')
    }

    setSongs([...songs, song])
  }
 
  return (
    <>
      <header className="flex flex-col columns-2 items-center justify-between p-24">
        <h1 className="text-4xl">Setlist Manager</h1>
      </header>    
      <main className="flex flex-row items-start justify-around p-24">
        <AddSongForm addSongHandler={addSong}/>
        <SongList songList={songs}/>
      </main>
    </>
  );
}
