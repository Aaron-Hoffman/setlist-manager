import KEYS from "@/constants/KEYS";
import Song from "@/types/Song";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const AddSongForm = () => {
    const addSong = async (formData: FormData) => {
        'use server'
        const song: Song = {
          title: formData.get('title'),
          key: formData.get('key')
        }
    
        return await prisma.song.create({
            data: {
             ...song
            },
        })
    }

    return (
        <div className="flex flex-col">
            <h2>Add A Song</h2>
            <form action={addSong}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder="Song title here..."/>
                <label htmlFor="key">Key</label>
                <select name="key" id="key">
                    {KEYS.map(key => <option value={key.value} key={key.value}>{key.label}</option>)}
                </select>
                <button type='submit'>Add Song</button>
            </form>
        </div>
    )
}

export default AddSongForm;