import prisma from '@/utils/db';
import { User, Song } from '@prisma/client';
import { revalidatePath } from 'next/cache'
import createSetList from '@/utils/createSetlist';

export type AddSetListFormProps = {
    songs: Song[]
}

const AddSetListForm = async ({songs}: AddSetListFormProps) => {

    const addSetList = async (formData: FormData) => {
        'use server'
        const setList = {
          name: formData.get('name') as string,
          songs: createSetList(songs, 5)
        }
    
    //    await prisma.setlist.create({
    //         data: {
    //             name: formData.get('name') as string,
    //             userId: user.id
    //         },
    //     })
        console.log(setList)
        // return revalidatePath('/bands')
    }

    return (
        <div className="flex flex-col">
            <h2 className="text-center text-2xl pb-5">Create a Set List</h2>
            <form action={addSetList} className="flex flex-col p-5 border-slate-400 border-2">
                <div className="p-5">
                    <label htmlFor="name" className="pr-3">Name:</label>
                    <input type="text" name="name" id="name" placeholder="Set list name here..." className="rounded p-2 "/>
                </div>
                <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Create Set List</button>
            </form>
        </div>
    )
}

export default AddSetListForm;