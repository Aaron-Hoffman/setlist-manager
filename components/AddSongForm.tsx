import KEYS from "@/constants/KEYS";
import { revalidatePath } from 'next/cache'
import prisma from "@/utils/db";

export type AddSongFormProps = {
    bandId: number,
}

const AddSongForm = ({bandId}: AddSongFormProps) => {
    const addSong = async (formData: FormData) => {
        'use server'
        const song = {
          title: formData.get('title') as string,
          key: formData.get('key') as string,
          bandId: Number(bandId)
        }
    
       await prisma.song.create({
            data: {
             ...song,
            },
        })
        revalidatePath('/')
        return 
    }

    return (
        <div className="flex flex-col">
            <h2 className="text-center text-2xl pb-5">Add A Song</h2>
            <form action={addSong} className="flex flex-col p-5 border-slate-400 border-2">
                <div className="p-5">
                    <label htmlFor="title" className="pr-3">Title:</label>
                    <input type="text" name="title" id="title" placeholder="Song title here..." className="rounded p-2 "/>
                </div>
                <div className="p-5">
                    <label htmlFor="key" className="pr-3">Key:</label>
                    <select name="key" id="key" className="rounded p-2 ">
                        {KEYS.map(key => <option value={key.label} key={key.value}>{key.label}</option>)}
                    </select>
                </div>
                <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Add Song</button>
            </form>
        </div>
    )
}

export default AddSongForm;