import prisma from '@/utils/db';
import { User } from '@prisma/client';
import { revalidatePath } from 'next/cache'

export type AddBandFormProps = {
    user: User | null
}

const AddBandForm = async ({user}: AddBandFormProps) => {

    const addBand = async (formData: FormData) => {
        'use server'
        if (!user) {
            return "Error must sign in to create a band";
        }
    
       await prisma.band.create({
            data: {
                name: formData.get('name') as string,
                userId: user.id
            },
        })
        return revalidatePath('/bands')
    }

    return (
        <div className="flex flex-col">
            <h2 className="text-center text-2xl pb-5">Add A Band</h2>
            <form action={addBand} className="flex flex-col p-5 border-slate-400 border-2">
                <div className="p-5">
                    <label htmlFor="name" className="pr-3">Name:</label>
                    <input type="text" name="name" id="name" placeholder="Band name here..." className="rounded p-2 "/>
                </div>
                <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Add Band</button>
            </form>
        </div>
    )
}

export default AddBandForm;